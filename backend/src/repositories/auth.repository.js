const User = require('../models/user.model');

/**
 * Creates a new user in the database.
 * @param {Object} userData - The user data containing name, email, and password.
 * @returns {Promise<Object>} The created user document.
 */
const createUser = async (userData) => {
  return await User.create(userData);
};

/**
 * Finds a user by their email address.
 * @param {String} email - The email to search for.
 * @returns {Promise<Object|null>} The user document or null if not found.
 */
const findUserByEmail = async (email) => {
  return await User.findOne({ email });
};

/**
 * Finds a user by their ID.
 * @param {String} id - The user ID.
 * @returns {Promise<Object|null>} The user document or null if not found.
 */
const findUserById = async (id) => {
  return await User.findById(id).select('-password');
};

module.exports = {
  createUser,
  findUserByEmail,
  findUserById
};
