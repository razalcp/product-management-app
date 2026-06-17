# Product Management Application

A full-stack Product Management Application built using the MERN Stack. The application allows users to manage categories, subcategories, products, product variants, product images, and wishlists through a secure authentication system.

## Live Demo

**Frontend:**
https://product-management-app-red.vercel.app

**Backend:**
https://product-management-app-api-sjmo.onrender.com

**GitHub Repository:**
https://github.com/razalcp/product-management-app.git

---

## Features Implemented

### Authentication

* User Signup
* User Login
* JWT Authentication
* HttpOnly Cookie-based Authentication

### Category Management

* Create, View, Update, Delete Categories

### Subcategory Management

* Create, View, Update, Delete Subcategories
* Linked to Parent Categories

### Product Management

* Create, View, Update, Delete Products
* Product Details Page
* Multiple Product Variants

### Product Images

* Cloudinary Integration
* Multiple Image Upload (Up to 5 Images)
* Image Preview & Removal

### Wishlist

* Add to Wishlist
* Remove from Wishlist
* Wishlist Count Badge

### Search, Filter & Pagination

* Debounced Search
* Multi-select Subcategory Filtering
* Backend Pagination
* Search + Filter + Pagination work together

---

## Tech Stack

### Frontend

* React
* Vite
* Tailwind CSS
* Axios
* React Router DOM

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose

### Other Services

* Cloudinary
* MongoDB Atlas

### Deployment

* Frontend: Vercel
* Backend: Render

---

## Project Structure

```text
product-management-app/
├── frontend/
└── backend/
```

---

## Architecture

The backend follows the Repository Pattern:

```text
Controller
→ Service
→ Repository
→ MongoDB
```

This keeps business logic, database access, and request handling separated and maintainable.

---

## Environment Variables

### Backend

```env
PORT=
MONGODB_URI=
JWT_SECRET=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
CLIENT_URL=
```

### Frontend

```env
VITE_API_URL=
```

---

## Running Locally

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

Backend runs on:

```text
http://localhost:5000
```

---

## Author

CP Razal Nazim

GitHub: https://github.com/razalcp
