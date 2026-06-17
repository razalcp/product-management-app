const categoryService = require('../services/category.service');

const createCategory = async (req, res) => {
  try {
    const userId = req.user._id;
    const category = await categoryService.createCategory(req.body, userId);
    res.status(201).json({ success: true, data: category });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const getCategories = async (req, res) => {
  try {
    const userId = req.user._id;
    const categories = await categoryService.getAllCategories(userId);
    res.status(200).json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getCategoryById = async (req, res) => {
  try {
    const userId = req.user._id;
    const category = await categoryService.getCategoryById(req.params.id, userId);
    res.status(200).json({ success: true, data: category });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};

const updateCategory = async (req, res) => {
  try {
    const userId = req.user._id;
    const category = await categoryService.updateCategory(req.params.id, userId, req.body);
    res.status(200).json({ success: true, data: category });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const userId = req.user._id;
    const category = await categoryService.deleteCategory(req.params.id, userId);
    res.status(200).json({ success: true, message: 'Category deleted', data: category });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
