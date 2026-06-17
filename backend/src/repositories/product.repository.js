const Product = require('../models/product.model');

const create = async (data) => {
  return await Product.create(data);
};

const findAllByUser = async (userId) => {
  return await Product.find({ user: userId })
    .populate('category', 'name')
    .populate('subCategory', 'name')
    .sort({ createdAt: -1 });
};

const findWithFilters = async (userId, { search, subcategory, page = 1, limit = 8 }) => {
  const query = { user: userId };
  
  if (search) {
    query.name = { $regex: search, $options: 'i' };
  }
  
  if (subcategory) {
    query.subCategory = subcategory;
  }

  const skip = (page - 1) * limit;

  const [products, totalProducts] = await Promise.all([
    Product.find(query)
      .populate('category', 'name')
      .populate('subCategory', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Product.countDocuments(query)
  ]);

  return { products, totalProducts };
};

const findByIdAndUser = async (id, userId) => {
  return await Product.findOne({ _id: id, user: userId })
    .populate('category', 'name')
    .populate('subCategory', 'name');
};

const updateByIdAndUser = async (id, userId, data) => {
  return await Product.findOneAndUpdate(
    { _id: id, user: userId }, 
    data, 
    { new: true, runValidators: true }
  )
    .populate('category', 'name')
    .populate('subCategory', 'name');
};

const deleteByIdAndUser = async (id, userId) => {
  return await Product.findOneAndDelete({ _id: id, user: userId });
};

module.exports = {
  create,
  findAllByUser,
  findWithFilters,
  findByIdAndUser,
  updateByIdAndUser,
  deleteByIdAndUser,
};
