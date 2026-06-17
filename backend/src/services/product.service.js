const productRepository = require('../repositories/product.repository');
const categoryRepository = require('../repositories/category.repository');
const subcategoryRepository = require('../repositories/subcategory.repository');
const cloudinaryUtils = require('../utils/cloudinary');

const normalizeProductImages = (product) => {
  const prodObj = product.toObject ? product.toObject() : product;
  if (!prodObj.images || prodObj.images.length === 0) {
    if (prodObj.image && prodObj.image.url) {
      prodObj.images = [prodObj.image];
    } else {
      prodObj.images = [];
    }
  }
  delete prodObj.image;
  return prodObj;
};

const createProduct = async (data, files, userId) => {
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

  // 3. Process Image Uploads
  let images = [];
  if (files && files.length > 0) {
    if (files.length > 5) {
      throw new Error('Maximum of 5 images allowed.');
    }
    const uploadPromises = files.map(file => cloudinaryUtils.uploadBufferToCloudinary(file.buffer));
    images = await Promise.all(uploadPromises);
  }

  const parsedVariants = variants ? JSON.parse(variants) : [];
  if (!parsedVariants || parsedVariants.length === 0) {
    throw new Error('A product must contain at least one variant.');
  }

  // 4. Create Product
  const productData = {
    name,
    description,
    category,
    subCategory,
    user: userId,
    variants: parsedVariants,
    images
  };

  const createdProduct = await productRepository.create(productData);
  return normalizeProductImages(createdProduct);
};

const getAllProducts = async (userId) => {
  const products = await productRepository.findAllByUser(userId);
  return products.map(normalizeProductImages);
};

const getProductById = async (id, userId) => {
  const product = await productRepository.findByIdAndUser(id, userId);
  if (!product) {
    throw new Error('Product not found');
  }
  return normalizeProductImages(product);
};

const updateProduct = async (id, userId, data, files) => {
  const { category, subCategory, variants, imagesToDelete } = data;

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
  let currentImages = currentProduct.images && currentProduct.images.length > 0 
    ? [...currentProduct.images] 
    : (currentProduct.image && currentProduct.image.url ? [currentProduct.image] : []);

  const toDeleteIds = imagesToDelete ? JSON.parse(imagesToDelete) : [];

  for (const publicId of toDeleteIds) {
    await cloudinaryUtils.deleteFromCloudinary(publicId);
    currentImages = currentImages.filter(img => img.publicId !== publicId);
  }

  const newFilesCount = files ? files.length : 0;
  if (currentImages.length + newFilesCount > 5) {
    throw new Error('Maximum of 5 images allowed.');
  }

  if (files && files.length > 0) {
    const uploadPromises = files.map(file => cloudinaryUtils.uploadBufferToCloudinary(file.buffer));
    const newImages = await Promise.all(uploadPromises);
    currentImages = [...currentImages, ...newImages];
  }

  // 3. Update Product
  const updateData = {
    ...data,
    category: newCategory,
    subCategory: newSubcategory,
    images: currentImages
  };

  if (variants) {
    const parsedVariants = typeof variants === 'string' ? JSON.parse(variants) : variants;
    if (!parsedVariants || parsedVariants.length === 0) {
      throw new Error('A product must contain at least one variant.');
    }
    updateData.variants = parsedVariants;
  }

  const updatedProduct = await productRepository.updateByIdAndUser(id, userId, updateData);
  return normalizeProductImages(updatedProduct);
};

const deleteProduct = async (id, userId) => {
  const product = await productRepository.findByIdAndUser(id, userId);
  if (!product) {
    throw new Error('Product not found');
  }

  const images = product.images && product.images.length > 0 
    ? product.images 
    : (product.image && product.image.url ? [product.image] : []);

  for (const img of images) {
    if (img.publicId) {
      await cloudinaryUtils.deleteFromCloudinary(img.publicId);
    }
  }

  const deletedProduct = await productRepository.deleteByIdAndUser(id, userId);
  return normalizeProductImages(deletedProduct);
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
