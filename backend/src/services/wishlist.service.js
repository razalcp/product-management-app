const wishlistRepository = require('../repositories/wishlist.repository');
const productRepository = require('../repositories/product.repository');
const { normalizeProductImages } = require('./product.service');

const addProductToWishlist = async (userId, productId) => {
  // Validate product exists
  const product = await productRepository.findByIdAndUser(productId, userId);
  if (!product) {
    throw new Error('Product not found');
  }

  try {
    await wishlistRepository.add(userId, productId);
  } catch (error) {
    if (error.code === 11000) {
      throw new Error('Product is already in wishlist');
    }
    throw error;
  }
};

const removeProductFromWishlist = async (userId, productId) => {
  const result = await wishlistRepository.remove(userId, productId);
  if (!result) {
    throw new Error('Product not found in wishlist');
  }
};

const getWishlistProducts = async (userId) => {
  const wishlists = await wishlistRepository.findAllByUser(userId);
  
  // Extract and normalize products
  return wishlists.map(w => {
    if (w.product) {
      return normalizeProductImages(w.product);
    }
    return null;
  }).filter(Boolean); // filter out nulls if a product was somehow deleted without cascading
};

module.exports = {
  addProductToWishlist,
  removeProductFromWishlist,
  getWishlistProducts
};
