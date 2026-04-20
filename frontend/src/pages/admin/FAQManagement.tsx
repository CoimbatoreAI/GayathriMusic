import { useState, useEffect, useCallback } from 'react';
import { PlusIcon, PencilIcon, TrashIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { apiClient } from '../../lib/api';

interface FAQ {
  _id: string;
  question: string;
  answer: string;
  category: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function FAQManagement() {
  const [faqs, setFAQs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingFAQ, setEditingFAQ] = useState<FAQ | null>(null);
  const [filterStatus, setFilterStatus] = useState('active');
  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    category: 'general',
    isActive: true
  });

  const fetchFAQs = useCallback(async () => {
    try {
      const response = await apiClient.getAdminFAQs(filterStatus);
      if (response.success && response.data) {
        setFAQs(response.data as FAQ[]);
      } else {
        console.error('Error fetching FAQs:', response.error);
      }
    } catch (error) {
      console.error('Error fetching FAQs:', error);
    } finally {
      setLoading(false);
    }
  }, [filterStatus]);

  useEffect(() => {
    fetchFAQs();
  }, [fetchFAQs]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      console.log('Submitting FAQ:', formData);
      const response = editingFAQ
        ? await apiClient.updateFAQ(editingFAQ._id, formData)
        : await apiClient.createFAQ(formData);

      console.log('FAQ API Response:', response);

      if (response.success) {
        console.log('FAQ saved successfully, refreshing list...');
        await fetchFAQs();
        resetForm();
        console.log('FAQ list refreshed');
      } else {
        console.error('FAQ save failed:', response.error);
        alert(`Error saving FAQ: ${response.error}`);
      }
    } catch (error) {
      console.error('Error saving FAQ:', error);
      alert('An error occurred while saving the FAQ. Please try again.');
    }
  };

  const handleToggleStatus = async (faqId: string) => {
    try {
      const response = await apiClient.toggleFAQStatus(faqId);

      if (response.success) {
        fetchFAQs();
      } else {
        alert(`Error toggling FAQ status: ${response.error}`);
      }
    } catch (error) {
      console.error('Error toggling FAQ status:', error);
      alert('An error occurred while toggling FAQ status. Please try again.');
    }
  };

  const handleDelete = async (faqId: string) => {
    if (!confirm('Are you sure you want to delete this FAQ?')) return;

    try {
      const response = await apiClient.deleteFAQ(faqId);

      if (response.success) {
        fetchFAQs();
      } else {
        alert(`Error deleting FAQ: ${response.error}`);
      }
    } catch (error) {
      console.error('Error deleting FAQ:', error);
      alert('An error occurred while deleting the FAQ. Please try again.');
    }
  };

  const handleEdit = (faq: FAQ) => {
    setEditingFAQ(faq);
    setFormData({
      question: faq.question,
      answer: faq.answer,
      category: faq.category,
      isActive: faq.isActive
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      question: '',
      answer: '',
      category: 'general',
      isActive: true
    });
    setEditingFAQ(null);
    setShowForm(false);
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
        <h1 className="text-2xl font-bold text-gray-900">FAQ Management</h1>
        <div className="flex items-center space-x-4">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
          >
            <option value="active">Active FAQs</option>
            <option value="inactive">Inactive FAQs</option>
            <option value="all">All FAQs</option>
          </select>
          <button
            onClick={() => setShowForm(true)}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add FAQ
          </button>
        </div>
      </div>

      {/* FAQ Form */}
      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">
            {editingFAQ ? 'Edit FAQ' : 'Add New FAQ'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Question</label>
              <input
                type="text"
                required
                value={formData.question}
                onChange={(e) => setFormData(prev => ({ ...prev, question: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                placeholder="Enter your question"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Answer</label>
              <textarea
                required
                value={formData.answer}
                onChange={(e) => setFormData(prev => ({ ...prev, answer: e.target.value }))}
                rows={4}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                placeholder="Enter your answer"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                >
                  <option value="general">General</option>
                  <option value="courses">Courses</option>
                  <option value="admission">Admission</option>
                  <option value="fees">Fees</option>
                  <option value="other">Other</option>
                </select>
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
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
              >
                {editingFAQ ? 'Update FAQ' : 'Create FAQ'}
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

      {/* FAQs List */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">All FAQs</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Question
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
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
              {faqs.map((faq) => (
                <tr key={faq._id}>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{faq.question}</div>
                    <div className="text-sm text-gray-500 mt-1">{faq.answer.substring(0, 100)}...</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                      {faq.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      faq.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {faq.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(faq)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleToggleStatus(faq._id)}
                        className={faq.isActive ? 'text-yellow-600 hover:text-yellow-900' : 'text-green-600 hover:text-green-900'}
                      >
                        {faq.isActive ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                      </button>
                      <button
                        onClick={() => handleDelete(faq._id)}
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
        {faqs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No FAQs found. Create your first FAQ!</p>
          </div>
        )}
      </div>
    </div>
  );
}