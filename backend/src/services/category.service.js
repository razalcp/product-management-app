const categoryRepository = require('../repositories/category.repository');

/**
 * Creates a new category, ensuring name is unique.
 * @param {Object} data - The category data.
 * @returns {Promise<Object>} The created category.
 */
const createCategory = async (data) => {
  const { name } = data;
  
  if (!name || name.trim() === '') {
    throw new Error('Category name is required');
  }

  // Check for duplicate category name
  const existingCategory = await categoryRepository.findByName(name.trim());
  if (existingCategory) {
    throw new Error('Category with this name already exists');
  }

  return await categoryRepository.create({ name: name.trim() });
};

/**
 * Retrieves all categories.
 * @returns {Promise<Array>}
 */
const getAllCategories = async () => {
  return await categoryRepository.findAll();
};

/**
 * Retrieves a single category by ID.
 * @param {String} id - Category ID.
 * @returns {Promise<Object>}
 */
const getCategoryById = async (id) => {
  const category = await categoryRepository.findById(id);
  if (!category) {
    throw new Error('Category not found');
  }
  return category;
};

/**
 * Updates a category by ID.
 * @param {String} id - Category ID.
 * @param {Object} data - Updated category data.
 * @returns {Promise<Object>}
 */
const updateCategory = async (id, data) => {
  const { name } = data;

  // Check if updating name and if it already exists
  if (name && name.trim() !== '') {
    const existingCategory = await categoryRepository.findByName(name.trim());
    // Ensure the found category is not the one we are updating
    if (existingCategory && existingCategory._id.toString() !== id) {
      throw new Error('Another category with this name already exists');
    }
    data.name = name.trim();
  } else if (name !== undefined) {
      throw new Error('Category name cannot be empty');
  }

  const updatedCategory = await categoryRepository.updateById(id, data);
  if (!updatedCategory) {
    throw new Error('Category not found');
  }
  return updatedCategory;
};

/**
 * Deletes a category by ID.
 * @param {String} id - Category ID.
 * @returns {Promise<Object>}
 */
const deleteCategory = async (id) => {
  const deletedCategory = await categoryRepository.deleteById(id);
  if (!deletedCategory) {
    throw new Error('Category not found');
  }
  return deletedCategory;
};

module.exports = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
