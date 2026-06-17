const jwt = require('jsonwebtoken');
const authRepository = require('../repositories/auth.repository');

/**
 * Middleware to protect routes.
 * Checks for a JWT in the Authorization header (Bearer token) or in cookies.
 */
const protect = async (req, res, next) => {
  let token;

  // Check if token exists in headers or cookies
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  // Make sure token exists
  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized to access this route' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user to req object
    req.user = await authRepository.findUserById(decoded.id);

    if (!req.user) {
       return res.status(401).json({ success: false, message: 'User not found' });
    }

    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Not authorized to access this route' });
  }
};

module.exports = {
  protect
};
