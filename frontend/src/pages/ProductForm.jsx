import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';
// import { AuthContext } from '../context/AuthContext';

const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  // const { user } = useContext(AuthContext);

  const isEditing = Boolean(id);

  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [filteredSubcategories, setFilteredSubcategories] = useState([]);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const [image, setImage] = useState(null);
  const [currentImageUrl, setCurrentImageUrl] = useState('');
  
  const [variants, setVariants] = useState([{ ram: '', price: '', quantity: '' }]);

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchCategoriesAndSubcategories();
    if (isEditing) {
      fetchProduct();
    }
  }, [id]);

  const fetchCategoriesAndSubcategories = async () => {
    try {
      const [catRes, subRes] = await Promise.all([
        api.get('/categories'),
        api.get('/subcategories')
      ]);
      if (catRes.data.success) setCategories(catRes.data.data);
      if (subRes.data.success) setSubcategories(subRes.data.data);
    } catch (err) {
      setError('Failed to load categories/subcategories.');
    }
  };

  const fetchProduct = async () => {
    try {
      const res = await api.get(`/products/${id}`);
      if (res.data.success) {
        const prod = res.data.data;
        setName(prod.name);
        setDescription(prod.description);
        setCategory(prod.category?._id || '');
        setSubCategory(prod.subCategory?._id || '');
        setVariants(prod.variants?.length ? prod.variants : [{ ram: '', price: '', quantity: '' }]);
        if (prod.image && prod.image.url) {
          setCurrentImageUrl(prod.image.url);
        }
      }
    } catch (err) {
      setError('Failed to fetch product details.');
    }
  };

  useEffect(() => {
    if (category) {
      const filtered = subcategories.filter(sub => sub.category?._id === category);
      setFilteredSubcategories(filtered);
      // Reset subcategory if it's no longer valid
      if (subCategory && !filtered.find(s => s._id === subCategory)) {
        setSubCategory('');
      }
    } else {
      setFilteredSubcategories([]);
    }
  }, [category, subcategories]);

  const handleVariantChange = (index, field, value) => {
    const newVariants = [...variants];
    newVariants[index][field] = value;
    setVariants(newVariants);
  };

  const addVariant = () => {
    setVariants([...variants, { ram: '', price: '', quantity: '' }]);
  };

  const removeVariant = (index) => {
    const newVariants = variants.filter((_, i) => i !== index);
    setVariants(newVariants);
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!category || !subCategory) {
      setError('Category and Subcategory are required.');
      setIsLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description);
      formData.append('category', category);
      formData.append('subCategory', subCategory);
      formData.append('variants', JSON.stringify(variants));
      
      if (image) {
        formData.append('image', image);
      }

      if (isEditing) {
        const res = await api.put(`/products/${id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        if (res.data.success) {
          navigate(`/products/${id}`);
        }
      } else {
        const res = await api.post('/products', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        if (res.data.success) {
          navigate('/');
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save product');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 sm:p-10 border-b border-gray-100">
          <h1 className="text-2xl font-bold text-gray-900">
            {isEditing ? 'Edit Product' : 'Add New Product'}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {isEditing ? 'Update your product details below.' : 'Fill in the information to list a new product.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 sm:p-10 space-y-8">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Product Name</label>
              <input
                type="text"
                id="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                id="description"
                rows={4}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
              <select
                id="category"
                required
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm bg-white"
              >
                <option value="" disabled>Select Category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="subcategory" className="block text-sm font-medium text-gray-700">Subcategory</label>
              <select
                id="subcategory"
                required
                value={subCategory}
                onChange={(e) => setSubCategory(e.target.value)}
                disabled={!category}
                className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm bg-white disabled:bg-gray-100"
              >
                <option value="" disabled>Select Subcategory</option>
                {filteredSubcategories.map((sub) => (
                  <option key={sub._id} value={sub._id}>{sub.name}</option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Product Image</label>
              {currentImageUrl && !image && (
                <div className="mt-2 mb-4">
                  <img src={currentImageUrl} alt="Current product" className="h-32 w-auto object-cover rounded-md border border-gray-200" />
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
              />
            </div>
          </div>

          <div className="pt-6 border-t border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Variants</h3>
              <button
                type="button"
                onClick={addVariant}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                + Add Variant
              </button>
            </div>

            <div className="space-y-4">
              {variants.map((variant, index) => (
                <div key={index} className="flex flex-col sm:flex-row gap-4 items-end bg-gray-50 p-4 rounded-lg border border-gray-100">
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-gray-700">RAM / Detail</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 8GB"
                      value={variant.ram}
                      onChange={(e) => handleVariantChange(index, 'ram', e.target.value)}
                      className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-gray-700">Price</label>
                    <input
                      type="number"
                      required
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      value={variant.price}
                      onChange={(e) => handleVariantChange(index, 'price', e.target.value)}
                      className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-gray-700">Quantity</label>
                    <input
                      type="number"
                      required
                      min="0"
                      placeholder="0"
                      value={variant.quantity}
                      onChange={(e) => handleVariantChange(index, 'quantity', e.target.value)}
                      className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                  {variants.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeVariant(index)}
                      className="mb-1 text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="pt-5 border-t border-gray-200">
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {isLoading ? 'Saving...' : 'Save Product'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;
