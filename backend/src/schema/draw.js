import mongoose from 'mongoose';

const drawSchema = new mongoose.Schema(
  {
    month: {
      type: Number,
      required: [true, 'Month is required'],
      min: 1,
      max: 12,
    },
    year: {
      type: Number,
      required: [true, 'Year is required'],
    },
    drawNumbers: {
      type: [Number],
      default: [],
    },
    drawType: {
      type: String,
      enum: ['random', 'algorithmic'],
      default: 'random',
    },
    status: {
      type: String,
      enum: ['pending', 'simulated', 'published'],
      default: 'pending',
    },
    prizePool: {
      total: { type: Number, default: 0 },
      jackpot: {
        amount: { type: Number, default: 0 },
        rollover: { type: Number, default: 0 },
      },
      fourMatch: { type: Number, default: 0 },
      threeMatch: { type: Number, default: 0 },
    },
    activeSubscribers: {
      type: Number,
      default: 0,
    },
    jackpotRollover: {
      type: Number,
      default: 0,
    },
    winnersPublished: {
      type: Boolean,
      default: false,
    },
    simulationResult: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

drawSchema.index({ month: 1, year: 1 }, { unique: true });

const Draw = mongoose.model('Draw', drawSchema);

export default Draw;
