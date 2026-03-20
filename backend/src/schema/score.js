import mongoose from 'mongoose';

const scoreSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      unique: true,
    },
    scores: [
      {
        value: {
          type: Number,
          required: [true, 'Score value is required'],
          min: [1, 'Score must be at least 1'],
          max: [45, 'Score must be at most 45'],
        },
        date: {
          type: Date,
          required: [true, 'Score date is required'],
        },
        _id: false,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Score = mongoose.model('Score', scoreSchema);

export default Score;
