const cloudinary = require('../config/cloudinary');

/**
 * Uploads a file buffer to Cloudinary via a stream.
 * @param {Buffer} buffer - The file buffer.
 * @param {String} folder - The destination folder in Cloudinary.
 * @returns {Promise<Object>} An object containing publicId and url.
 */
const uploadBufferToCloudinary = (buffer, folder = 'products') => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) {
          return reject(error);
        }
        resolve({
          publicId: result.public_id,
          url: result.secure_url
        });
      }
    );
    uploadStream.end(buffer);
  });
};

/**
 * Deletes an image from Cloudinary by its public ID.
 * @param {String} publicId - The Cloudinary public ID.
 * @returns {Promise<void>}
 */
const deleteFromCloudinary = async (publicId) => {
  if (!publicId) return;
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error(`Error deleting image from Cloudinary (publicId: ${publicId}):`, error);
  }
};

module.exports = {
  uploadBufferToCloudinary,
  deleteFromCloudinary
};
