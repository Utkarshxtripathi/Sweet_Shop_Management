/**
 * Admin Page
 * Admin-only page for managing sweets (CRUD operations)
 * Business logic separated from UI - uses API service layer
 */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  getSweets,
  createSweet,
  updateSweet,
  deleteSweet,
  restockSweet,
} from '../services/api';
import Loading from '../components/Loading';
import Alert from '../components/Alert';
import Button from '../components/Button';
import Input from '../components/Input';

const Admin = () => {
  const navigate = useNavigate();
  const { logout, isAdmin } = useAuth();

  const isAdminUser = isAdmin();
  const [sweets, setSweets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingSweet, setEditingSweet] = useState(null);
  const [restockingSweet, setRestockingSweet] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    quantity: '',
    description: '',
  });
  const [restockQuantity, setRestockQuantity] = useState('');

  /**
   * Redirect if not admin
   */
  useEffect(() => {
    if (!isAdminUser) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAdminUser, navigate]);

  /**
   * Fetch sweets on component mount
   */
  useEffect(() => {
    fetchSweets();
  }, []);

  /**
   * Fetch all sweets from API
   */
  const fetchSweets = async () => {
    try {
      setIsLoading(true);
      setError('');
      const data = await getSweets();
      setSweets(Array.isArray(data) ? data : data.sweets || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load sweets');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle form input changes
   */
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  /**
   * Reset form to initial state
   */
  const resetForm = () => {
    setFormData({
      name: '',
      category: '',
      price: '',
      quantity: '',
      description: '',
    });
    setEditingSweet(null);
    setShowAddForm(false);
  };

  /**
   * Handle add sweet form submission
   */
  const handleAddSweet = async (e) => {
    e.preventDefault();
    try {
      setError('');
      setSuccess('');
      const sweetData = {
        ...formData,
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity),
      };
      await createSweet(sweetData);
      setSuccess('Sweet added successfully!');
      resetForm();
      await fetchSweets();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add sweet');
    }
  };

  /**
   * Handle edit sweet - populate form with existing data
   */
  const handleEditClick = (sweet) => {
    setEditingSweet(sweet);
    setFormData({
      name: sweet.name,
      category: sweet.category,
      price: sweet.price.toString(),
      quantity: sweet.quantity.toString(),
      description: sweet.description || '',
    });
    setShowAddForm(true);
  };

  /**
   * Handle update sweet form submission
   */
  const handleUpdateSweet = async (e) => {
    e.preventDefault();
    try {
      setError('');
      setSuccess('');
      const sweetData = {
        ...formData,
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity),
      };
      await updateSweet(editingSweet._id || editingSweet.id, sweetData);
      setSuccess('Sweet updated successfully!');
      resetForm();
      await fetchSweets();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update sweet');
    }
  };

  /**
   * Handle delete sweet
   */
  const handleDeleteSweet = async (sweetId, sweetName) => {
    if (!window.confirm(`Are you sure you want to delete "${sweetName}"?`)) {
      return;
    }
    try {
      setError('');
      setSuccess('');
      await deleteSweet(sweetId);
      setSuccess('Sweet deleted successfully!');
      await fetchSweets();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete sweet');
    }
  };

  /**
   * Handle restock sweet
   */
  const handleRestock = async (e) => {
    e.preventDefault();
    try {
      setError('');
      setSuccess('');
      const quantity = parseInt(restockQuantity);
      if (quantity <= 0) {
        setError('Restock quantity must be greater than 0');
        return;
      }
      await restockSweet(restockingSweet._id || restockingSweet.id, quantity);
      setSuccess(`Successfully restocked ${restockingSweet.name}!`);
      setRestockingSweet(null);
      setRestockQuantity('');
      await fetchSweets();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to restock sweet');
    }
  };

  if (!isAdminUser) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
            <p className="text-sm text-gray-600">Manage sweets inventory</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              onClick={() => navigate('/dashboard')}
            >
              Dashboard
            </Button>
            <Button variant="secondary" onClick={logout}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Add/Edit Form */}
        {showAddForm && (
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <h2 className="text-lg font-semibold mb-4">
              {editingSweet ? 'Edit Sweet' : 'Add New Sweet'}
            </h2>
            <form
              onSubmit={editingSweet ? handleUpdateSweet : handleAddSweet}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
                <Input
                  label="Category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                />
                <Input
                  label="Price"
                  type="number"
                  step="0.01"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                />
                <Input
                  label="Quantity"
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  required
                />
              </div>
              <Input
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
              />
              <div className="flex gap-2">
                <Button type="submit" variant="primary">
                  {editingSweet ? 'Update Sweet' : 'Add Sweet'}
                </Button>
                <Button type="button" variant="secondary" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Action Buttons */}
        {!showAddForm && (
          <div className="mb-6">
            <Button
              variant="primary"
              onClick={() => {
                resetForm();
                setShowAddForm(true);
              }}
            >
              Add New Sweet
            </Button>
          </div>
        )}

        {/* Alerts */}
        {error && (
          <Alert type="error" message={error} onClose={() => setError('')} />
        )}
        {success && (
          <Alert
            type="success"
            message={success}
            onClose={() => setSuccess('')}
          />
        )}

        {/* Sweets List */}
        {isLoading ? (
          <Loading message="Loading sweets..." />
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sweets.map((sweet) => (
                  <tr key={sweet._id || sweet.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {sweet.name}
                      </div>
                      {sweet.description && (
                        <div className="text-sm text-gray-500">
                          {sweet.description}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {sweet.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ₹{sweet.price}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {sweet.quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <Button
                          variant="secondary"
                          onClick={() => handleEditClick(sweet)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="secondary"
                          onClick={() =>
                            setRestockingSweet(sweet)
                          }
                        >
                          Restock
                        </Button>
                        <Button
                          variant="danger"
                          onClick={() =>
                            handleDeleteSweet(
                              sweet._id || sweet.id,
                              sweet.name
                            )
                          }
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {/* Restock Modal */}
      {restockingSweet && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">
              Restock {restockingSweet.name}
            </h3>
            <form onSubmit={handleRestock}>
              <Input
                label="Quantity to Add"
                type="number"
                value={restockQuantity}
                onChange={(e) => setRestockQuantity(e.target.value)}
                required
                min="1"
              />
              <div className="flex gap-2 mt-4">
                <Button type="submit" variant="primary">
                  Restock
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setRestockingSweet(null);
                    setRestockQuantity('');
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;

