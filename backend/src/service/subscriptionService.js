import stripe from '../config/stripeConfig.js';
import serverConfig from '../config/serverConfig.js';
import subscriptionRepository from '../repositories/subscriptionRepository.js';
import userRepository from '../repositories/userRepository.js';
import charityRepository from '../repositories/charityRepository.js';
import { addMailJob } from '../producers/mailQueueProducer.js';
import ClientError from '../utils/errors/ClientError.js';

const subscriptionService = {
  async createCheckoutSession(userId, plan) {
    const user = await userRepository.findById(userId);

    let stripeCustomerId = null;
    const existingSub = await subscriptionRepository.findByUserId(userId);
    if (existingSub && existingSub.stripeCustomerId) {
      stripeCustomerId = existingSub.stripeCustomerId;
    } else {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name,
        metadata: { userId: userId.toString() },
      });
      stripeCustomerId = customer.id;
    }

    const priceId =
      plan === 'yearly'
        ? serverConfig.STRIPE_YEARLY_PRICE_ID
        : serverConfig.STRIPE_MONTHLY_PRICE_ID;

    const session = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: 'subscription',
      success_url: `${serverConfig.FRONTEND_URL}/subscribe/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${serverConfig.FRONTEND_URL}/subscribe`,
      metadata: { userId: userId.toString(), plan },
    });

    return { url: session.url, sessionId: session.id };
  },

  async handleWebhook(rawBody, signature) {
    let event;
    try {
      event = stripe.webhooks.constructEvent(rawBody, signature, serverConfig.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
      throw new ClientError('WebhookError', `Webhook verification failed: ${err.message}`, 400);
    }

    switch (event.type) {
      case 'checkout.session.completed':
        await subscriptionService._handleCheckoutCompleted(event.data.object);
        break;
      case 'invoice.payment_succeeded':
        await subscriptionService._handlePaymentSucceeded(event.data.object);
        break;
      case 'invoice.payment_failed':
        await subscriptionService._handlePaymentFailed(event.data.object);
        break;
      case 'customer.subscription.deleted':
        await subscriptionService._handleSubscriptionDeleted(event.data.object);
        break;
      default:
        break;
    }

    return { received: true };
  },

  async _handleCheckoutCompleted(session) {
    const { userId, plan } = session.metadata;
    const stripeSubscription = await stripe.subscriptions.retrieve(session.subscription);

    const amount =
      plan === 'yearly' ? serverConfig.YEARLY_PLAN_AMOUNT : serverConfig.MONTHLY_PLAN_AMOUNT;
    const prizePoolContribution = Math.round((amount * serverConfig.PRIZE_POOL_PERCENT) / 100);
    const charityContribution = Math.round(
      (amount * serverConfig.MIN_CHARITY_PERCENT) / 100
    );

    const nextRenewalDate = new Date(stripeSubscription.current_period_end * 1000);

    let sub = await subscriptionRepository.findByUserId(userId);

    if (sub) {
      sub = await subscriptionRepository.update(sub._id, {
        plan,
        status: 'active',
        stripeSubscriptionId: stripeSubscription.id,
        stripeCustomerId: session.customer,
        amount,
        prizePoolContribution,
        charityContribution,
        startDate: new Date(),
        nextRenewalDate,
        cancelledAt: null,
      });
    } else {
      sub = await subscriptionRepository.create({
        userId,
        plan,
        status: 'active',
        stripeSubscriptionId: stripeSubscription.id,
        stripeCustomerId: session.customer,
        amount,
        prizePoolContribution,
        charityContribution,
        startDate: new Date(),
        nextRenewalDate,
      });
      await userRepository.updateSubscription(userId, sub._id);
    }

    const user = await userRepository.findById(userId);
    await addMailJob({
      to: user.email,
      subject: 'Your Golf Charity subscription is active!',
      html: `
        <h2>Welcome to the club, ${user.name}!</h2>
        <p>Your <strong>${plan}</strong> subscription is now active.</p>
        <p>Your next renewal date is <strong>${nextRenewalDate.toLocaleDateString()}</strong>.</p>
        <p>You can now enter your golf scores and participate in monthly draws.</p>
        <a href="${serverConfig.FRONTEND_URL}/dashboard" style="background:#c9a227;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;">Go to Dashboard</a>
      `,
    });

    if (user.selectedCharity) {
      await charityRepository.incrementContribution(user.selectedCharity, charityContribution);
    }
  },

  async _handlePaymentSucceeded(invoice) {
    if (!invoice.subscription) return;
    const sub = await subscriptionRepository.findByStripeSubscriptionId(invoice.subscription);
    if (!sub) return;

    const stripeSubscription = await stripe.subscriptions.retrieve(invoice.subscription);
    const nextRenewalDate = new Date(stripeSubscription.current_period_end * 1000);

    await subscriptionRepository.update(sub._id, {
      status: 'active',
      nextRenewalDate,
    });
  },

  async _handlePaymentFailed(invoice) {
    if (!invoice.subscription) return;
    const sub = await subscriptionRepository.findByStripeSubscriptionId(invoice.subscription);
    if (!sub) return;

    await subscriptionRepository.update(sub._id, { status: 'lapsed' });

    const user = await userRepository.findById(sub.userId);
    await addMailJob({
      to: user.email,
      subject: 'Payment failed - Golf Charity subscription',
      html: `
        <h2>Payment Failed</h2>
        <p>Hi ${user.name}, we were unable to process your subscription payment.</p>
        <p>Please update your payment method to continue enjoying Golf Charity benefits.</p>
        <a href="${serverConfig.FRONTEND_URL}/subscribe" style="background:#c9a227;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;">Update Payment</a>
      `,
    });
  },

  async _handleSubscriptionDeleted(stripeSubscription) {
    const sub = await subscriptionRepository.findByStripeSubscriptionId(stripeSubscription.id);
    if (!sub) return;
    await subscriptionRepository.update(sub._id, {
      status: 'cancelled',
      cancelledAt: new Date(),
    });
  },

  async getMySubscription(userId) {
    const sub = await subscriptionRepository.findByUserId(userId);
    if (!sub) {
      throw new ClientError('NotFound', 'No subscription found', 404);
    }
    return sub;
  },

  async cancelSubscription(userId) {
    const sub = await subscriptionRepository.findByUserId(userId);
    if (!sub || sub.status !== 'active') {
      throw new ClientError('NotFound', 'No active subscription to cancel', 404);
    }

    if (sub.stripeSubscriptionId) {
      await stripe.subscriptions.update(sub.stripeSubscriptionId, {
        cancel_at_period_end: true,
      });
    }

    const updated = await subscriptionRepository.update(sub._id, {
      status: 'cancelled',
      cancelledAt: new Date(),
    });

    const user = await userRepository.findById(userId);
    await addMailJob({
      to: user.email,
      subject: 'Subscription cancelled - Golf Charity',
      html: `
        <h2>Subscription Cancelled</h2>
        <p>Hi ${user.name}, your Golf Charity subscription has been cancelled.</p>
        <p>You will retain access until the end of your current billing period.</p>
        <p>We hope to see you back soon!</p>
      `,
    });

    return updated;
  },

  async updateCharity(userId, charityId) {
    const user = await userRepository.update(userId, { selectedCharity: charityId });
    return user;
  },

  async updateCharityPercent(userId, percent) {
    if (percent < 10 || percent > 100) {
      throw new ClientError('InvalidInput', 'Charity contribution must be between 10% and 100%', 400);
    }
    return userRepository.update(userId, { charityContributionPercent: percent });
  },
};

export default subscriptionService;
