import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

import ProductCard from '../components/ProductCard';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Search, Filter, Pagination State
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedSubcategories, setSelectedSubcategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [page, setPage] = useState(1);
  const [paginationData, setPaginationData] = useState({ currentPage: 1, totalPages: 1, totalProducts: 0 });

  // Fetch Subcategories
  useEffect(() => {
    const fetchSubcategories = async () => {
      try {
        const response = await api.get('/subcategories');
        if (response.data.success) {
          setSubcategories(response.data.data);
        }
      } catch (err) {
        console.error('Failed to load subcategories');
      }
    };
    fetchSubcategories();
  }, []);

  // Debounce Search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  // Reset Page to 1 on Filter Change
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, selectedSubcategories]);

  // Fetch Products
  useEffect(() => {
    fetchProducts();
  }, [debouncedSearch, selectedSubcategories, page]);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/products', {
        params: { search: debouncedSearch, subcategories: selectedSubcategories.map(s => s._id).join(','), page, limit: 8 }
      });
      if (response.data.success) {
        setProducts(response.data.data.products);
        setPaginationData({
          currentPage: response.data.data.currentPage,
          totalPages: response.data.data.totalPages,
          totalProducts: response.data.data.totalProducts
        });
      }
    } catch (err) {
      setError('Failed to fetch products');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Your Products</h1>
          <p className="mt-1 text-sm text-gray-500">Manage and view all your inventory items.</p>
        </div>
        <Link
          to="/products/new"
          className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm"
        >
          Add Product
        </Link>
      </div>

      {/* Top Bar for Search and Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-8 flex gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search products by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm bg-white"
          />
        </div>
        <div className="w-48">
          <select 
            value=""
            onChange={(e) => {
              if (!e.target.value) return;
              const selectedId = e.target.value;
              const sub = subcategories.find(s => s._id === selectedId);
              if (sub && !selectedSubcategories.some(s => s._id === selectedId)) {
                setSelectedSubcategories([...selectedSubcategories, sub]);
              }
            }}
            className="block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm bg-white"
          >
            <option value="">Select Subcategory</option>
            {subcategories.map(sub => (
              <option key={sub._id} value={sub._id} disabled={selectedSubcategories.some(s => s._id === sub._id)}>
                {sub.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Selected Subcategories Chips */}
      {selectedSubcategories.length > 0 && (
        <div className="mb-6 flex flex-wrap gap-2 items-center">
          <span className="text-sm text-gray-500 mr-2">Filters:</span>
          {selectedSubcategories.map(sub => (
            <span key={sub._id} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
              {sub.name}
              <button
                type="button"
                onClick={() => setSelectedSubcategories(prev => prev.filter(s => s._id !== sub._id))}
                className="flex-shrink-0 ml-1.5 h-4 w-4 rounded-full inline-flex items-center justify-center text-indigo-400 hover:bg-indigo-200 hover:text-indigo-500 focus:outline-none focus:bg-indigo-500 focus:text-white"
              >
                <span className="sr-only">Remove filter</span>
                <svg className="h-2 w-2" stroke="currentColor" fill="none" viewBox="0 0 8 8">
                  <path strokeLinecap="round" strokeWidth="1.5" d="M1 1l6 6m0-6L1 7" />
                </svg>
              </button>
            </span>
          ))}
          <button
            onClick={() => setSelectedSubcategories([])}
            className="text-sm text-gray-500 hover:text-gray-700 ml-2 underline"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Product Grid */}
      {isLoading ? (
        <div className="text-center py-12 text-gray-500">Loading products...</div>
      ) : error ? (
        <div className="text-center py-12 text-red-500">{error}</div>
      ) : products.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-lg border border-gray-200 border-dashed">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No products</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by creating a new product.</p>
          <div className="mt-6">
            <Link
              to="/products/new"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Add Product
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {!isLoading && !error && paginationData.totalPages > 1 && (
        <div className="mt-8 flex justify-between items-center bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="text-sm text-gray-700">
            Showing page <span className="font-medium">{paginationData.currentPage}</span> of <span className="font-medium">{paginationData.totalPages}</span> ({paginationData.totalProducts} total products)
          </div>
          <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 rounded-l-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() => setPage(p => Math.min(paginationData.totalPages, p + 1))}
              disabled={page === paginationData.totalPages}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 rounded-r-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </nav>
        </div>
      )}
    </div>
  );
};

export default Home;
