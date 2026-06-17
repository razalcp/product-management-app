import { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

const Subcategories = () => {
  const [subcategories, setSubcategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useContext(AuthContext);

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories');
      if (response.data.success) {
        setCategories(response.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch categories:', err);
      setError('Failed to fetch parent categories. Please try again later.');
    }
  };

  const fetchSubcategories = async () => {
    try {
      const response = await api.get('/subcategories');
      if (response.data.success) {
        setSubcategories(response.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch subcategories:', err);
      setError('Failed to fetch subcategories. Please try again later.');
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchSubcategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    if (!categoryId) {
      setError('Please select a parent category.');
      setIsLoading(false);
      return;
    }

    try {
      if (editingId) {
        const response = await api.put(`/subcategories/${editingId}`, { name, category: categoryId });
        if (response.data.success) {
          setSuccess('Subcategory updated successfully');
          setEditingId(null);
          setName('');
          setCategoryId('');
          fetchSubcategories();
        }
      } else {
        const response = await api.post('/subcategories', { name, category: categoryId });
        if (response.data.success) {
          setSuccess('Subcategory created successfully');
          setName('');
          setCategoryId('');
          fetchSubcategories();
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (subcategory) => {
    setEditingId(subcategory._id);
    setName(subcategory.name);
    setCategoryId(subcategory.category._id);
    setError('');
    setSuccess('');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this subcategory?')) return;
    
    setError('');
    setSuccess('');
    try {
      const response = await api.delete(`/subcategories/${id}`);
      if (response.data.success) {
        setSuccess('Subcategory deleted successfully');
        fetchSubcategories();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete subcategory');
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setName('');
    setCategoryId('');
    setError('');
    setSuccess('');
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Subcategory Management</h1>
          <p className="mt-2 text-sm text-gray-600">
            Create, view, edit, and delete subcategories under your main categories.
          </p>
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-100">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              {editingId ? 'Edit Subcategory' : 'Add New Subcategory'}
            </h2>
            
            {error && (
              <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4 rounded-md text-sm text-red-700">
                {error}
              </div>
            )}
            
            {success && (
              <div className="mb-4 bg-green-50 border-l-4 border-green-500 p-4 rounded-md text-sm text-green-700">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 sm:items-end">
              <div className="flex-1">
                <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                  Parent Category
                </label>
                <div className="mt-1">
                  <select
                    id="category"
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    required
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white"
                  >
                    <option value="" disabled>Select a category</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex-1">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Subcategory Name
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="e.g. Dell"
                  />
                </div>
              </div>
              
              <div className="flex gap-2 w-full sm:w-auto">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full sm:w-auto bg-indigo-600 text-white py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  {isLoading ? 'Saving...' : (editingId ? 'Update' : 'Add Subcategory')}
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="w-full sm:w-auto bg-white text-gray-700 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Subcategory Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Parent Category
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created At
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {subcategories.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                      No subcategories found. Ensure you have created a category first, then add a subcategory.
                    </td>
                  </tr>
                ) : (
                  subcategories.map((subcategory) => (
                    <tr key={subcategory._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {subcategory.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {subcategory.category?.name || 'Unknown'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(subcategory.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleEdit(subcategory)}
                          className="text-indigo-600 hover:text-indigo-900 mr-4"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(subcategory._id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Subcategories;
