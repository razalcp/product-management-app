const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a category name'],
    trim: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

// Ensure unique category names per user
categorySchema.index({ name: 1, user: 1 }, { unique: true });

module.exports = mongoose.model('Category', categorySchema);
