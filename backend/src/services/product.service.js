const productRepository = require('../repositories/product.repository');
const categoryRepository = require('../repositories/category.repository');
const subcategoryRepository = require('../repositories/subcategory.repository');
const cloudinaryUtils = require('../utils/cloudinary');

const createProduct = async (data, file, userId) => {
  const { name, description, category, subCategory, variants } = data;

  // 1. Validate Category ownership
  const existingCategory = await categoryRepository.findByIdAndUser(category, userId);
  if (!existingCategory) {
    throw new Error('Invalid category or you do not have permission');
  }

  // 2. Validate Subcategory ownership and relationship
  const existingSubcategory = await subcategoryRepository.findByIdAndUser(subCategory, userId);
  if (!existingSubcategory) {
    throw new Error('Invalid subcategory or you do not have permission');
  }

  if (existingSubcategory.category._id.toString() !== category) {
    throw new Error('Selected subcategory does not belong to the selected category');
  }

  // 3. Process Image Upload
  let image = {};
  if (file) {
    const uploadResult = await cloudinaryUtils.uploadBufferToCloudinary(file.buffer);
    image = {
      publicId: uploadResult.publicId,
      url: uploadResult.url
    };
  }

  // 4. Create Product
  const productData = {
    name,
    description,
    category,
    subCategory,
    user: userId,
    variants: variants ? JSON.parse(variants) : [],
    image
  };

  return await productRepository.create(productData);
};

const getAllProducts = async (userId) => {
  return await productRepository.findAllByUser(userId);
};

const getProductById = async (id, userId) => {
  const product = await productRepository.findByIdAndUser(id, userId);
  if (!product) {
    throw new Error('Product not found');
  }
  return product;
};

const updateProduct = async (id, userId, data, file) => {
  const { category, subCategory, variants } = data;

  const currentProduct = await productRepository.findByIdAndUser(id, userId);
  if (!currentProduct) {
    throw new Error('Product not found');
  }

  // 1. Validate Category and Subcategory if they are being updated
  let newCategory = category || currentProduct.category._id.toString();
  let newSubcategory = subCategory || currentProduct.subCategory._id.toString();

  if (category || subCategory) {
    const existingCategory = await categoryRepository.findByIdAndUser(newCategory, userId);
    if (!existingCategory) {
      throw new Error('Invalid category or you do not have permission');
    }

    const existingSubcategory = await subcategoryRepository.findByIdAndUser(newSubcategory, userId);
    if (!existingSubcategory) {
      throw new Error('Invalid subcategory or you do not have permission');
    }

    if (existingSubcategory.category._id.toString() !== newCategory) {
      throw new Error('Selected subcategory does not belong to the selected category');
    }
  }

  // 2. Process Image Update
  let image = currentProduct.image;
  if (file) {
    // Delete old image from Cloudinary
    if (image && image.publicId) {
      await cloudinaryUtils.deleteFromCloudinary(image.publicId);
    }
    
    // Upload new image
    const uploadResult = await cloudinaryUtils.uploadBufferToCloudinary(file.buffer);
    image = {
      publicId: uploadResult.publicId,
      url: uploadResult.url
    };
  }

  // 3. Update Product
  const updateData = {
    ...data,
    category: newCategory,
    subCategory: newSubcategory,
    image
  };

  if (variants) {
    updateData.variants = typeof variants === 'string' ? JSON.parse(variants) : variants;
  }

  return await productRepository.updateByIdAndUser(id, userId, updateData);
};

const deleteProduct = async (id, userId) => {
  const product = await productRepository.findByIdAndUser(id, userId);
  if (!product) {
    throw new Error('Product not found');
  }

  // Delete image from Cloudinary
  if (product.image && product.image.publicId) {
    await cloudinaryUtils.deleteFromCloudinary(product.image.publicId);
  }

  return await productRepository.deleteByIdAndUser(id, userId);
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
