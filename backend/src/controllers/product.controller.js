const productService = require('../services/product.service');

const createProduct = async (req, res) => {
  try {
    const userId = req.user._id;
    const files = req.files || []; // From multer array
    const product = await productService.createProduct(req.body, files, userId);
    res.status(201).json({ success: true, data: product });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const getProducts = async (req, res) => {
  try {
    const userId = req.user._id;
    const result = await productService.getAllProducts(userId, req.query);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const userId = req.user._id;
    const product = await productService.getProductById(req.params.id, userId);
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const userId = req.user._id;
    const files = req.files || []; // From multer array
    const product = await productService.updateProduct(req.params.id, userId, req.body, files);
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const userId = req.user._id;
    const product = await productService.deleteProduct(req.params.id, userId);
    res.status(200).json({ success: true, message: 'Product deleted', data: product });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
