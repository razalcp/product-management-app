const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

// Initialize express app
const app = express();

// Middleware setup
// Enable CORS for frontend requests
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));

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

// TODO: Import and use core application routes here
// Example: app.use('/api/products', productRoutes);

module.exports = app;
