const Category = require('../models/category.model');

// Creates a new category
const create = async (data) => {
  return await Category.create(data);
};

// Finds a category by exact name and user
const findByNameAndUser = async (name, userId) => {
  return await Category.findOne({ 
    name: { $regex: new RegExp(`^${name}$`, 'i') },
    user: userId
  });
};

// Gets all categories for a user
const findAllByUser = async (userId) => {
  return await Category.find({ user: userId }).sort({ createdAt: -1 });
};

// Gets a category by ID and user
const findByIdAndUser = async (id, userId) => {
  return await Category.findOne({ _id: id, user: userId });
};

// Updates a category by ID and user
const updateByIdAndUser = async (id, userId, data) => {
  return await Category.findOneAndUpdate(
    { _id: id, user: userId }, 
    data, 
    { new: true, runValidators: true }
  );
};

// Deletes a category by ID and user
const deleteByIdAndUser = async (id, userId) => {
  return await Category.findOneAndDelete({ _id: id, user: userId });
};

module.exports = {
  create,
  findByNameAndUser,
  findAllByUser,
  findByIdAndUser,
  updateByIdAndUser,
  deleteByIdAndUser,
};
