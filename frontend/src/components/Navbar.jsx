import { useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { wishlistCount } = useWishlist();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Manage Categories', path: '/categories' },
    { name: 'Manage Subcategories', path: '/subcategories' },
    { name: 'Add Products', path: '/products/new' },
    { name: 'Wishlist', path: '/wishlist' },
  ];

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex overflow-x-auto">
            <div className="flex-shrink-0 flex items-center mr-8">
              <Link to="/" className="text-xl font-bold text-indigo-600 tracking-tight">ProductApp</Link>
            </div>
            <div className="flex space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`${location.pathname === link.path
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors whitespace-nowrap`}
                >
                  {link.name}
                  {link.name === 'Wishlist' && wishlistCount > 0 && (
                    <span className="ml-1.5 inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800">
                      {wishlistCount}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex items-center space-x-4 pl-4">
            <span className="hidden sm:inline-block text-sm text-gray-700 font-medium">
              Hello, {user?.name}
            </span>
            <button
              onClick={handleLogout}
              className="bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
