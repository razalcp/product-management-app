const categoryRepository = require('../repositories/category.repository');

const createCategory = async (data, userId) => {
  const { name } = data;
  
  if (!name || name.trim() === '') {
    throw new Error('Category name is required');
  }

  // Check for duplicate category name for this specific user
  const existingCategory = await categoryRepository.findByNameAndUser(name.trim(), userId);
  if (existingCategory) {
    throw new Error('You already have a category with this name');
  }

  return await categoryRepository.create({ name: name.trim(), user: userId });
};

const getAllCategories = async (userId) => {
  return await categoryRepository.findAllByUser(userId);
};

const getCategoryById = async (id, userId) => {
  const category = await categoryRepository.findByIdAndUser(id, userId);
  if (!category) {
    throw new Error('Category not found');
  }
  return category;
};

const updateCategory = async (id, userId, data) => {
  const { name } = data;

  if (name && name.trim() !== '') {
    const existingCategory = await categoryRepository.findByNameAndUser(name.trim(), userId);
    if (existingCategory && existingCategory._id.toString() !== id) {
      throw new Error('You already have another category with this name');
    }
    data.name = name.trim();
  } else if (name !== undefined) {
      throw new Error('Category name cannot be empty');
  }

  const updatedCategory = await categoryRepository.updateByIdAndUser(id, userId, data);
  if (!updatedCategory) {
    throw new Error('Category not found');
  }
  return updatedCategory;
};

const deleteCategory = async (id, userId) => {
  const deletedCategory = await categoryRepository.deleteByIdAndUser(id, userId);
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
