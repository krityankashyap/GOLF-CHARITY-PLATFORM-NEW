import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    plan: {
      type: String,
      enum: ['monthly', 'yearly'],
      required: [true, 'Plan is required'],
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'lapsed', 'cancelled'],
      default: 'inactive',
    },
    stripeSubscriptionId: {
      type: String,
      default: null,
    },
    stripeCustomerId: {
      type: String,
      default: null,
    },
    amount: {
      type: Number,
      default: 0,
    },
    prizePoolContribution: {
      type: Number,
      default: 0,
    },
    charityContribution: {
      type: Number,
      default: 0,
    },
    startDate: {
      type: Date,
      default: null,
    },
    nextRenewalDate: {
      type: Date,
      default: null,
    },
    cancelledAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Subscription = mongoose.model('Subscription', subscriptionSchema);

export default Subscription;
