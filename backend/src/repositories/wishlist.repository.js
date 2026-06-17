const Wishlist = require('../models/wishlist.model');

class WishlistRepository {
  async add(userId, productId) {
    const wishlist = new Wishlist({ user: userId, product: productId });
    return await wishlist.save();
  }

  async remove(userId, productId) {
    return await Wishlist.findOneAndDelete({ user: userId, product: productId });
  }

  async findAllByUser(userId) {
    return await Wishlist.find({ user: userId }).populate({
      path: 'product',
      populate: [
        { path: 'category', select: 'name' },
        { path: 'subCategory', select: 'name' }
      ]
    }).sort({ createdAt: -1 });
  }

  async existsByUserAndProduct(userId, productId) {
    const count = await Wishlist.countDocuments({ user: userId, product: productId });
    return count > 0;
  }

  async deleteByProduct(productId) {
    return await Wishlist.deleteMany({ product: productId });
  }
}

module.exports = new WishlistRepository();
