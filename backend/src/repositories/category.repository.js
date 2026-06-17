const Category = require('../models/category.model');

/**
 * Creates a new category.
 * @param {Object} data - The category data.
 * @returns {Promise<Object>} The created category.
 */
const create = async (data) => {
  return await Category.create(data);
};

/**
 * Finds a category by exact name (case-insensitive).
 * @param {String} name - The category name.
 * @returns {Promise<Object|null>} The category if found.
 */
const findByName = async (name) => {
  return await Category.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
};

/**
 * Gets all categories.
 * @returns {Promise<Array>} List of all categories.
 */
const findAll = async () => {
  return await Category.find().sort({ createdAt: -1 });
};

/**
 * Gets a category by ID.
 * @param {String} id - The category ID.
 * @returns {Promise<Object|null>} The category.
 */
const findById = async (id) => {
  return await Category.findById(id);
};

/**
 * Updates a category by ID.
 * @param {String} id - The category ID.
 * @param {Object} data - The updated data.
 * @returns {Promise<Object|null>} The updated category.
 */
const updateById = async (id, data) => {
  return await Category.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
};

/**
 * Deletes a category by ID.
 * @param {String} id - The category ID.
 * @returns {Promise<Object|null>} The deleted category.
 */
const deleteById = async (id) => {
  return await Category.findByIdAndDelete(id);
};

module.exports = {
  create,
  findByName,
  findAll,
  findById,
  updateById,
  deleteById,
};
