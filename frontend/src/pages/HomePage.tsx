import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaChalkboardTeacher, FaUsers, FaUserTie, FaLanguage } from 'react-icons/fa';
import { SiGooglemessages, SiGooglemeet } from 'react-icons/si';
import { GiIndiaGate } from 'react-icons/gi';
import { BsTranslate } from 'react-icons/bs';
import { ChevronRight, ChevronLeft, X } from 'lucide-react';
import { apiClient } from '../lib/api';
import '../styles/glassmorphic.css';

interface HomeContent {
  hero?: {
    title: string;
    subtitle: string;
    content: string;
    imageUrl: string;
    buttonText: string;
    buttonLink: string;
  };
  about?: {
    title: string;
    subtitle: string;
    content: string;
  };
  services?: {
    title: string;
    content: string;
  };
  features?: {
    title: string;
    content: string;
  };
  cta?: {
    title: string;
    content: string;
    buttonText: string;
    buttonLink: string;
  };
  keypoints?: {
    title: string;
    content: string;
  };
}

export default function HomePage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [homeContent, setHomeContent] = useState<HomeContent>({});

  useEffect(() => {
    const fetchHomeContent = async () => {
      try {
        const response = await apiClient.getHomeContent();
        if (response.success && response.data) {
          setHomeContent(response.data as HomeContent);
        }
      } catch (error) {
        console.error('Error fetching home content:', error);
      }
    };

    fetchHomeContent();
  }, []);

  // Array of all images (1.jpg to 9.jpg)
  const allImages = Array.from({ length: 9 }, (_, i) => `/images/${i + 1}.jpg`);
  const heroImages = [allImages[0] || '/images/hero-1.jpg', allImages[1] || '/images/hero-2.jpg'];

  // Select 6 random images for gallery
  const galleryImages = allImages
    .sort(() => 0.5 - Math.random())
    .slice(0, 6);

  const openImageModal = (index: number) => {
    setSelectedImage(galleryImages[index]);
    setCurrentImageIndex(index);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
  };

  const navigateImage = (direction: 'prev' | 'next') => {
    let newIndex = currentImageIndex;
    if (direction === 'prev') {
      newIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
    } else {
      newIndex = (currentImageIndex + 1) % galleryImages.length;
    }
    setCurrentImageIndex(newIndex);
    setSelectedImage(galleryImages[newIndex]);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] lg:min-h-0 flex items-center overflow-hidden bg-gradient-to-br from-purple-50 to-indigo-50 py-8 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-6 text-center lg:text-left order-2 lg:order-1 lg:max-w-xl">
              <div className="inline-flex items-center space-x-2 px-3 py-1 bg-purple-100/80 backdrop-blur-sm text-purple-700 rounded-full text-xs font-bold tracking-widest uppercase mb-2 animate-fade-in">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
                </span>
                <span>Established Since 2007</span>
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-gray-900 leading-[1.1] tracking-tight">
                {homeContent.hero?.title || 'Learn Carnatic Music with Gayathri Thulasi'}
              </h1>
              <div className="space-y-4">
                <p className="text-lg sm:text-xl text-gray-700 font-medium leading-relaxed">
                  {homeContent.hero?.content || 'Master the divine art of Carnatic Music with over 17 years of teaching experience from Gayathri Thulasi. Learn in your preferred language - Tamil, Telugu, Kannada, or English.'}
                </p>
                <div className="p-4 bg-white/60 backdrop-blur-sm border-l-4 border-purple-500 rounded-r-xl shadow-sm italic text-gray-600">
                  Gayathri Thulasi has completed Isai kalaimani and Teacher Training Courses from The Music Academy, Chennai. She is a student of Legendary Vidwan Thiru Chingleput Ranganathan, Sri Sandhyavandanam Poorna Pragna Rao, Srimathi Revathi Subramanian.
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6 justify-center lg:justify-start">
                <Link to="/enroll" className="px-10 py-4 bg-purple-600 text-white font-bold rounded-2xl shadow-xl hover:bg-purple-700 hover:shadow-purple-200/50 transition-all transform hover:scale-[1.03] text-center">
                  Enroll Now
                </Link>
                <Link to="/fees" className="px-10 py-4 bg-white text-purple-600 border-2 border-purple-100 font-bold rounded-2xl hover:border-purple-600 transition-all text-center">
                  View Fees
                </Link>
              </div>
            </div>

            {/* Right Images - Integrated stack */}
            <div className="relative h-[450px] sm:h-[550px] lg:h-[700px] flex flex-col items-center justify-center space-y-4 order-1 lg:order-2">
              <div className="relative w-full max-w-md aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl-purple border-4 border-white transform -rotate-2 hover:rotate-0 transition-all duration-700">
                <img
                  src={heroImages[0]}
                  alt="Music class"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="relative w-full max-w-md aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl-purple border-4 border-white transform rotate-3 hover:rotate-0 transition-all duration-700 -mt-20 lg:-mt-32 ml-12">
                <img
                  src={heroImages[1]}
                  alt="Music performance"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Floating decorative elements */}
              <div className="absolute top-10 right-0 w-24 h-24 bg-purple-100 rounded-full blur-3xl opacity-60"></div>
              <div className="absolute bottom-10 left-0 w-32 h-32 bg-indigo-100 rounded-full blur-3xl opacity-60"></div>
            </div>
          </div>
        </div>

        {/* Animated Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute text-purple-200 text-4xl md:text-6xl"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `float ${Math.random() * 10 + 10}s linear infinite`,
                animationDelay: `${Math.random() * 5}s`,
                opacity: 0.6
              }}
            >
              {['𝅗𝅥', '𝅘𝅥', '𝅘𝅥𝅯', '𝅘𝅥𝅮', '𝅘𝅥𝅭'][Math.floor(Math.random() * 5)]}
            </div>
          ))}
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {homeContent.about?.title || 'Why Choose Our Music School?'}
            </h2>
            <div className="w-24 h-1 bg-purple-600 mx-auto"></div>
            {homeContent.about?.subtitle && (
              <p className="text-lg text-gray-600 mt-4">{homeContent.about.subtitle}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: '🎵', title: 'Expert Teacher', description: 'Learn from experienced and passionate musician' },
              { icon: '👥', title: 'Group Classes', description: 'Join a community of music enthusiasts' },
              { icon: '🏆', title: 'Certification', description: 'We assist you towards exams for certifications' },
              { icon: '📚', title: 'Flexible Learning', description: 'Learn at your own pace' },
            ].map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 text-center">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Gallery</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">Take a look at our students' performances and classes</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleryImages.map((image, index) => (
              <div
                key={index}
                className="group relative rounded-xl overflow-hidden shadow-lg cursor-pointer transform transition-transform duration-300 hover:scale-105"
                onClick={() => openImageModal(index)}
              >
                <img
                  src={image}
                  alt={`Gallery ${index + 1}`}
                  className="w-full h-64 object-cover transition-opacity duration-300 group-hover:opacity-90"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                  <div className="bg-white bg-opacity-80 rounded-full p-3 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Teaching Services Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {homeContent.services?.title || 'Teaching Services'}
            </h2>
            <div className="w-24 h-1 bg-purple-600 mx-auto"></div>
            {homeContent.services?.content && (
              <p className="text-lg text-gray-600 mt-4">{homeContent.services.content}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                title: 'Online Classes',
                description: 'Learn from anywhere with interactive sessions',
                icon: <SiGooglemeet className="text-4xl text-purple-600 mb-4 mx-auto" />
              },
              {
                title: 'Offline Classes',
                description: 'Traditional in-person learning',
                icon: <FaChalkboardTeacher className="text-4xl text-purple-600 mb-4 mx-auto" />
              },
              {
                title: 'Group Classes',
                description: 'Join a community of music enthusiasts',
                icon: <FaUsers className="text-4xl text-purple-600 mb-4 mx-auto" />
              },
              {
                title: 'One-to-One',
                description: 'Personalized training sessions tailored to your skill level',
                icon: <FaUserTie className="text-4xl text-purple-600 mb-4 mx-auto" />
              }
            ].map((service, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 text-center border border-gray-100">
                <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
                <p className="text-gray-600">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Learn in Your Preferred Language */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Learn in Your Preferred Language</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">We offer instruction in multiple languages to make learning comfortable and effective for everyone.</p>
          </div>

          <div className="flex flex-wrap justify-center gap-6 max-w-4xl mx-auto">
            {[
              { language: 'Tamil', icon: <BsTranslate className="text-2xl text-purple-600 mr-2" /> },
              { language: 'Telugu', icon: <SiGooglemessages className="text-2xl text-purple-600 mr-2" /> },
              { language: 'Kannada', icon: <FaLanguage className="text-2xl text-purple-600 mr-2" /> },
              { language: 'English', icon: <GiIndiaGate className="text-2xl text-purple-600 mr-2" /> }
            ].map((item, index) => (
              <div key={index} className="flex items-center bg-white px-6 py-3 rounded-full shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1">

                {item.icon}
                <span className="font-medium">{item.language}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            {homeContent.cta?.title || 'Start Your Musical Journey Today'}
          </h2>
          <p className="text-xl text-purple-100 mb-10 max-w-3xl mx-auto">
            {homeContent.cta?.content || 'Join our community of music lovers and begin your Carnatic music journey with expert guidance.'}
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to={homeContent.cta?.buttonLink || '/fees'}
              className="bg-white text-purple-700 hover:bg-gray-100 font-medium py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105"
            >
              {homeContent.cta?.buttonText || 'View Fees Structure'}
            </Link>
            <Link
              to="/testimonials"
              className="bg-transparent border-2 border-white text-white hover:bg-white hover:bg-opacity-10 font-medium py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105"
            >
              Read Testimonials
            </Link>
          </div>
        </div>
      </section>



      {/* Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4" onClick={closeImageModal}>
          <div className="relative max-w-4xl w-full" onClick={e => e.stopPropagation()}>
            <button
              className="absolute -top-10 right-0 text-white hover:text-gray-300 transition-colors duration-200"
              onClick={closeImageModal}
            >
              <X className="h-8 w-8" />
            </button>

            <div className="relative">
              <img
                src={selectedImage}
                alt="Gallery preview"
                className="w-full max-h-[80vh] object-contain rounded-lg"
              />

              <button
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-colors duration-200"
                onClick={(e) => {
                  e.stopPropagation();
                  navigateImage('prev');
                }}
              >
                <ChevronLeft className="h-6 w-6" />
              </button>

              <button
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-colors duration-200"
                onClick={(e) => {
                  e.stopPropagation();
                  navigateImage('next');
                }}
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}