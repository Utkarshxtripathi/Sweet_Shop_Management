/**
 * Sweet Model
 * Mongoose schema for sweet/sweet items in the shop
 * Tracks inventory, pricing, and categorization
 */

import mongoose from 'mongoose';

const sweetSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a sweet name'],
      trim: true,
      maxlength: [100, 'Name cannot be more than 100 characters'],
    },
    category: {
      type: String,
      required: [true, 'Please provide a category'],
      trim: true,
      maxlength: [50, 'Category cannot be more than 50 characters'],
    },
    price: {
      type: Number,
      required: [true, 'Please provide a price'],
      min: [0, 'Price cannot be negative'],
    },
    quantity: {
      type: Number,
      required: [true, 'Please provide quantity'],
      min: [0, 'Quantity cannot be negative'],
      default: 0,
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot be more than 500 characters'],
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

// Index for faster search queries
sweetSchema.index({ name: 'text', category: 'text' });
sweetSchema.index({ category: 1 });
sweetSchema.index({ price: 1 });

const Sweet = mongoose.model('Sweet', sweetSchema);

export default Sweet;

