import { useState, useEffect } from 'react';
import { PlusIcon, PencilIcon, EyeIcon, EyeSlashIcon, ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/outline';
import { apiClient } from '../../lib/api';

interface HomeContent {
  _id: string;
  section: string;
  title: string;
  subtitle?: string;
  content?: string;
  imageUrl?: string;
  buttonText?: string;
  buttonLink?: string;
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export default function HomeContentManagement() {
  const [content, setContent] = useState<HomeContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingContent, setEditingContent] = useState<HomeContent | null>(null);
  const [formData, setFormData] = useState({
    section: '',
    title: '',
    subtitle: '',
    content: '',
    imageUrl: '',
    buttonText: '',
    buttonLink: '',
    isActive: true,
    order: 0
  } as {
    section: string;
    title: string;
    subtitle: string;
    content: string;
    imageUrl: string;
    buttonText: string;
    buttonLink: string;
    isActive: boolean;
    order: number;
  });

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const response = await apiClient.getAdminHomeContent();
      if (response.success && response.data) {
        setContent(response.data as HomeContent[]);
      } else {
        console.error('Error fetching home content:', response.error);
      }
    } catch (error) {
      console.error('Error fetching home content:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await apiClient.updateHomeContent(formData);

      if (response.success) {
        fetchContent();
        resetForm();
      } else {
        alert(`Error saving content: ${response.error}`);
      }
    } catch (error) {
      console.error('Error saving content:', error);
      alert('An error occurred while saving the content. Please try again.');
    }
  };

  const handleToggleStatus = async (section: string) => {
    try {
      const response = await apiClient.toggleHomeContentSection(section);

      if (response.success) {
        fetchContent();
      } else {
        alert(`Error toggling section status: ${response.error}`);
      }
    } catch (error) {
      console.error('Error toggling section status:', error);
      alert('An error occurred while toggling section status. Please try again.');
    }
  };

  const handleReorder = async (sectionId: string, direction: 'up' | 'down') => {
    const currentIndex = content.findIndex(item => item._id === sectionId);
    if (currentIndex === -1) return;

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= content.length) return;

    const newOrder = [...content];
    [newOrder[currentIndex], newOrder[newIndex]] = [newOrder[newIndex], newOrder[currentIndex]];

    const orderData = {
      order: newOrder.map((item, index) => ({
        id: item._id,
        order: index
      }))
    };

    try {
      const response = await apiClient.reorderHomeContentSections(orderData);

      if (response.success) {
        fetchContent();
      } else {
        alert(`Error reordering sections: ${response.error}`);
      }
    } catch (error) {
      console.error('Error reordering sections:', error);
      alert('An error occurred while reordering sections. Please try again.');
    }
  };

  const handleEdit = (contentItem: HomeContent) => {
    setEditingContent(contentItem);
    setFormData({
      section: contentItem.section,
      title: contentItem.title,
      subtitle: contentItem.subtitle || '',
      content: contentItem.content || '',
      imageUrl: contentItem.imageUrl || '',
      buttonText: contentItem.buttonText || '',
      buttonLink: contentItem.buttonLink || '',
      isActive: contentItem.isActive,
      order: contentItem.order
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      section: '',
      title: '',
      subtitle: '',
      content: '',
      imageUrl: '',
      buttonText: '',
      buttonLink: '',
      isActive: true,
      order: 0
    });
    setEditingContent(null);
    setShowForm(false);
  };

  const getSectionDisplayName = (section: string) => {
    const sectionNames: Record<string, string> = {
      'hero': 'Hero Section',
      'about': 'About Section',
      'services': 'Services Section',
      'features': 'Features Section',
      'testimonials': 'Testimonials Section',
      'cta': 'Call to Action Section',
      'gallery': 'Gallery Section',
      'languages': 'Languages Section',
      'keypoints': 'Key Points Section',
      'contact': 'Contact Section',
      'footer': 'Footer Section',
      'header': 'Header Section',
      'pricing': 'Pricing Section',
      'faq': 'FAQ Section'
    };
    return sectionNames[section] || section;
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
        <h1 className="text-2xl font-bold text-gray-900">Home Content Management</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Section
        </button>
      </div>

      {/* Content Form */}
      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">
            {editingContent ? 'Edit Section' : 'Add New Section'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Section Key</label>
                <input
                  type="text"
                  required
                  value={formData.section}
                  onChange={(e) => setFormData(prev => ({ ...prev, section: e.target.value }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                  placeholder="e.g., hero, about, courses"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Subtitle</label>
              <input
                type="text"
                value={formData.subtitle}
                onChange={(e) => setFormData(prev => ({ ...prev, subtitle: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Content</label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                rows={4}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Image URL</label>
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Order</label>
                <input
                  type="number"
                  min="0"
                  value={formData.order}
                  onChange={(e) => setFormData(prev => ({ ...prev, order: parseInt(e.target.value) || 0 }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Button Text</label>
                <input
                  type="text"
                  value={formData.buttonText}
                  onChange={(e) => setFormData(prev => ({ ...prev, buttonText: e.target.value }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Button Link</label>
                <input
                  type="url"
                  value={formData.buttonLink}
                  onChange={(e) => setFormData(prev => ({ ...prev, buttonLink: e.target.value }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                />
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
                {editingContent ? 'Update Section' : 'Create Section'}
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

      {/* Content List */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">All Sections</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Section
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {content.map((item, index) => (
                <tr key={item._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {getSectionDisplayName(item.section)}
                    </div>
                    <div className="text-sm text-gray-500">{item.section}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{item.title}</div>
                    {item.subtitle && (
                      <div className="text-sm text-gray-500">{item.subtitle}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      item.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {item.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-900">{item.order}</span>
                      <div className="flex flex-col">
                        <button
                          onClick={() => handleReorder(item._id, 'up')}
                          disabled={index === 0}
                          className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
                        >
                          <ArrowUpIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleReorder(item._id, 'down')}
                          disabled={index === content.length - 1}
                          className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
                        >
                          <ArrowDownIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleToggleStatus(item.section)}
                        className={item.isActive ? 'text-yellow-600 hover:text-yellow-900' : 'text-green-600 hover:text-green-900'}
                      >
                        {item.isActive ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {content.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No sections found. Create your first section!</p>
          </div>
        )}
      </div>
    </div>
  );
}