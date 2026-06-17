import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import Categories from './pages/Categories';
import Subcategories from './pages/Subcategories';
import ProductForm from './pages/ProductForm';
import ProductDetails from './pages/ProductDetails';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/categories" 
            element={
              <ProtectedRoute>
                <Categories />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/subcategories" 
            element={
              <ProtectedRoute>
                <Subcategories />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/products/new" 
            element={
              <ProtectedRoute>
                <ProductForm />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/products/edit/:id" 
            element={
              <ProtectedRoute>
                <ProductForm />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/products/:id" 
            element={
              <ProtectedRoute>
                <ProductDetails />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
