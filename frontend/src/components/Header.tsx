import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Music, Home, Info, BookOpen, MessageSquare, DollarSign, HelpCircle, Phone, Lock, Megaphone, X } from 'lucide-react';
import { apiClient } from '../lib/api';
import '../styles/glassmorphic.css';

export default function Header() {
  const location = useLocation();
  const [admissionStatus, setAdmissionStatus] = useState<any>(null);
  const [showBanner, setShowBanner] = useState(true);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await apiClient.getAdmissionStatus();
        if (response.success && response.data) {
          setAdmissionStatus(response.data);
        }
      } catch (error) {
        console.error('Error fetching admission status:', error);
      }
    };
    fetchStatus();
  }, []);

  const navigation = [
    { name: 'Home', href: '/', icon: <Home className="h-4 w-4 sm:h-5 sm:w-5" /> },
    { name: 'About', href: '/about', icon: <Info className="h-4 w-4 sm:h-5 sm:w-5" /> },
    { name: 'Courses', href: '/courses', icon: <BookOpen className="h-4 w-4 sm:h-5 sm:w-5" /> },
    { name: 'Fees', href: '/fees', icon: <DollarSign className="h-4 w-4 sm:h-5 sm:w-5" /> },
    { name: 'FAQ', href: '/faq', icon: <HelpCircle className="h-4 w-4 sm:h-5 sm:w-5" /> },
    { name: 'Testimonials', href: '/testimonials', icon: <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5" /> },
    { name: 'Contact', href: '/contact', icon: <Phone className="h-4 w-4 sm:h-5 sm:w-5" /> },
  ];

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {admissionStatus?.announcement && showBanner && (
        <div className="fixed top-0 w-full z-[60] bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 text-white py-2 px-4 shadow-xl">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center flex-1 justify-center animate-pulse-slow">
              <Megaphone className="h-4 w-4 mr-2 hidden sm:block" />
              <p className="text-sm font-bold text-center tracking-wide">
                📢 {admissionStatus.announcement}
              </p>
            </div>
            <button
              onClick={() => setShowBanner(false)}
              className="p-1 hover:bg-white/20 rounded-full transition-colors ml-4"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
      <header className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/85 backdrop-blur-lg shadow-lg' : 'bg-white/20 backdrop-blur-md'} border-b border-gold-200/30 ${admissionStatus?.announcement && showBanner ? 'top-[40px] sm:top-[36px]' : 'top-0'}`}>
        {/* Enhanced gradient overlay for better contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/15 via-white/5 to-transparent pointer-events-none"></div>

        <nav className="relative w-full max-w-[2000px] mx-auto px-3 sm:px-6 lg:px-8 transition-all duration-300 h-[90px] sm:h-[80px] flex items-center">
          <div className="flex justify-between items-center w-full">
            <div className="flex items-center flex-shrink-0">
              <Link to="/" className="flex items-center group">
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-gold-400 via-yellow-400 to-gold-500 rounded-full blur opacity-0 group-hover:opacity-60 transition-all duration-400"></div>
                  <div className={`relative px-2 sm:px-3 py-2 bg-white/95 backdrop-blur-md rounded-xl flex items-center transform transition-all duration-300 group-hover:scale-105 shadow-lg ${scrolled ? 'ring-1 ring-gold-200/60' : 'ring-1 ring-white/30'}`}>
                    <div className="relative">
                      <img
                        src="/images/logo.png"
                        alt="Gayathri Thulasi Logo"
                        className="h-10 w-10 sm:h-11 sm:w-11 object-contain transition-transform duration-300 group-hover:scale-110"
                      />
                    </div>
                    <div className="ml-2 sm:ml-3 hidden sm:block">
                      <div className="relative group cursor-pointer">
                        <div className="text-transparent bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text font-bold text-base sm:text-lg leading-tight tracking-wide transition-all duration-300 group-hover:scale-105">
                          Gayathri Carnatic Music
                        </div>
                        <div className="absolute inset-0 text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text font-bold text-base sm:text-lg leading-tight tracking-wide opacity-30 transform translate-y-0.5 blur-sm transition-all duration-300 group-hover:opacity-60">
                          Gayathri Carnatic Music
                        </div>
                        <div className="absolute -inset-1 bg-gradient-to-r from-purple-400/20 via-pink-400/20 to-indigo-400/20 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 blur-sm"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </div>

            {/* Navigation - Responsive */}
            <div className="hidden sm:flex items-center space-x-1 lg:space-x-2">
              {navigation.map((item) => (
                <div key={item.name} className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-gold-400 to-yellow-500 rounded-xl blur opacity-0 group-hover:opacity-30 transition-all duration-300"></div>
                  <Link
                    to={item.href}
                    className={`relative flex items-center justify-center px-2 lg:px-3 py-2 lg:py-2.5 rounded-lg text-sm font-medium transition-all duration-300 whitespace-nowrap transform group-hover:scale-105 ${isActive(item.href)
                      ? 'bg-gradient-to-r from-gold-500 to-yellow-500 text-purple-900 shadow-lg ring-1 ring-gold-300/70'
                      : 'bg-white/95 backdrop-blur-md text-purple-900 hover:text-purple-900 hover:bg-white/98 hover:shadow-lg border border-white/40 hover:border-gold-300/60'
                      }`}
                  >
                    <span className="inline-flex items-center">
                      {item.icon}
                      <span className="ml-1.5 font-medium">{item.name}</span>
                    </span>
                  </Link>
                </div>
              ))}
              <div className="relative group ml-1 lg:ml-2">
                <div className="absolute -inset-1.5 bg-gradient-to-r from-gold-400 via-yellow-400 to-gold-500 rounded-xl blur opacity-0 group-hover:opacity-75 transition-all duration-300"></div>
                <Link
                  to="/enroll"
                  className="relative flex items-center justify-center px-2 lg:px-3 py-2 lg:py-2.5 bg-gradient-to-r from-gold-500 via-yellow-400 to-gold-500 text-purple-900 rounded-xl font-bold text-sm transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:from-gold-600 hover:via-yellow-500 hover:to-gold-600 ring-1 ring-gold-300/70 hover:ring-gold-400/80 border border-gold-400/60 shadow-lg"
                >
                  <Music className="h-4 w-4 mr-1" />
                  <span className="text-sm">Enroll</span>
                </Link>
              </div>
              <div className="relative group ml-1 lg:ml-2">
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-purple-700 rounded-xl blur opacity-0 group-hover:opacity-70 transition-all duration-300"></div>
                <Link
                  to="/admin/login"
                  className="relative flex items-center justify-center px-2 lg:px-3 py-2 lg:py-2.5 bg-gradient-to-r from-indigo-700 to-purple-800 text-white rounded-xl font-semibold text-sm transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:from-indigo-800 hover:to-purple-900 border border-indigo-500/60 shadow-lg"
                >
                  <Lock className="h-4 w-4 mr-1" />
                  <span className="text-sm">Admin</span>
                </Link>
              </div>
            </div>

            {/* Mobile Navigation - Two Rows */}
            <div className="sm:hidden flex flex-col space-y-2 py-2">
              {/* First Row: 5 buttons */}
              <div className="flex items-center justify-between w-full px-2">
                {navigation.slice(0, 5).map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-300 min-w-[60px] ${isActive(item.href)
                      ? 'bg-purple-600 text-white shadow-lg shadow-purple-200'
                      : 'bg-white/90 backdrop-blur-md text-purple-900 border border-purple-100 shadow-sm'
                      }`}
                  >
                    <div className={`${isActive(item.href) ? 'text-white' : 'text-purple-600'}`}>{item.icon}</div>
                    <span className="mt-1 text-[10px] font-bold uppercase tracking-tighter">{item.name}</span>
                  </Link>
                ))}
              </div>
              {/* Second Row: 4 buttons */}
              <div className="flex items-center justify-center space-x-2 w-full px-2">
                {navigation.slice(5).map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-300 min-w-[75px] flex-1 ${isActive(item.href)
                      ? 'bg-purple-600 text-white shadow-lg shadow-purple-200'
                      : 'bg-white/90 backdrop-blur-md text-purple-900 border border-purple-100 shadow-sm'
                      }`}
                  >
                    <div className={`${isActive(item.href) ? 'text-white' : 'text-purple-600'}`}>{item.icon}</div>
                    <span className="mt-1 text-[10px] font-bold uppercase tracking-tighter">{item.name}</span>
                  </Link>
                ))}
                <Link
                  to="/enroll"
                  className="flex flex-col items-center justify-center p-2 bg-gradient-to-br from-gold-500 to-yellow-500 text-purple-900 rounded-xl font-black shadow-lg flex-1 min-w-[75px]"
                >
                  <Music className="h-4 w-4" />
                  <span className="mt-1 text-[10px] uppercase tracking-tighter">Enroll</span>
                </Link>
                <Link
                  to="/admin/login"
                  className="flex flex-col items-center justify-center p-2 bg-gradient-to-br from-indigo-700 to-purple-800 text-white rounded-xl font-bold shadow-lg flex-1 min-w-[75px]"
                >
                  <Lock className="h-4 w-4" />
                  <span className="mt-1 text-[10px] uppercase tracking-tighter">Admin</span>
                </Link>
              </div>
            </div>
          </div>

        </nav>
      </header>
    </>
  );
}