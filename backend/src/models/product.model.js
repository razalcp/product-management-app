const mongoose = require('mongoose');

const variantSchema = new mongoose.Schema({
  ram: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  quantity: {
    type: Number,
    required: true,
    min: 0,
  }
});

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a product name'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Please provide a product description'],
  },
  image: {
    publicId: {
      type: String,
    },
    url: {
      type: String,
    }
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Please provide a category'],
  },
  subCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subcategory',
    required: [true, 'Please provide a subcategory'],
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  variants: [variantSchema]
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
