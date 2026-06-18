const authService = require('../services/auth.service');

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
  maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days\
   path: '/'
};

/**
 * Handles user signup request.
 */
const signup = async (req, res) => {
  try {
    const { user, token } = await authService.signup(req.body);

    // Set JWT as HttpOnly cookie
    res.cookie('token', token, cookieOptions);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: user,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'Error registering user',
    });
  }
};

/**
 * Handles user login request.
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { user, token } = await authService.login(email, password);

    // Set JWT as HttpOnly cookie
    res.cookie('token', token, cookieOptions);

    res.status(200).json({
      success: true,
      message: 'Logged in successfully',
      data: user,
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message || 'Error logging in',
    });
  }
};

/**
 * Handles user logout request.
 */
const logout = (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
    path: '/'
  });
  res.status(200).json({
    success: true,
    message: 'Logged out successfully'
  });
};

module.exports = {
  signup,
  login,
  logout
};
