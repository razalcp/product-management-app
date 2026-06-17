const Product = require('../models/product.model');

const create = async (data) => {
  return await Product.create(data);
};

const findAllByUser = async (userId) => {
  return await Product.find({ user: userId })
    .populate('category', 'name')
    .populate('subCategory', 'name')
    .sort({ createdAt: -1 });
};

const findByIdAndUser = async (id, userId) => {
  return await Product.findOne({ _id: id, user: userId })
    .populate('category', 'name')
    .populate('subCategory', 'name');
};

const updateByIdAndUser = async (id, userId, data) => {
  return await Product.findOneAndUpdate(
    { _id: id, user: userId }, 
    data, 
    { new: true, runValidators: true }
  )
    .populate('category', 'name')
    .populate('subCategory', 'name');
};

const deleteByIdAndUser = async (id, userId) => {
  return await Product.findOneAndDelete({ _id: id, user: userId });
};

module.exports = {
  create,
  findAllByUser,
  findByIdAndUser,
  updateByIdAndUser,
  deleteByIdAndUser,
};
