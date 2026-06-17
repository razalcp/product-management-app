const express = require('express');
const router = express.Router();
const {
  addProductToWishlist,
  removeProductFromWishlist,
  getWishlistProducts
} = require('../controllers/wishlist.controller');
const { protect } = require('../middleware/auth.middleware');

router.use(protect);

router.route('/')
  .get(getWishlistProducts);

router.route('/:productId')
  .post(addProductToWishlist)
  .delete(removeProductFromWishlist);

module.exports = router;
