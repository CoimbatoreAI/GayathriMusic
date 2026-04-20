import { Link } from 'react-router-dom';
import { Shield, Eye, Lock, Users, Mail, Phone } from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-amber-50 to-white">
      {/* Header Section */}
      <section className="py-20 md:py-32 bg-gradient-to-r from-purple-600 to-purple-800 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-block px-3 py-1 mb-6 text-sm font-semibold text-purple-200 bg-purple-700 rounded-full">
            Legal Information
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
            Privacy Policy
          </h1>
          <p className="text-lg md:text-xl text-purple-100 max-w-3xl mx-auto leading-relaxed">
            Your privacy is important to us. This policy explains how we collect, use, and protect your personal information.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
            <div className="prose prose-lg max-w-none">

              {/* Introduction */}
              <div className="mb-12">
                <div className="flex items-center mb-6">
                  <Shield className="h-8 w-8 text-purple-600 mr-3" />
                  <h2 className="text-3xl font-bold text-purple-900">Introduction</h2>
                </div>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Welcome to Gayathri Thulasi Carnatic Music Academy. We are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  By using our website or services, you agree to the collection and use of information in accordance with this policy.
                </p>
              </div>

              {/* Information We Collect */}
              <div className="mb-12">
                <div className="flex items-center mb-6">
                  <Eye className="h-8 w-8 text-purple-600 mr-3" />
                  <h2 className="text-3xl font-bold text-purple-900">Information We Collect</h2>
                </div>
                <h3 className="text-xl font-semibold text-purple-800 mb-4">Personal Information</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  We may collect personal information that you provide directly to us, including:
                </p>
                <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
                  <li>Name and contact information (email, phone number)</li>
                  <li>Address and location information</li>
                  <li>Payment information for course enrollment</li>
                  <li>Educational background and musical experience</li>
                  <li>Communication preferences</li>
                </ul>

                <h3 className="text-xl font-semibold text-purple-800 mb-4">Automatically Collected Information</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  When you visit our website, we automatically collect certain information, including:
                </p>
                <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
                  <li>IP address and location data</li>
                  <li>Browser type and version</li>
                  <li>Pages visited and time spent on our site</li>
                  <li>Device information</li>
                  <li>Referral sources</li>
                </ul>
              </div>

              {/* How We Use Your Information */}
              <div className="mb-12">
                <div className="flex items-center mb-6">
                  <Users className="h-8 w-8 text-purple-600 mr-3" />
                  <h2 className="text-3xl font-bold text-purple-900">How We Use Your Information</h2>
                </div>
                <p className="text-gray-700 leading-relaxed mb-4">
                  We use the information we collect for various purposes, including:
                </p>
                <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
                  <li>Providing and managing our music education services</li>
                  <li>Processing payments and enrollment</li>
                  <li>Communicating with you about courses and updates</li>
                  <li>Improving our website and services</li>
                  <li>Sending newsletters and promotional materials (with your consent)</li>
                  <li>Responding to your inquiries and support requests</li>
                  <li>Ensuring the security of our platform</li>
                </ul>
              </div>

              {/* Data Sharing */}
              <div className="mb-12">
                <div className="flex items-center mb-6">
                  <Lock className="h-8 w-8 text-purple-600 mr-3" />
                  <h2 className="text-3xl font-bold text-purple-900">Data Sharing and Disclosure</h2>
                </div>
                <p className="text-gray-700 leading-relaxed mb-4">
                  We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:
                </p>
                <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
                  <li>With your explicit consent</li>
                  <li>To comply with legal obligations</li>
                  <li>To protect our rights and prevent fraud</li>
                  <li>With trusted service providers who assist our operations (under strict confidentiality agreements)</li>
                  <li>In connection with a business transfer or merger</li>
                </ul>
              </div>

              {/* Data Security */}
              <div className="mb-12">
                <div className="flex items-center mb-6">
                  <Shield className="h-8 w-8 text-purple-600 mr-3" />
                  <h2 className="text-3xl font-bold text-purple-900">Data Security</h2>
                </div>
                <p className="text-gray-700 leading-relaxed mb-4">
                  We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include:
                </p>
                <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
                  <li>SSL/TLS encryption for data transmission</li>
                  <li>Secure data storage and access controls</li>
                  <li>Regular security audits and updates</li>
                  <li>Employee training on data protection</li>
                  <li>Limited access to personal information on a need-to-know basis</li>
                </ul>
              </div>

              {/* Your Rights */}
              <div className="mb-12">
                <div className="flex items-center mb-6">
                  <Eye className="h-8 w-8 text-purple-600 mr-3" />
                  <h2 className="text-3xl font-bold text-purple-900">Your Rights</h2>
                </div>
                <p className="text-gray-700 leading-relaxed mb-4">
                  You have the following rights regarding your personal information:
                </p>
                <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
                  <li><strong>Access:</strong> Request a copy of your personal information</li>
                  <li><strong>Correction:</strong> Request correction of inaccurate information</li>
                  <li><strong>Deletion:</strong> Request deletion of your personal information</li>
                  <li><strong>Portability:</strong> Request transfer of your data</li>
                  <li><strong>Restriction:</strong> Request limitation of processing</li>
                  <li><strong>Objection:</strong> Object to processing based on legitimate interests</li>
                  <li><strong>Withdrawal:</strong> Withdraw consent at any time</li>
                </ul>
              </div>

              {/* Cookies */}
              <div className="mb-12">
                <div className="flex items-center mb-6">
                  <Lock className="h-8 w-8 text-purple-600 mr-3" />
                  <h2 className="text-3xl font-bold text-purple-900">Cookies and Tracking</h2>
                </div>
                <p className="text-gray-700 leading-relaxed mb-4">
                  We use cookies and similar technologies to enhance your browsing experience, analyze site traffic, and personalize content. You can control cookie settings through your browser preferences.
                </p>
              </div>

              {/* Contact Information */}
              <div className="mb-12">
                <div className="flex items-center mb-6">
                  <Mail className="h-8 w-8 text-purple-600 mr-3" />
                  <h2 className="text-3xl font-bold text-purple-900">Contact Us</h2>
                </div>
                <p className="text-gray-700 leading-relaxed mb-6">
                  If you have any questions about this Privacy Policy or our data practices, please contact us:
                </p>
                <div className="bg-purple-50 p-6 rounded-xl">
                  <div className="flex items-center mb-3">
                    <Mail className="h-5 w-5 text-purple-600 mr-3" />
                    <span className="text-gray-700">gayathri.thulasi@gmail.com</span>
                  </div>
                  <div className="flex items-center mb-3">
                    <Phone className="h-5 w-5 text-purple-600 mr-3" />
                    <span className="text-gray-700">+91 98765 43210</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-gray-700">Chennai, Tamil Nadu, India</span>
                  </div>
                </div>
              </div>

              {/* Updates */}
              <div className="mb-12">
                <h2 className="text-3xl font-bold text-purple-900 mb-6">Updates to This Policy</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  We encourage you to review this Privacy Policy periodically to stay informed about how we are protecting your information.
                </p>
              </div>

              {/* Last Updated */}
              <div className="text-center pt-8 border-t border-gray-200">
                <p className="text-sm text-gray-500">
                  Last updated: {new Date().toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>

            </div>
          </div>

          {/* Navigation */}
          <div className="mt-12 text-center">
            <Link
              to="/"
              className="inline-block px-8 py-4 bg-gradient-to-r from-purple-700 to-amber-600 text-white font-bold rounded-full text-lg shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-105 hover:from-purple-800 hover:to-amber-700"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}