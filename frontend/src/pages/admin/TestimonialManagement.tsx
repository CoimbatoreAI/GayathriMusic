import { useState, useEffect, useCallback } from 'react';
import { PlusIcon, PencilIcon, TrashIcon, CheckIcon, XMarkIcon, StarIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { apiClient } from '../../lib/api';

interface Testimonial {
  _id: string;
  studentName: string;
  role: string;
  language: string;
  type: string;
  review: string;
  rating: number;
  isApproved: boolean;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function TestimonialManagement() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [filterStatus, setFilterStatus] = useState('approved');
  const [formData, setFormData] = useState({
    studentName: '',
    role: '',
    language: 'Tamil',
    type: 'Individual Online Classes',
    rating: 5,
    review: '',
    isApproved: false,
    featured: false
  });

  const fetchData = useCallback(async () => {
    try {
      const testimonialsResponse = await apiClient.getAdminTestimonials(filterStatus);

      if (testimonialsResponse.success && testimonialsResponse.data) {
        setTestimonials(testimonialsResponse.data as Testimonial[]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }, [filterStatus]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      console.log('Submitting testimonial:', formData);
      const response = editingTestimonial
        ? await apiClient.updateTestimonial(editingTestimonial._id, formData)
        : await apiClient.createAdminTestimonial(formData);

      console.log('Testimonial API Response:', response);

      if (response.success) {
        console.log('Testimonial saved successfully, refreshing list...');
        await fetchData();
        resetForm();
        console.log('Testimonial list refreshed');
      } else {
        console.error('Testimonial save failed:', response.error);
        alert(`Error saving testimonial: ${response.error}`);
      }
    } catch (error) {
      console.error('Error saving testimonial:', error);
      alert('An error occurred while saving the testimonial. Please try again.');
    }
  };

  const handleApproval = async (testimonialId: string, isApproved: boolean, featured: boolean = false) => {
    try {
      const response = await apiClient.approveTestimonial(testimonialId, { isApproved, featured });

      if (response.success) {
        fetchData();
      } else {
        alert(`Error updating testimonial: ${response.error}`);
      }
    } catch (error) {
      console.error('Error updating testimonial:', error);
      alert('An error occurred while updating the testimonial. Please try again.');
    }
  };

  const handleDelete = async (testimonialId: string) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) return;

    try {
      const response = await apiClient.deleteTestimonial(testimonialId);

      if (response.success) {
        fetchData();
      } else {
        alert(`Error deleting testimonial: ${response.error}`);
      }
    } catch (error) {
      console.error('Error deleting testimonial:', error);
      alert('An error occurred while deleting the testimonial. Please try again.');
    }
  };

  const handleEdit = (testimonial: Testimonial) => {
    setEditingTestimonial(testimonial);
    setFormData({
      studentName: testimonial.studentName,
      role: testimonial.role,
      language: testimonial.language,
      type: testimonial.type,
      rating: testimonial.rating,
      review: testimonial.review,
      isApproved: testimonial.isApproved,
      featured: testimonial.featured
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      studentName: '',
      role: '',
      language: 'Tamil',
      type: 'Individual Online Classes',
      rating: 5,
      review: '',
      isApproved: false,
      featured: false
    });
    setEditingTestimonial(null);
    setShowForm(false);
  };

  const renderStars = (rating: number, interactive: boolean = false, onRatingChange?: (rating: number) => void) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => interactive && onRatingChange && onRatingChange(star)}
            className={interactive ? 'hover:text-yellow-400' : ''}
          >
            {star <= rating ? (
              <StarIconSolid className="h-5 w-5 text-yellow-400" />
            ) : (
              <StarIcon className="h-5 w-5 text-gray-300" />
            )}
          </button>
        ))}
      </div>
    );
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
        <h1 className="text-2xl font-bold text-gray-900">Testimonial Management</h1>
        <div className="flex items-center space-x-4">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
          >
            <option value="approved">Approved Testimonials</option>
            <option value="pending">Pending Testimonials</option>
            <option value="featured">Featured Testimonials</option>
            <option value="all">All Testimonials</option>
          </select>
          <button
            onClick={() => setShowForm(true)}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add Testimonial
          </button>
        </div>
      </div>

      {/* Testimonial Form */}
      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">
            {editingTestimonial ? 'Edit Testimonial' : 'Add New Testimonial'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Student Name</label>
                <input
                  type="text"
                  required
                  value={formData.studentName}
                  onChange={(e) => setFormData(prev => ({ ...prev, studentName: e.target.value }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                  placeholder="Enter student name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Role</label>
                <input
                  type="text"
                  required
                  value={formData.role}
                  onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                  placeholder="e.g., Adult Student, Parent of 12-year-old"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <div>
                <label className="block text-sm font-medium text-gray-700">Class Type</label>
                <select
                  required
                  value={formData.type}
                  onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                >
                  <option value="Individual Online Classes">Individual Online Classes</option>
                  <option value="Group Online Classes">Group Online Classes</option>
                  <option value="Individual Offline Classes">Individual Offline Classes</option>
                  <option value="Group Offline Classes">Group Offline Classes</option>
                  <option value="Performance Training">Performance Training</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Rating</label>
              <div className="mt-1">
                {renderStars(formData.rating, true, (rating) => setFormData(prev => ({ ...prev, rating })))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Review</label>
              <textarea
                required
                value={formData.review}
                onChange={(e) => setFormData(prev => ({ ...prev, review: e.target.value }))}
                rows={4}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                placeholder="Enter the testimonial review"
              />
            </div>

            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.isApproved}
                  onChange={(e) => setFormData(prev => ({ ...prev, isApproved: e.target.checked }))}
                  className="rounded border-gray-300 text-purple-600 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                />
                <span className="ml-2 text-sm font-medium text-gray-700">Approved</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                  className="rounded border-gray-300 text-purple-600 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                />
                <span className="ml-2 text-sm font-medium text-gray-700">Featured</span>
              </label>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
              >
                {editingTestimonial ? 'Update Testimonial' : 'Create Testimonial'}
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

      {/* Testimonials List */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">All Testimonials</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Testimonial
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rating
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
              {testimonials.map((testimonial) => (
                <tr key={testimonial._id}>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{testimonial.studentName}</div>
                    <div className="text-sm text-gray-500 mt-1">{testimonial.review.substring(0, 100)}...</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{testimonial.role}</div>
                    <div className="text-sm text-purple-600">{testimonial.language}</div>
                    <div className="text-sm text-gray-500">{testimonial.type}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {renderStars(testimonial.rating)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col space-y-1">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        testimonial.isApproved
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {testimonial.isApproved ? 'Approved' : 'Pending'}
                      </span>
                      {testimonial.featured && (
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                          Featured
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(testimonial)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      {!testimonial.isApproved && (
                        <button
                          onClick={() => handleApproval(testimonial._id, true)}
                          className="text-green-600 hover:text-green-900"
                        >
                          <CheckIcon className="h-5 w-5" />
                        </button>
                      )}
                      {testimonial.isApproved && (
                        <button
                          onClick={() => handleApproval(testimonial._id, false)}
                          className="text-yellow-600 hover:text-yellow-900"
                        >
                          <XMarkIcon className="h-5 w-5" />
                        </button>
                      )}
                      <button
                        onClick={() => handleApproval(testimonial._id, testimonial.isApproved, !testimonial.featured)}
                        className={testimonial.featured ? 'text-purple-600 hover:text-purple-900' : 'text-gray-600 hover:text-gray-900'}
                      >
                        <StarIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(testimonial._id)}
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
        {testimonials.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No testimonials found. Create your first testimonial!</p>
          </div>
        )}
      </div>
    </div>
  );
}