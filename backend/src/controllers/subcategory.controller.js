const subcategoryService = require('../services/subcategory.service');

const createSubcategory = async (req, res) => {
  try {
    const userId = req.user._id;
    const subcategory = await subcategoryService.createSubcategory(req.body, userId);
    res.status(201).json({ success: true, data: subcategory });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const getSubcategories = async (req, res) => {
  try {
    const userId = req.user._id;
    const subcategories = await subcategoryService.getAllSubcategories(userId);
    res.status(200).json({ success: true, data: subcategories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getSubcategoryById = async (req, res) => {
  try {
    const userId = req.user._id;
    const subcategory = await subcategoryService.getSubcategoryById(req.params.id, userId);
    res.status(200).json({ success: true, data: subcategory });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};

const updateSubcategory = async (req, res) => {
  try {
    const userId = req.user._id;
    const subcategory = await subcategoryService.updateSubcategory(req.params.id, userId, req.body);
    res.status(200).json({ success: true, data: subcategory });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const deleteSubcategory = async (req, res) => {
  try {
    const userId = req.user._id;
    const subcategory = await subcategoryService.deleteSubcategory(req.params.id, userId);
    res.status(200).json({ success: true, message: 'Subcategory deleted', data: subcategory });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = {
  createSubcategory,
  getSubcategories,
  getSubcategoryById,
  updateSubcategory,
  deleteSubcategory,
};
