import { useState, useEffect } from 'react';
import { PlusIcon, PencilIcon, TrashIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { apiClient } from '../../lib/api';

interface FeeStructure {
  _id: string;
  name: string;
  description?: string;
  courseType: string;
  courseLevel: string;
  language: string;
  basePrice: number;
  registrationFee: number;
  discountAmount?: number;
  discountPercentage?: number;
  finalPrice: number;
  isActive: boolean;
  validFrom: string;
  validUntil?: string;
  createdAt: string;
  updatedAt: string;
}

export default function FeeStructureManagement() {
  const [feeStructures, setFeeStructures] = useState<FeeStructure[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingFeeStructure, setEditingFeeStructure] = useState<FeeStructure | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    courseType: 'Individual Online - Indian',
    courseLevel: 'Beginner',
    language: 'Tamil',
    basePrice: '',
    registrationFee: '',
    discountAmount: '',
    discountPercentage: '',
    validFrom: '',
    validUntil: '',
    isActive: true
  });

  useEffect(() => {
    fetchFeeStructures();
  }, []);

  const fetchFeeStructures = async () => {
    try {
      const response = await apiClient.getAdminFeeStructures();
      if (response.success && response.data) {
        setFeeStructures(response.data as FeeStructure[]);
      } else {
        console.error('Error fetching fee structures:', response.error);
      }
    } catch (error) {
      console.error('Error fetching fee structures:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const feeData = {
        ...formData,
        basePrice: parseFloat(formData.basePrice),
        registrationFee: parseFloat(formData.registrationFee),
        discountAmount: formData.discountAmount ? parseFloat(formData.discountAmount) : undefined,
        discountPercentage: formData.discountPercentage ? parseFloat(formData.discountPercentage) : undefined,
        validFrom: new Date(formData.validFrom).toISOString(),
        validUntil: formData.validUntil ? new Date(formData.validUntil).toISOString() : undefined
      };

      const response = editingFeeStructure
        ? await apiClient.updateFeeStructure(editingFeeStructure._id, feeData)
        : await apiClient.createFeeStructure(feeData);

      if (response.success) {
        await fetchFeeStructures();
        resetForm();
      } else {
        alert(`Error saving fee structure: ${response.error}`);
      }
    } catch (error) {
      console.error('Error saving fee structure:', error);
      alert('An error occurred while saving the fee structure. Please try again.');
    }
  };

  const handleToggleStatus = async (feeStructureId: string) => {
    try {
      const response = await apiClient.toggleFeeStructureStatus(feeStructureId);

      if (response.success) {
        fetchFeeStructures();
      } else {
        alert(`Error toggling fee structure status: ${response.error}`);
      }
    } catch (error) {
      console.error('Error toggling fee structure status:', error);
      alert('An error occurred while toggling fee structure status. Please try again.');
    }
  };

  const handleDelete = async (feeStructureId: string) => {
    if (!confirm('Are you sure you want to delete this fee structure?')) return;

    try {
      const response = await apiClient.deleteFeeStructure(feeStructureId);

      if (response.success) {
        fetchFeeStructures();
      } else {
        alert(`Error deleting fee structure: ${response.error}`);
      }
    } catch (error) {
      console.error('Error deleting fee structure:', error);
      alert('An error occurred while deleting the fee structure. Please try again.');
    }
  };

  const handleEdit = (feeStructure: FeeStructure) => {
    setEditingFeeStructure(feeStructure);
    setFormData({
      name: feeStructure.name,
      description: feeStructure.description || '',
      courseType: feeStructure.courseType,
      courseLevel: feeStructure.courseLevel,
      language: feeStructure.language,
      basePrice: feeStructure.basePrice.toString(),
      registrationFee: feeStructure.registrationFee.toString(),
      discountAmount: feeStructure.discountAmount?.toString() || '',
      discountPercentage: feeStructure.discountPercentage?.toString() || '',
      validFrom: new Date(feeStructure.validFrom).toISOString().split('T')[0],
      validUntil: feeStructure.validUntil ? new Date(feeStructure.validUntil).toISOString().split('T')[0] : '',
      isActive: feeStructure.isActive
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      courseType: 'Individual Online - Indian',
      courseLevel: 'Beginner',
      language: 'Tamil',
      basePrice: '',
      registrationFee: '',
      discountAmount: '',
      discountPercentage: '',
      validFrom: '',
      validUntil: '',
      isActive: true
    });
    setEditingFeeStructure(null);
    setShowForm(false);
  };

  const calculateFinalPrice = () => {
    const basePrice = parseFloat(formData.basePrice) || 0;
    const registrationFee = parseFloat(formData.registrationFee) || 0;
    let finalPrice = basePrice + registrationFee;

    if (formData.discountAmount) {
      finalPrice -= parseFloat(formData.discountAmount);
    } else if (formData.discountPercentage) {
      finalPrice -= (finalPrice * parseFloat(formData.discountPercentage) / 100);
    }

    return Math.max(0, finalPrice);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Fee Structure Management</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Fee Structure
        </button>
      </div>

      {/* Fee Structure Form */}
      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">
            {editingFeeStructure ? 'Edit Fee Structure' : 'Add New Fee Structure'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                  placeholder="e.g., Basic Instrumental Course"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Course Type</label>
                <select
                  required
                  value={formData.courseType}
                  onChange={(e) => setFormData(prev => ({ ...prev, courseType: e.target.value }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                >
                  <option value="Individual Online - Indian">Individual Online - Indian</option>
                  <option value="Group Online - Indian">Group Online - Indian</option>
                  <option value="Individual Online - Foreign">Individual Online - Foreign</option>
                  <option value="Individual Offline - Chennai">Individual Offline - Chennai</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Course Level</label>
                <select
                  required
                  value={formData.courseLevel}
                  onChange={(e) => setFormData(prev => ({ ...prev, courseLevel: e.target.value }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Language</label>
                <select
                  required
                  value={formData.language}
                  onChange={(e) => setFormData(prev => ({ ...prev, language: e.target.value }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                >
                  <option value="Tamil">Tamil</option>
                  <option value="Telugu">Telugu</option>
                  <option value="Kannada">Kannada</option>
                  <option value="English">English</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                placeholder="Optional description"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Base Price (₹)</label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={formData.basePrice}
                  onChange={(e) => setFormData(prev => ({ ...prev, basePrice: e.target.value }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Registration Fee (₹)</label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={formData.registrationFee}
                  onChange={(e) => setFormData(prev => ({ ...prev, registrationFee: e.target.value }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Discount Amount (₹)</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.discountAmount}
                  onChange={(e) => setFormData(prev => ({ ...prev, discountAmount: e.target.value, discountPercentage: '' }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                  placeholder="Leave empty if using percentage"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Discount Percentage (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  value={formData.discountPercentage}
                  onChange={(e) => setFormData(prev => ({ ...prev, discountPercentage: e.target.value, discountAmount: '' }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                  placeholder="Leave empty if using amount"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Valid From</label>
                <input
                  type="date"
                  required
                  value={formData.validFrom}
                  onChange={(e) => setFormData(prev => ({ ...prev, validFrom: e.target.value }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Valid Until (Optional)</label>
                <input
                  type="date"
                  value={formData.validUntil}
                  onChange={(e) => setFormData(prev => ({ ...prev, validUntil: e.target.value }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                />
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm text-gray-600">
                <strong>Final Price: ₹{calculateFinalPrice().toFixed(2)}</strong>
              </div>
            </div>

            <div className="flex items-center">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                  className="rounded border-gray-300 text-purple-600 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                />
                <span className="ml-2 text-sm font-medium text-gray-700">Active</span>
              </label>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
              >
                {editingFeeStructure ? 'Update Fee Structure' : 'Create Fee Structure'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Fee Structures List */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">All Fee Structures</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Course Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pricing
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {feeStructures.map((feeStructure) => (
                <tr key={feeStructure._id}>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{feeStructure.name}</div>
                    {feeStructure.description && (
                      <div className="text-sm text-gray-500">{feeStructure.description}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{feeStructure.courseType} • {feeStructure.courseLevel}</div>
                    <div className="text-sm text-purple-600">{feeStructure.language}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">Base: ₹{feeStructure.basePrice}</div>
                    <div className="text-sm text-gray-500">Reg: ₹{feeStructure.registrationFee}</div>
                    <div className="text-sm font-medium text-green-600">Final: ₹{feeStructure.finalPrice}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${feeStructure.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                      }`}>
                      {feeStructure.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(feeStructure)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleToggleStatus(feeStructure._id)}
                        className={feeStructure.isActive ? 'text-yellow-600 hover:text-yellow-900' : 'text-green-600 hover:text-green-900'}
                      >
                        {feeStructure.isActive ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                      </button>
                      <button
                        onClick={() => handleDelete(feeStructure._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {feeStructures.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No fee structures found. Create your first fee structure!</p>
          </div>
        )}
      </div>
    </div>
  );
}