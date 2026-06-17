import { useState, useEffect } from 'react';
import api from '../services/api';
import ProductCard from '../components/ProductCard';
import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';

const Wishlist = () => {
  const { wishlistItems, isLoadingWishlist, removeFromWishlistState, refreshWishlistItems } = useWishlist();
  const [error, setError] = useState('');
  const [removingId, setRemovingId] = useState(null);

  useEffect(() => {
    refreshWishlistItems();
  }, []);

  const handleRemove = async (productId) => {
    try {
      setRemovingId(productId);
      await api.delete(`/wishlists/${productId}`);
      removeFromWishlistState(productId);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to remove from wishlist');
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">My Wishlist</h1>
        <p className="mt-1 text-sm text-gray-500">View and manage your saved products.</p>
      </div>

      {isLoadingWishlist ? (
        <div className="text-center py-12 text-gray-500">Loading wishlist...</div>
      ) : error ? (
        <div className="text-center py-12 text-red-500">{error}</div>
      ) : wishlistItems.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-lg border border-gray-200 border-dashed">
          <svg className="mx-auto h-12 w-12 text-pink-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">Your wishlist is empty</h3>
          <p className="mt-1 text-sm text-gray-500">Start exploring and save your favorite items.</p>
          <div className="mt-6">
            <Link
              to="/"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
            >
              Browse Products
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {wishlistItems.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              onRemoveFromWishlist={handleRemove}
              isRemoving={removingId === product._id}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
