import { useState, useEffect } from 'react';
import { apiClient } from '../../lib/api';

interface AdmissionSettings {
  _id: string;
  isAdmissionOpen: boolean;
  admissionStartDate?: string;
  admissionEndDate?: string;
  currentEnrollments: number;
  announcement?: string;
  isAnnouncementActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function AdmissionSettingsManagement() {
  const [settings, setSettings] = useState<AdmissionSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    isAdmissionOpen: false,
    admissionStartDate: '',
    admissionEndDate: '',
    announcement: '',
    isAnnouncementActive: false
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await apiClient.getAdmissionSettings();
      if (response.success && response.data) {
        const settingsData = response.data as AdmissionSettings;
        setSettings(settingsData);
        setFormData({
          isAdmissionOpen: settingsData.isAdmissionOpen,
          admissionStartDate: settingsData.admissionStartDate ? new Date(settingsData.admissionStartDate).toISOString().split('T')[0] : '',
          admissionEndDate: settingsData.admissionEndDate ? new Date(settingsData.admissionEndDate).toISOString().split('T')[0] : '',
          announcement: settingsData.announcement || '',
          isAnnouncementActive: settingsData.isAnnouncementActive
        });
      } else {
        console.error('Error fetching admission settings:', response.error);
      }
    } catch (error) {
      console.error('Error fetching admission settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await apiClient.updateAdmissionSettings(formData);

      if (response.success) {
        fetchSettings();
        alert('Admission settings updated successfully!');
      } else {
        alert(`Error updating settings: ${response.error}`);
      }
    } catch (error) {
      console.error('Error updating settings:', error);
      alert('An error occurred while updating the settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleResetEnrollments = async () => {
    if (!confirm('Are you sure you want to reset the enrollment counter? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await apiClient.resetEnrollments();

      if (response.success) {
        fetchSettings();
        alert('Enrollments reset successfully!');
      } else {
        alert(`Error resetting enrollments: ${response.error}`);
      }
    } catch (error) {
      console.error('Error resetting enrollments:', error);
      alert('An error occurred while resetting enrollments. Please try again.');
    }
  };

  const getEnrollmentStatus = () => {
    if (!settings) return 'Unknown';

    const now = new Date();
    const startDate = settings.admissionStartDate ? new Date(settings.admissionStartDate) : null;
    const endDate = settings.admissionEndDate ? new Date(settings.admissionEndDate) : null;

    // Check date restrictions
    if (startDate && now < startDate) {
      return 'Scheduled to open';
    }
    if (endDate && now > endDate) {
      return 'Closed (past end date)';
    }

    return settings.isAdmissionOpen ? 'Open' : 'Closed';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No admission settings found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Admission Settings</h1>
      </div>

      {/* Current Status */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-4">Current Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="text-center">
            <div className={`inline-flex px-3 py-1 rounded-full text-sm font-semibold ${
              getEnrollmentStatus() === 'Open' ? 'bg-green-100 text-green-800' :
              getEnrollmentStatus().includes('Closed') ? 'bg-red-100 text-red-800' :
              'bg-yellow-100 text-yellow-800'
            }`}>
              {getEnrollmentStatus()}
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{settings.currentEnrollments}</div>
            <div className="text-sm text-gray-500">Total Enrollments</div>
          </div>
        </div>
      </div>

      {/* Settings Form */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-4">Update Settings</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.isAdmissionOpen}
                onChange={(e) => setFormData(prev => ({ ...prev, isAdmissionOpen: e.target.checked }))}
                className="rounded border-gray-300 text-purple-600 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              />
              <span className="ml-2 text-sm font-medium text-gray-700">Admission Open</span>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Start Date</label>
              <input
                type="date"
                value={formData.admissionStartDate}
                onChange={(e) => setFormData(prev => ({ ...prev, admissionStartDate: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">End Date</label>
              <input
                type="date"
                value={formData.admissionEndDate}
                onChange={(e) => setFormData(prev => ({ ...prev, admissionEndDate: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              />
            </div>
          </div>


          <div>
            <label className="block text-sm font-medium text-gray-700">Announcement</label>
            <textarea
              value={formData.announcement}
              onChange={(e) => setFormData(prev => ({ ...prev, announcement: e.target.value }))}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              placeholder="Enter any announcement or important notice"
            />
          </div>

          <div className="flex items-center">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.isAnnouncementActive}
                onChange={(e) => setFormData(prev => ({ ...prev, isAnnouncementActive: e.target.checked }))}
                className="rounded border-gray-300 text-purple-600 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              />
              <span className="ml-2 text-sm font-medium text-gray-700">Show Announcement</span>
            </label>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={saving}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Update Settings'}
            </button>
            <button
              type="button"
              onClick={handleResetEnrollments}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
            >
              Reset Enrollments
            </button>
          </div>
        </form>
      </div>

      {/* Date Information */}
      {formData.admissionStartDate && formData.admissionEndDate && (
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-blue-800 mb-2">Date Information</h3>
          <div className="text-sm text-blue-700">
            <p>Admission will be automatically opened on: {new Date(formData.admissionStartDate).toLocaleDateString()}</p>
            <p>Admission will be automatically closed on: {new Date(formData.admissionEndDate).toLocaleDateString()}</p>
          </div>
        </div>
      )}
    </div>
  );
}