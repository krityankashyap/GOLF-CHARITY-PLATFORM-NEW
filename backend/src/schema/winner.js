import mongoose from 'mongoose';

const winnerSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    drawId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Draw',
      required: [true, 'Draw ID is required'],
    },
    matchType: {
      type: String,
      enum: ['5-match', '4-match', '3-match'],
      required: [true, 'Match type is required'],
    },
    matchedNumbers: {
      type: [Number],
      default: [],
    },
    prizeAmount: {
      type: Number,
      required: [true, 'Prize amount is required'],
    },
    verificationStatus: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid'],
      default: 'pending',
    },
    proofUrl: {
      type: String,
      default: null,
    },
    proofUploadedAt: {
      type: Date,
      default: null,
    },
    adminNote: {
      type: String,
      default: null,
    },
    paidAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Winner = mongoose.model('Winner', winnerSchema);

export default Winner;
