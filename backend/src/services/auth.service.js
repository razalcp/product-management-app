const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authRepository = require('../repositories/auth.repository');

/**
 * Handles user signup logic.
 * @param {Object} userData - The user details.
 * @returns {Promise<Object>} An object containing the new user and a JWT token.
 */
const signup = async (userData) => {
  const { name, email, password } = userData;

  // Check if user already exists
  const existingUser = await authRepository.findUserByEmail(email);
  if (existingUser) {
    throw new Error('User already exists with this email');
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create user
  const user = await authRepository.createUser({
    name,
    email,
    password: hashedPassword,
  });

  // Generate JWT token
  const token = generateToken(user._id);

  // Exclude password from the returned user object
  const userResponse = user.toObject();
  delete userResponse.password;

  return { user: userResponse, token };
};

/**
 * Handles user login logic.
 * @param {String} email - The user email.
 * @param {String} password - The user password.
 * @returns {Promise<Object>} An object containing the user and a JWT token.
 */
const login = async (email, password) => {
  const user = await authRepository.findUserByEmail(email);
  if (!user) {
    throw new Error('Invalid email or password');
  }

  // Check if password matches
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('Invalid email or password');
  }

  // Generate JWT token
  const token = generateToken(user._id);

  const userResponse = user.toObject();
  delete userResponse.password;

  return { user: userResponse, token };
};

/**
 * Generates a JWT token for the given user ID.
 * @param {String} userId - The user ID.
 * @returns {String} The signed JWT token.
 */
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

module.exports = {
  signup,
  login,
};
