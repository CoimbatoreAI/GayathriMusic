import { Link } from 'react-router-dom';
import {
  BookOpenIcon,
  QuestionMarkCircleIcon,
  ChatBubbleLeftRightIcon,
  DocumentTextIcon,
  Cog6ToothIcon,
  CurrencyRupeeIcon,
  UserGroupIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

const quickActions = [
  {
    name: 'Manage Courses',
    description: 'Add, edit, or remove courses from your academy',
    href: '/admin/dashboard/courses',
    icon: BookOpenIcon,
    color: 'bg-blue-500'
  },
  {
    name: 'Manage FAQs',
    description: 'Update frequently asked questions and answers',
    href: '/admin/dashboard/faqs',
    icon: QuestionMarkCircleIcon,
    color: 'bg-green-500'
  },
  {
    name: 'Manage Testimonials',
    description: 'Review and approve student testimonials',
    href: '/admin/dashboard/testimonials',
    icon: ChatBubbleLeftRightIcon,
    color: 'bg-yellow-500'
  },
  {
    name: 'Home Content',
    description: 'Edit website content and sections',
    href: '/admin/dashboard/home-content',
    icon: DocumentTextIcon,
    color: 'bg-purple-500'
  },
  {
    name: 'Fee Structure',
    description: 'Manage course fees and registration costs',
    href: '/admin/dashboard/fee-structures',
    icon: CurrencyRupeeIcon,
    color: 'bg-indigo-500'
  },
  {
    name: 'Admission Settings',
    description: 'Configure enrollment settings and limits',
    href: '/admin/dashboard/admission-settings',
    icon: Cog6ToothIcon,
    color: 'bg-red-500'
  },
  {
    name: 'Manage Students',
    description: 'View student enrollments and payment status',
    href: '/admin/dashboard/students',
    icon: UserGroupIcon,
    color: 'bg-orange-500'
  }
];

export default function DashboardHome() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
          Dashboard Overview
        </h2>
        <p className="text-gray-600 text-lg">
          Welcome to your admin dashboard. Here you can manage all aspects of your music academy.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.name}
                to={action.href}
                className="group block bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-purple-100 hover:shadow-2xl hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition-all duration-300 transform hover:scale-105"
              >
                <div className="p-8">
                  <div className="flex items-center">
                    <div className={`flex-shrink-0 w-16 h-16 ${action.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <div className="ml-6 flex-1">
                      <h4 className="text-xl font-bold text-gray-900 group-hover:text-purple-700 transition-colors">{action.name}</h4>
                      <p className="text-sm text-gray-600 mt-2 group-hover:text-gray-700">{action.description}</p>
                    </div>
                    <ArrowRightIcon className="h-6 w-6 text-gray-400 group-hover:text-purple-500 group-hover:translate-x-2 transition-all duration-300" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Getting Started */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-purple-800 rounded-2xl p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 text-8xl opacity-10">🎼</div>
        <h3 className="text-3xl font-bold mb-8 relative z-10">Getting Started Guide</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-all duration-300">
            <h4 className="font-bold mb-3 text-xl flex items-center">
              <span className="text-2xl mr-3">🎵</span>
              Set Up Your Courses
            </h4>
            <p className="text-purple-100">
              Start by adding your music courses with detailed information about duration, fees, and curriculum.
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-all duration-300">
            <h4 className="font-bold mb-3 text-xl flex items-center">
              <span className="text-2xl mr-3">📝</span>
              Configure Content
            </h4>
            <p className="text-purple-100">
              Update your website content, FAQs, and testimonials to provide the best experience for your students.
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-all duration-300">
            <h4 className="font-bold mb-3 text-xl flex items-center">
              <span className="text-2xl mr-3">⚙️</span>
              Manage Settings
            </h4>
            <p className="text-purple-100">
              Configure admission settings, enrollment limits, and other academy preferences.
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-all duration-300">
            <h4 className="font-bold mb-3 text-xl flex items-center">
              <span className="text-2xl mr-3">📊</span>
              Monitor Progress
            </h4>
            <p className="text-purple-100">
              Keep track of student enrollments, payments, and overall academy performance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
