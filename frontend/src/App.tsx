import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AdminAuthProvider } from './contexts/AdminAuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import CoursesPage from './pages/CoursesPage';
import TestimonialsPage from './pages/TestimonialsPage';
import FeesPage from './pages/FeesPage';
import FAQPage from './pages/FAQPage';
import ContactPage from './pages/ContactPage';
import EnrollmentPage from './pages/EnrollmentPage';
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentCancel from './pages/PaymentCancel';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsAndConditionsPage from './pages/TermsAndConditionsPage';
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import DashboardHome from './pages/admin/DashboardHome';
import CourseManagement from './pages/admin/CourseManagement';
import FAQManagement from './pages/admin/FAQManagement';
import TestimonialManagement from './pages/admin/TestimonialManagement';
import HomeContentManagement from './pages/admin/HomeContentManagement';
import AdmissionSettingsManagement from './pages/admin/AdmissionSettingsManagement';
import FeeStructureManagement from './pages/admin/FeeStructureManagement';
import StudentManagement from './pages/admin/StudentManagement';
import { ProtectedRoute } from './components/admin/ProtectedRoute';

function App() {
  console.log('🚀 App component rendering');

  return (
    <AdminAuthProvider>
      <Router>
        <ScrollToTop />
        <div className="min-h-screen bg-white relative flex flex-col">
          {/* Geometric borders - hidden on mobile for better performance */}
          <div className="hidden sm:block">
            <div className="geometric-border-left"></div>
            <div className="geometric-border-right"></div>
          </div>

          <Header />
          <main className="flex-1 w-full max-w-[2000px] mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-12 sm:pt-32 sm:pb-16">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/courses" element={<CoursesPage />} />
              <Route path="/testimonials" element={<TestimonialsPage />} />
              <Route path="/fees" element={<FeesPage />} />
              <Route path="/faq" element={<FAQPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/enroll" element={<EnrollmentPage />} />
              <Route path="/enrollment/payment/success" element={<PaymentSuccess />} />
              <Route path="/enrollment/payment/cancel" element={<PaymentCancel />} />
              <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
              <Route path="/terms-and-conditions" element={<TermsAndConditionsPage />} />

              {/* Admin Routes */}
              <Route path="/admin/login" element={<AdminLoginPage />} />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <Navigate to="/admin/dashboard" replace />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              >
                <Route index element={<DashboardHome />} />
                <Route path="courses" element={<CourseManagement />} />
                <Route path="faqs" element={<FAQManagement />} />
                <Route path="testimonials" element={<TestimonialManagement />} />
                <Route path="home-content" element={<HomeContentManagement />} />
                <Route path="admission-settings" element={<AdmissionSettingsManagement />} />
                <Route path="fee-structures" element={<FeeStructureManagement />} />
                <Route path="students" element={<StudentManagement />} />
              </Route>

              {/* 404 Route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AdminAuthProvider>
  );
}

export default App;