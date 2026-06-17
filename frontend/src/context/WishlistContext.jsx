import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { AuthContext } from './AuthContext';

const WishlistContext = createContext();

export const useWishlist = () => {
  return useContext(WishlistContext);
};

export const WishlistProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [isLoadingWishlist, setIsLoadingWishlist] = useState(true);

  useEffect(() => {
    if (user) {
      fetchWishlistItems();
    } else {
      setWishlistItems([]);
      setIsLoadingWishlist(false);
    }
  }, [user]);

  const fetchWishlistItems = async () => {
    setIsLoadingWishlist(true);
    try {
      const response = await api.get('/wishlists');
      if (response.data.success && response.data.data) {
        setWishlistItems(response.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch wishlist items', err);
    } finally {
      setIsLoadingWishlist(false);
    }
  };

  const addToWishlistState = (product) => {
    setWishlistItems(prev => {
      if (prev.find(p => p._id === product._id)) return prev;
      return [...prev, product];
    });
  };

  const removeFromWishlistState = (productId) => {
    setWishlistItems(prev => prev.filter(p => p._id !== productId));
  };

  return (
    <WishlistContext.Provider value={{
      wishlistItems,
      wishlistCount: wishlistItems.length,
      isLoadingWishlist,
      addToWishlistState,
      removeFromWishlistState,
      refreshWishlistItems: fetchWishlistItems
    }}>
      {children}
    </WishlistContext.Provider>
  );
};
