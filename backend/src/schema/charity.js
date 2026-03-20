import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    date: { type: Date },
    location: { type: String },
  },
  { _id: true }
);

const charitySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Charity name is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Charity description is required'],
    },
    images: {
      type: [String],
      default: [],
    },
    events: {
      type: [eventSchema],
      default: [],
    },
    featured: {
      type: Boolean,
      default: false,
    },
    active: {
      type: Boolean,
      default: true,
    },
    totalContributed: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Charity = mongoose.model('Charity', charitySchema);

export default Charity;
