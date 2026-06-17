const express = require('express');
const {
  createSubcategory,
  getSubcategories,
  getSubcategoryById,
  updateSubcategory,
  deleteSubcategory,
} = require('../controllers/subcategory.controller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

// All subcategory routes require authentication
router.use(protect);

router.route('/')
  .post(createSubcategory)
  .get(getSubcategories);

router.route('/:id')
  .get(getSubcategoryById)
  .put(updateSubcategory)
  .delete(deleteSubcategory);

module.exports = router;
