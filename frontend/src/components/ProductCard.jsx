import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const thumbnail = product.images && product.images.length > 0 ? product.images[0].url : null;
  return (
    <Link to={`/products/${product._id}`} className="group relative bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      <div className="aspect-w-3 aspect-h-2 bg-gray-100 flex items-center justify-center p-4 h-48 overflow-hidden">
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={product.name}
            className="object-contain w-full h-full group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
          </svg>
        )}
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-sm font-medium text-gray-900 line-clamp-1">{product.name}</h3>
            <p className="text-xs text-gray-500 mt-1">{product.category?.name}</p>
          </div>
          <p className="text-sm font-bold text-indigo-600">
            ${product.variants && product.variants.length > 0 ? product.variants[0].price.toFixed(2) : '0.00'}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
