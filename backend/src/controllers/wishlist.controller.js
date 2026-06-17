const wishlistService = require('../services/wishlist.service');

const addProductToWishlist = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId } = req.params;
    await wishlistService.addProductToWishlist(userId, productId);
    res.status(201).json({ success: true, message: 'Product added to wishlist' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const removeProductFromWishlist = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId } = req.params;
    await wishlistService.removeProductFromWishlist(userId, productId);
    res.status(200).json({ success: true, message: 'Product removed from wishlist' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const getWishlistProducts = async (req, res) => {
  try {
    const userId = req.user._id;
    const products = await wishlistService.getWishlistProducts(userId);
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = {
  addProductToWishlist,
  removeProductFromWishlist,
  getWishlistProducts
};
