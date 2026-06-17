const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');

// Import routes
const authRoutes = require('./routes/auth.routes');
const categoryRoutes = require('./routes/category.routes');
const subcategoryRoutes = require('./routes/subcategory.routes');
const productRoutes = require('./routes/product.routes');
const wishlistRoutes = require('./routes/wishlist.routes');

// Initialize express app
const app = express();
app.set('trust proxy', 1); // Essential for secure cookies behind reverse proxies (like Render)

// Request logging middleware
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Middleware setup
// Enable CORS for frontend requests
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }));

// Parse incoming JSON payloads
app.use(express.json());
// Parse incoming URL-encoded payloads
app.use(express.urlencoded({ extended: true }));
// Parse cookies
app.use(cookieParser());

// Define a basic health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'success', message: 'API is running smoothly.' });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/subcategories', subcategoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/wishlists', wishlistRoutes);

// TODO: Import and use core application routes here
// Example: app.use('/api/products', productRoutes);

module.exports = app;
