const subcategoryRepository = require('../repositories/subcategory.repository');
const categoryRepository = require('../repositories/category.repository');

const createSubcategory = async (data, userId) => {
  const { name, category } = data;
  
  if (!name || name.trim() === '') {
    throw new Error('Subcategory name is required');
  }

  if (!category) {
    throw new Error('Parent category is required');
  }

  // 1. Verify that the parent category exists and belongs to the user
  const parentCategory = await categoryRepository.findByIdAndUser(category, userId);
  if (!parentCategory) {
    throw new Error('Invalid parent category or you do not have permission');
  }

  // 2. Check for duplicate subcategory name within the same category for this specific user
  const existingSubcategory = await subcategoryRepository.findByNameCategoryAndUser(name.trim(), category, userId);
  if (existingSubcategory) {
    throw new Error('You already have a subcategory with this name in the selected category');
  }

  return await subcategoryRepository.create({ 
    name: name.trim(), 
    category, 
    user: userId 
  });
};

const getAllSubcategories = async (userId) => {
  return await subcategoryRepository.findAllByUser(userId);
};

const getSubcategoryById = async (id, userId) => {
  const subcategory = await subcategoryRepository.findByIdAndUser(id, userId);
  if (!subcategory) {
    throw new Error('Subcategory not found');
  }
  return subcategory;
};

const updateSubcategory = async (id, userId, data) => {
  const { name, category } = data;

  const currentSubcategory = await subcategoryRepository.findByIdAndUser(id, userId);
  if (!currentSubcategory) {
    throw new Error('Subcategory not found');
  }

  let updatedData = {};

  if (category && category !== currentSubcategory.category._id.toString()) {
    // 1. If changing category, verify new category belongs to user
    const parentCategory = await categoryRepository.findByIdAndUser(category, userId);
    if (!parentCategory) {
      throw new Error('Invalid parent category or you do not have permission');
    }
    updatedData.category = category;
  } else {
    updatedData.category = currentSubcategory.category._id;
  }

  if (name && name.trim() !== '') {
    // 2. Check for duplicate subcategory name within the target category
    const targetCategory = updatedData.category;
    const existingSubcategory = await subcategoryRepository.findByNameCategoryAndUser(name.trim(), targetCategory, userId);
    if (existingSubcategory && existingSubcategory._id.toString() !== id) {
      throw new Error('You already have another subcategory with this name in the selected category');
    }
    updatedData.name = name.trim();
  } else if (name !== undefined) {
    throw new Error('Subcategory name cannot be empty');
  }

  const updatedSubcategory = await subcategoryRepository.updateByIdAndUser(id, userId, updatedData);
  return updatedSubcategory;
};

const deleteSubcategory = async (id, userId) => {
  const deletedSubcategory = await subcategoryRepository.deleteByIdAndUser(id, userId);
  if (!deletedSubcategory) {
    throw new Error('Subcategory not found');
  }
  return deletedSubcategory;
};

module.exports = {
  createSubcategory,
  getAllSubcategories,
  getSubcategoryById,
  updateSubcategory,
  deleteSubcategory,
};
