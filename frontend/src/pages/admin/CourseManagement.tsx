import { useState, useEffect } from 'react';
import { PlusIcon, PencilIcon, TrashIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { apiClient } from '../../lib/api';

interface Course {
  _id?: string;
  id?: string | number;
  title: string;
  description: string;
  price: number;
  language: string;
  level: string;
  isActive?: boolean;
  is_active?: boolean;
  classesPerMonth?: number;
  studentsPerBatch?: number;
  enrolledStudents?: number;
  enrolled_students?: number;
  syllabus: {
    title: string;
    topics: string[];
  }[];
  createdAt?: string;
  updatedAt?: string;
  created_at?: string;
  updated_at?: string;
}

export default function CourseManagement() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    price: string;
    language: string;
    level: string;
    classesPerMonth: string;
    studentsPerBatch: string;
    syllabus: string[];
  }>({
    title: '',
    description: '',
    price: '',
    language: 'Tamil',
    level: 'Beginner',
    classesPerMonth: '',
    studentsPerBatch: '',
    syllabus: ['']
  });

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.getCourses();
      if (response.success && response.data) {
        setCourses(response.data as Course[]);
      } else {
        setError(response.error || 'Failed to fetch courses');
        console.error('Error fetching courses:', response.error);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred while fetching courses';
      setError(errorMessage);
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsSubmitting(true);

    try {
      // Basic form validation
      if (!formData.title.trim()) {
        throw new Error('Course title is required');
      }
      if (!formData.description.trim()) {
        throw new Error('Course description is required');
      }
      if (isNaN(parseFloat(formData.price)) || parseFloat(formData.price) <= 0) {
        throw new Error('Please enter a valid price');
      }

      const courseData = {
        ...formData,
        price: parseFloat(formData.price),
        classesPerMonth: parseInt(formData.classesPerMonth) || 0,
        studentsPerBatch: parseInt(formData.studentsPerBatch) || 0,
        syllabus: formData.syllabus
          .filter(item => item.trim() !== '')
          .map(item => ({
            title: item,
            topics: [item]
          })),
        schedule: 'Flexible', // Defaulting since we removed from form
        category: 'instrumental',
        isActive: true,
        isFeatured: false,
        enrolledStudents: 0,
        isEnrollmentOpen: true,
        batchType: 'weekday',
        certificateIncluded: true
      };

      const response = editingCourse
        ? await apiClient.updateCourse(editingCourse._id || (editingCourse.id as string), courseData)
        : await apiClient.createCourse(courseData);

      if (response.success) {
        setSuccess(editingCourse ? 'Course updated successfully!' : 'Course created successfully!');
        fetchCourses();
        resetForm();
      } else {
        throw new Error(response.error || 'Failed to save course');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred while saving the course';
      setError(errorMessage);
      console.error('Error saving course:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = async (courseId: string | number) => {
    try {
      const response = await apiClient.toggleCourseStatus(courseId.toString());

      if (response.success) {
        fetchCourses();
      } else {
        setError(response.error || 'Failed to toggle course status');
        console.error('Error toggling course status:', response.error);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred while toggling course status';
      setError(errorMessage);
      console.error('Error toggling course status:', error);
    }
  };

  const handleDelete = async (courseId: string | number) => {
    if (!confirm('Are you sure you want to delete this course?')) return;

    try {
      const response = await apiClient.deleteCourse(courseId.toString());

      if (response.success) {
        fetchCourses();
      } else {
        setError(response.error || 'Failed to delete course');
        console.error('Error deleting course:', response.error);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred while deleting the course';
      setError(errorMessage);
      console.error('Error deleting course:', error);
    }
  };

  const handleEdit = (course: Course) => {
    setEditingCourse(course);
    setFormData({
      title: course.title,
      description: course.description,
      price: course.price.toString(),
      language: course.language,
      level: course.level,
      classesPerMonth: (course.classesPerMonth || 0).toString(),
      studentsPerBatch: (course.studentsPerBatch || 0).toString(),
      syllabus: course.syllabus?.length > 0 ? course.syllabus.map(item => item.title) : ['']
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      price: '',
      language: 'Tamil',
      level: 'Beginner',
      classesPerMonth: '',
      studentsPerBatch: '',
      syllabus: ['']
    });
    setEditingCourse(null);
    setShowForm(false);
  };

  const addSyllabusItem = () => {
    setFormData(prev => ({
      ...prev,
      syllabus: [...prev.syllabus, '']
    }));
  };

  const updateSyllabusItem = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      syllabus: prev.syllabus.map((item, i) => i === index ? value : item)
    }));
  };

  const removeSyllabusItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      syllabus: prev.syllabus.filter((_, i) => i !== index)
    }));
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-64 space-y-4">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-200 border-t-purple-600"></div>
        <p className="text-purple-600 font-semibold text-lg">Loading courses...</p>
      </div>
    );
  }

  // Error display
  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Success Message */}
      {success && (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-700">{success}</p>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            Course Management
          </h1>
          <p className="text-gray-600">Manage your Carnatic music courses and curriculum</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-semibold rounded-2xl text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
        >
          <PlusIcon className="h-6 w-6 mr-3" />
          Add New Course
        </button>
      </div>

      {/* Course Form */}
      {showForm && (
        <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-purple-100">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-8">
            {editingCourse ? 'Edit Course' : 'Add New Course'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <div>
                <label className="block text-sm font-medium text-gray-700">Classes per Month</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={formData.classesPerMonth}
                  onChange={(e) => setFormData(prev => ({ ...prev, classesPerMonth: e.target.value }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                required
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Price (₹)</label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Language</label>
                <select
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
                <label className="block text-sm font-medium text-gray-700">Level</label>
                <select
                  value={formData.level}
                  onChange={(e) => setFormData(prev => ({ ...prev, level: e.target.value }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Students per Batch</label>
              <input
                type="number"
                required
                min="1"
                value={formData.studentsPerBatch}
                onChange={(e) => setFormData(prev => ({ ...prev, studentsPerBatch: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Syllabus</label>
              {formData.syllabus.map((item, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => updateSyllabusItem(index, e.target.value)}
                    className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                    placeholder={`Topic ${index + 1}`}
                  />
                  {formData.syllabus.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeSyllabusItem(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addSyllabusItem}
                className="text-purple-600 hover:text-purple-800 text-sm font-medium"
              >
                + Add Topic
              </button>
            </div>

            <div className="flex gap-4 pt-6">
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={resetForm}
                  disabled={isSubmitting}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {editingCourse ? 'Updating...' : 'Creating...'}
                    </>
                  ) : (
                    <>{editingCourse ? 'Update Course' : 'Create Course'}</>
                  )}
                </button>
              </div>
              <button
                type="button"
                onClick={resetForm}
                className="bg-gradient-to-r from-gray-500 to-gray-600 text-white px-8 py-3 rounded-xl hover:from-gray-600 hover:to-gray-700 font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Courses List */}
      <div className="bg-white/80 backdrop-blur-sm shadow-2xl rounded-2xl overflow-hidden border border-purple-100">
        <div className="px-8 py-6 border-b border-purple-100 bg-gradient-to-r from-purple-50 to-pink-50">
          <h2 className="text-2xl font-bold text-gray-900">All Courses</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Course
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Details
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
              {courses.map((course) => (
                <tr key={course._id || course.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{course.title}</div>
                      <div className="text-sm text-gray-500">{course.language} • {course.level}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">₹{course.price?.toLocaleString()}</div>
                    <div className="text-sm text-gray-500">{course.classesPerMonth} classes/month</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${(course.is_active || course.isActive)
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                      }`}>
                      {(course.is_active || course.isActive) ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-8 py-6 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-3">
                      <button
                        onClick={() => handleEdit(course)}
                        className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-all duration-200"
                        title="Edit Course"
                      >
                        <PencilIcon className="h-6 w-6" />
                      </button>
                      <button
                        onClick={() => handleToggleStatus(course._id || course.id as number)}
                        className={`p-2 rounded-lg transition-all duration-200 ${(course.is_active || course.isActive)
                          ? 'text-yellow-600 hover:text-yellow-800 hover:bg-yellow-50'
                          : 'text-green-600 hover:text-green-800 hover:bg-green-50'
                          }`}
                        title={(course.is_active || course.isActive) ? 'Deactivate Course' : 'Activate Course'}
                      >
                        {(course.is_active || course.isActive) ? <EyeSlashIcon className="h-6 w-6" /> : <EyeIcon className="h-6 w-6" />}
                      </button>
                      <button
                        onClick={() => handleDelete(course._id || course.id as number)}
                        className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-all duration-200"
                        title="Delete Course"
                      >
                        <TrashIcon className="h-6 w-6" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {courses.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🎵</div>
            <p className="text-gray-500 text-lg mb-4">No courses found</p>
            <p className="text-gray-400 mb-6">Create your first Carnatic music course to get started!</p>
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Create Your First Course
            </button>
          </div>
        )}
      </div>
    </div>
  );
}