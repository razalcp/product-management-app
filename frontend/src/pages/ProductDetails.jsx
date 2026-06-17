import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useWishlist } from '../context/WishlistContext';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToWishlistState, removeFromWishlistState } = useWishlist();
  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState(null);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get(`/products/${id}`);
        if (response.data.success) {
          const prod = response.data.data;
          setProduct(prod);
          setIsWishlisted(prod.isWishlisted || false);
          if (prod.images && prod.images.length > 0) {
            setMainImage(prod.images[0].url);
          }
        }
      } catch (err) {
        setError('Failed to load product details.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const toggleWishlist = async () => {
    try {
      if (isWishlisted) {
        await api.delete(`/wishlists/${id}`);
        setIsWishlisted(false);
        removeFromWishlistState(id);
      } else {
        await api.post(`/wishlists/${id}`);
        setIsWishlisted(true);
        addToWishlistState(product);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update wishlist');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      const response = await api.delete(`/products/${id}`);
      if (response.data.success) {
        navigate('/');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete product');
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center text-gray-500">Loading product...</div>;
  }

  if (error || !product) {
    return <div className="p-8 text-center text-red-500">{error || 'Product not found.'}</div>;
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="md:flex">
          {/* Product Image */}
          <div className="md:w-1/2 bg-gray-50 flex flex-col items-center justify-center p-8 border-r border-gray-100">
            {mainImage ? (
              <div className="w-full flex flex-col items-center">
                <img
                  src={mainImage}
                  alt={product.name}
                  className="max-h-[400px] w-auto object-contain rounded-lg shadow-sm mb-6"
                />
                {product.images && product.images.length > 1 && (
                  <div className="flex gap-2 mt-4 overflow-x-auto pb-2 w-full justify-center">
                    {product.images.map((img) => (
                      <button
                        key={img.publicId}
                        onClick={() => setMainImage(img.url)}
                        className={`flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 transition-all ${mainImage === img.url ? 'border-indigo-600 ring-2 ring-indigo-200' : 'border-transparent hover:border-gray-300'
                          }`}
                      >
                        <img src={img.url} alt="thumbnail" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-gray-400 flex flex-col items-center">
                <svg className="w-24 h-24 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
                <span>No Image Available</span>
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="md:w-1/2 p-8">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
                <div className="flex gap-2 mb-6">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                    {product.category?.name || 'Unknown Category'}
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {product.subCategory?.name || 'Unknown Subcategory'}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={toggleWishlist}
                  className={`px-3 py-1.5 border rounded text-sm font-medium transition-colors ${isWishlisted
                      ? 'bg-pink-50 text-pink-600 border-pink-200 hover:bg-pink-100'
                      : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                    }`}
                >
                  {isWishlisted ? '♥ Saved' : '♡ Save'}
                </button>
                <Link
                  to={`/products/edit/${product._id}`}
                  className="bg-white text-indigo-600 hover:text-indigo-900 px-3 py-1.5 border border-indigo-200 rounded text-sm font-medium transition-colors"
                >
                  Edit
                </Link>
                <button
                  onClick={handleDelete}
                  className="bg-white text-red-600 hover:text-red-900 px-3 py-1.5 border border-red-200 rounded text-sm font-medium transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>

            <div className="prose prose-sm text-gray-600 mb-8">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Description</h3>
              <p className="whitespace-pre-wrap">{product.description}</p>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Available Variants</h3>
              {product.variants && product.variants.length > 0 ? (
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Detail / RAM</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {product.variants.map((variant, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{variant.ram}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">${variant.price.toFixed(2)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${variant.quantity > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                              {variant.quantity} in stock
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-500 italic text-sm">No variants available for this product.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
