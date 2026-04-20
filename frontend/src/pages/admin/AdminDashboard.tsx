import { useState, useEffect } from 'react';
import { useNavigate, Outlet, Link, useLocation } from 'react-router-dom';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import {
  ArrowLeftOnRectangleIcon as LogoutIcon,
  HomeIcon,
  BookOpenIcon,
  QuestionMarkCircleIcon,
  ChatBubbleLeftRightIcon,
  DocumentTextIcon,
  Cog6ToothIcon,
  CurrencyRupeeIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';
import { apiClient } from '../../lib/api';

interface DashboardStats {
  totalStudents: number;
  totalRevenue: number;
  activeCourses: number;
  pendingTestimonials: number;
}

export default function AdminDashboard() {
  const { admin, logout } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [stats, setStats] = useState<DashboardStats>({
    totalStudents: 0,
    totalRevenue: 0,
    activeCourses: 0,
    pendingTestimonials: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Fetch real data from backend APIs
      const [coursesResponse, testimonialsResponse, studentsResponse] = await Promise.all([
        apiClient.getCourses(),
        apiClient.getAdminTestimonials('pending'),
        apiClient.getStudents()
      ]);

      const coursesData = coursesResponse.success && Array.isArray(coursesResponse.data) ? coursesResponse.data : [];
      const testimonialsData = testimonialsResponse.success && Array.isArray(testimonialsResponse.data) ? testimonialsResponse.data : [];
      const studentsData = studentsResponse.success && Array.isArray(studentsResponse.data) ? studentsResponse.data : [];

      const activeCourses = coursesData.filter((c: any) => c.isActive).length;
      const pendingTestimonials = testimonialsData.length;
      const totalStudents = studentsData.length;
      const totalRevenue = studentsData.reduce((sum: number, s: any) => sum + (s.totalPaid || 0), 0);

      setStats({
        totalStudents,
        totalRevenue,
        activeCourses,
        pendingTestimonials
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      // Set default values if API calls fail
      setStats({
        totalStudents: 0,
        totalRevenue: 0,
        activeCourses: 0,
        pendingTestimonials: 0
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const navigation = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: HomeIcon },
    { name: 'Courses', href: '/admin/dashboard/courses', icon: BookOpenIcon },
    { name: 'FAQs', href: '/admin/dashboard/faqs', icon: QuestionMarkCircleIcon },
    { name: 'Testimonials', href: '/admin/dashboard/testimonials', icon: ChatBubbleLeftRightIcon },
    { name: 'Home Content', href: '/admin/dashboard/home-content', icon: DocumentTextIcon },
    { name: 'Fee Structure', href: '/admin/dashboard/fee-structures', icon: CurrencyRupeeIcon },
    { name: 'Students', href: '/admin/dashboard/students', icon: UserGroupIcon },
    { name: 'Admission Settings', href: '/admin/dashboard/admission-settings', icon: Cog6ToothIcon },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-200 border-t-purple-600 mx-auto mb-4"></div>
          <p className="text-purple-600 font-semibold">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-lg border-b border-purple-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">🎵</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Gayathri Thulasi
                </h1>
                <p className="text-sm text-gray-600 font-medium">Carnatic Music Academy Admin</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-500">Welcome back!</p>
                <p className="font-semibold text-gray-900">{admin?.username}</p>
              </div>
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
              >
                <LogoutIcon className="h-5 w-5 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <div className="w-72 bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl p-6 border border-purple-100">
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-800 mb-2">Admin Panel</h2>
              <div className="w-16 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
            </div>
            <nav className="space-y-3">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center px-4 py-4 text-sm font-semibold rounded-xl transition-all duration-200 transform hover:scale-105 ${isActive(item.href)
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                      : 'text-gray-600 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:text-purple-700 border border-transparent hover:border-purple-200'
                      }`}
                  >
                    <Icon className="h-6 w-6 mr-4" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 overflow-hidden shadow-lg rounded-2xl text-white">
                <div className="p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                        <span className="text-2xl">👥</span>
                      </div>
                    </div>
                    <div className="ml-6 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-blue-100 truncate">
                          Total Students
                        </dt>
                        <dd className="text-3xl font-bold text-white">
                          {stats.totalStudents}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-500 to-green-600 overflow-hidden shadow-lg rounded-2xl text-white">
                <div className="p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                        <span className="text-2xl">💰</span>
                      </div>
                    </div>
                    <div className="ml-6 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-green-100 truncate">
                          Total Revenue
                        </dt>
                        <dd className="text-3xl font-bold text-white">
                          ₹{stats.totalRevenue.toLocaleString()}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-500 to-purple-600 overflow-hidden shadow-lg rounded-2xl text-white">
                <div className="p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                        <span className="text-2xl">📚</span>
                      </div>
                    </div>
                    <div className="ml-6 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-purple-100 truncate">
                          Active Courses
                        </dt>
                        <dd className="text-3xl font-bold text-white">
                          {stats.activeCourses}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-orange-500 to-orange-600 overflow-hidden shadow-lg rounded-2xl text-white">
                <div className="p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                        <span className="text-2xl">⭐</span>
                      </div>
                    </div>
                    <div className="ml-6 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-orange-100 truncate">
                          Pending Reviews
                        </dt>
                        <dd className="text-3xl font-bold text-white">
                          {stats.pendingTestimonials}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 mb-8 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold mb-2">Welcome to Your Dashboard! 🎵</h2>
                  <p className="text-purple-100 text-lg">Manage your Carnatic Music Academy with ease</p>
                </div>
                <div className="text-6xl">🎼</div>
              </div>
            </div>

            {/* Page Content */}
            <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl border border-purple-100 overflow-hidden">
              <div className="p-8">
                <Outlet />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
