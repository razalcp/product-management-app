const express = require('express');
const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require('../controllers/product.controller');
const { protect } = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');

const router = express.Router();

// All product routes require authentication
router.use(protect);

router.route('/')
  .post(upload.single('image'), createProduct)
  .get(getProducts);

router.route('/:id')
  .get(getProductById)
  .put(upload.single('image'), updateProduct)
  .delete(deleteProduct);

module.exports = router;
