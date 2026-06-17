const Subcategory = require('../models/subcategory.model');

const create = async (data) => {
  return await Subcategory.create(data);
};

const findByNameCategoryAndUser = async (name, categoryId, userId) => {
  return await Subcategory.findOne({ 
    name: { $regex: new RegExp(`^${name}$`, 'i') },
    category: categoryId,
    user: userId
  });
};

const findAllByUser = async (userId) => {
  return await Subcategory.find({ user: userId })
    .populate('category', 'name')
    .sort({ createdAt: -1 });
};

const findByIdAndUser = async (id, userId) => {
  return await Subcategory.findOne({ _id: id, user: userId })
    .populate('category', 'name');
};

const updateByIdAndUser = async (id, userId, data) => {
  return await Subcategory.findOneAndUpdate(
    { _id: id, user: userId }, 
    data, 
    { new: true, runValidators: true }
  ).populate('category', 'name');
};

const deleteByIdAndUser = async (id, userId) => {
  return await Subcategory.findOneAndDelete({ _id: id, user: userId });
};

module.exports = {
  create,
  findByNameCategoryAndUser,
  findAllByUser,
  findByIdAndUser,
  updateByIdAndUser,
  deleteByIdAndUser,
};
