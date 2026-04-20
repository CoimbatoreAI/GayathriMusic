import { Phone, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-purple-900 text-white w-full">
      <div className="w-full max-w-[2000px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12">
          <div className="col-span-1 lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <img 
                src="/images/logo.png" 
                alt="Gayathri Thulasi Logo" 
                className="h-12 w-auto object-contain"
              />
            </div>
            <p className="text-gray-300 mb-4 text-sm sm:text-base max-w-md">
              Master the divine art of Carnatic Music with over 17 years of teaching experience. 
              Learn in Tamil, Telugu, Kannada, or English with personalized attention.
            </p>
          </div>

          <div className="mt-6 sm:mt-0">
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Quick Links</h3>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-2 sm:gap-y-3">
              <li><a href="/about" className="text-sm sm:text-base text-gray-300 hover:text-amber-400 transition-colors block py-1 sm:py-1.5">About Us</a></li>
              <li><a href="/courses" className="text-sm sm:text-base text-gray-300 hover:text-amber-400 transition-colors block py-1 sm:py-1.5">Courses</a></li>
              <li><a href="/testimonials" className="text-sm sm:text-base text-gray-300 hover:text-yellow-400 transition-colors block py-1 sm:py-1.5">Testimonials</a></li>
              <li><a href="/fees" className="text-sm sm:text-base text-gray-300 hover:text-yellow-400 transition-colors block py-1 sm:py-1.5">Fees</a></li>
              <li><a href="/faq" className="text-sm sm:text-base text-gray-300 hover:text-yellow-400 transition-colors block py-1 sm:py-1.5">FAQ</a></li>
              <li><a href="/terms-and-conditions" className="text-sm sm:text-base text-gray-300 hover:text-amber-400 transition-colors block py-1 sm:py-1.5">Terms & Conditions</a></li>
              <li><a href="/privacy-policy" className="text-sm sm:text-base text-gray-300 hover:text-amber-400 transition-colors block py-1 sm:py-1.5">Privacy Policy</a></li>
              <li><a href="/contact" className="text-sm sm:text-base text-gray-300 hover:text-amber-400 transition-colors block py-1 sm:py-1.5">Contact</a></li>
            </ul>
          </div>

          <div className="mt-6 sm:mt-0">
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Contact Info</h3>
            <div className="space-y-3 sm:space-y-4">
              <a href="tel:+919876543210" className="flex items-start sm:items-center space-x-2 text-gray-300 hover:text-amber-400 transition-colors group">
                <Phone className="h-4 w-4 mt-1 sm:mt-0 flex-shrink-0" />
                <span className="text-sm sm:text-base">+91 98765 43210</span>
              </a>
              <a href="mailto:gayathri.thulasi@gmail.com" className="flex items-start sm:items-center space-x-2 text-gray-300 hover:text-amber-400 transition-colors group">
                <Mail className="h-4 w-4 mt-1 sm:mt-0 flex-shrink-0" />
                <span className="text-sm sm:text-base break-all">gayathri.thulasi@gmail.com</span>
              </a>
              <div className="flex items-start sm:items-center space-x-2 text-gray-300">
                <MapPin className="h-4 w-4 mt-1 sm:mt-0 flex-shrink-0" />
                <span className="text-sm sm:text-base">Chennai, Tamil Nadu</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-purple-700 mt-8 sm:mt-10 pt-6 sm:pt-8 text-center">
          <p className="text-xs sm:text-sm text-gray-400">
            © {new Date().getFullYear()} Gayathri Carnatic Music. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}