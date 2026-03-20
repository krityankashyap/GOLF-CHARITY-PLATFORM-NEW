import Subscription from '../schema/subscription.js';
import CrudRepository from './crudRepository.js';

class SubscriptionRepository extends CrudRepository {
  constructor() {
    super(Subscription);
  }

  async findByUserId(userId) {
    return Subscription.findOne({ userId }).exec();
  }

  async findByStripeSubscriptionId(stripeSubId) {
    return Subscription.findOne({ stripeSubscriptionId: stripeSubId }).exec();
  }

  async findByStripeCustomerId(customerId) {
    return Subscription.findOne({ stripeCustomerId: customerId }).exec();
  }

  async countActive() {
    return Subscription.countDocuments({ status: 'active' }).exec();
  }

  async findAllActive() {
    return Subscription.find({ status: 'active' }).populate('userId', 'name email').exec();
  }
}

export default new SubscriptionRepository();
