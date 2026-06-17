const mongoose = require('mongoose');

const subcategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a subcategory name'],
    trim: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Please provide a category']
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

// Prevent duplicate subcategory names within the same category for the same user
subcategorySchema.index({ name: 1, category: 1, user: 1 }, { unique: true });

module.exports = mongoose.model('Subcategory', subcategorySchema);
