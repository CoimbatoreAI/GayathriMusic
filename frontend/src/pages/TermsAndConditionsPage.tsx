import { Link } from 'react-router-dom';
import { FileText, Users, CreditCard, Shield, AlertTriangle, Mail, Phone } from 'lucide-react';

export default function TermsAndConditionsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-amber-50 to-white">
      {/* Header Section */}
      <section className="py-20 md:py-32 bg-gradient-to-r from-purple-600 to-purple-800 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-block px-3 py-1 mb-6 text-sm font-semibold text-purple-200 bg-purple-700 rounded-full">
            Legal Information
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
            Terms and Conditions
          </h1>
          <p className="text-lg md:text-xl text-purple-100 max-w-3xl mx-auto leading-relaxed">
            Please read these terms and conditions carefully before using our services.
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
                  <FileText className="h-8 w-8 text-purple-600 mr-3" />
                  <h2 className="text-3xl font-bold text-purple-900">Introduction</h2>
                </div>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Welcome to Gayathri Thulasi Carnatic Music Academy. These Terms and Conditions ("Terms") govern your use of our website and services. By accessing or using our services, you agree to be bound by these Terms.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  If you do not agree to these Terms, please do not use our website or services.
                </p>
              </div>

              {/* Definitions */}
              <div className="mb-12">
                <div className="flex items-center mb-6">
                  <Users className="h-8 w-8 text-purple-600 mr-3" />
                  <h2 className="text-3xl font-bold text-purple-900">Definitions</h2>
                </div>
                <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
                  <li><strong>"Service"</strong> refers to the Carnatic music education services provided by Gayathri Thulasi</li>
                  <li><strong>"Website"</strong> refers to our online platform and all associated content</li>
                  <li><strong>"User"</strong> or <strong>"You"</strong> refers to individuals accessing our services</li>
                  <li><strong>"Content"</strong> refers to all materials, information, and resources provided through our services</li>
                </ul>
              </div>

              {/* User Accounts */}
              <div className="mb-12">
                <div className="flex items-center mb-6">
                  <Users className="h-8 w-8 text-purple-600 mr-3" />
                  <h2 className="text-3xl font-bold text-purple-900">User Accounts and Registration</h2>
                </div>
                <h3 className="text-xl font-semibold text-purple-800 mb-4">Account Creation</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  To access certain features of our services, you may need to create an account. You agree to:
                </p>
                <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
                  <li>Provide accurate and complete information during registration</li>
                  <li>Maintain the confidentiality of your account credentials</li>
                  <li>Be responsible for all activities under your account</li>
                  <li>Notify us immediately of any unauthorized use</li>
                </ul>

                <h3 className="text-xl font-semibold text-purple-800 mb-4">Eligibility</h3>
                <p className="text-gray-700 leading-relaxed">
                  Our services are available to individuals of all ages. However, users under 18 must have parental or guardian consent to use our services.
                </p>
              </div>

              {/* Services */}
              <div className="mb-12">
                <div className="flex items-center mb-6">
                  <FileText className="h-8 w-8 text-purple-600 mr-3" />
                  <h2 className="text-3xl font-bold text-purple-900">Services Offered</h2>
                </div>
                <h3 className="text-xl font-semibold text-purple-800 mb-4">Music Education Services</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  We provide comprehensive Carnatic music education including:
                </p>
                <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
                  <li>Online and offline vocal training sessions</li>
                  <li>Music theory and practical lessons</li>
                  <li>Group and individual classes</li>
                  <li>Performance guidance and feedback</li>
                  <li>Educational materials and resources</li>
                </ul>

                <h3 className="text-xl font-semibold text-purple-800 mb-4">Service Availability</h3>
                <p className="text-gray-700 leading-relaxed">
                  Services are available in Tamil, Telugu, Kannada, and English. Classes may be conducted online via video conferencing or in-person in Chennai, Tamil Nadu.
                </p>
              </div>

              {/* Fees and Payment */}
              <div className="mb-12">
                <div className="flex items-center mb-6">
                  <CreditCard className="h-8 w-8 text-purple-600 mr-3" />
                  <h2 className="text-3xl font-bold text-purple-900">Fees and Payment Terms</h2>
                </div>
                <h3 className="text-xl font-semibold text-purple-800 mb-4">Course Fees</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  All course fees are clearly displayed on our website and in our enrollment materials. Fees include:
                </p>
                <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
                  <li>Tuition for scheduled classes</li>
                  <li>Access to learning materials</li>
                  <li>Performance evaluation and feedback</li>
                  <li>Assistance towards exams for certification</li>
                </ul>

                <h3 className="text-xl font-semibold text-purple-800 mb-4">Payment Methods</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  We accept payments through various secure methods including:
                </p>
                <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
                  <li>Bank transfers</li>
                  <li>UPI payments</li>
                  <li>Credit/Debit cards</li>
                  <li>Digital wallets</li>
                </ul>

                <h3 className="text-xl font-semibold text-purple-800 mb-4">Refund Policy</h3>
                <p className="text-gray-700 leading-relaxed">
                  Refunds are processed according to our refund policy. Generally, refunds are available within 14 days of enrollment if the course has not commenced. Please contact us for specific refund requests.
                </p>
              </div>

              {/* User Conduct */}
              <div className="mb-12">
                <div className="flex items-center mb-6">
                  <Shield className="h-8 w-8 text-purple-600 mr-3" />
                  <h2 className="text-3xl font-bold text-purple-900">User Conduct and Responsibilities</h2>
                </div>
                <p className="text-gray-700 leading-relaxed mb-4">
                  By using our services, you agree to:
                </p>
                <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
                  <li>Respect fellow students and instructors</li>
                  <li>Maintain a positive learning environment</li>
                  <li>Attend classes regularly and punctually</li>
                  <li>Complete assignments and practice sessions</li>
                  <li>Provide honest feedback when requested</li>
                  <li>Not disrupt classes or learning activities</li>
                  <li>Respect cultural and traditional aspects of Carnatic music</li>
                </ul>
              </div>

              {/* Intellectual Property */}
              <div className="mb-12">
                <div className="flex items-center mb-6">
                  <FileText className="h-8 w-8 text-purple-600 mr-3" />
                  <h2 className="text-3xl font-bold text-purple-900">Intellectual Property Rights</h2>
                </div>
                <h3 className="text-xl font-semibold text-purple-800 mb-4">Our Content</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  All content provided through our services, including but not limited to:
                </p>
                <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
                  <li>Lesson materials and curriculum</li>
                  <li>Video recordings and audio content</li>
                  <li>Educational resources and worksheets</li>
                  <li>Website design and branding</li>
                </ul>
                <p className="text-gray-700 leading-relaxed mb-4">
                  These materials are protected by copyright and other intellectual property laws.
                </p>

                <h3 className="text-xl font-semibold text-purple-800 mb-4">User Content</h3>
                <p className="text-gray-700 leading-relaxed">
                  By submitting content to our platform, you grant us a non-exclusive, royalty-free license to use, modify, and distribute your content for educational purposes.
                </p>
              </div>

              {/* Limitation of Liability */}
              <div className="mb-12">
                <div className="flex items-center mb-6">
                  <AlertTriangle className="h-8 w-8 text-purple-600 mr-3" />
                  <h2 className="text-3xl font-bold text-purple-900">Limitation of Liability</h2>
                </div>
                <p className="text-gray-700 leading-relaxed mb-4">
                  To the maximum extent permitted by law, Gayathri Thulasi Carnatic Music Academy shall not be liable for:
                </p>
                <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
                  <li>Any indirect, incidental, or consequential damages</li>
                  <li>Loss of profits or business opportunities</li>
                  <li>Data loss or system failures</li>
                  <li>Third-party actions or content</li>
                  <li>Delays or interruptions in service</li>
                </ul>
              </div>

              {/* Termination */}
              <div className="mb-12">
                <div className="flex items-center mb-6">
                  <AlertTriangle className="h-8 w-8 text-purple-600 mr-3" />
                  <h2 className="text-3xl font-bold text-purple-900">Termination</h2>
                </div>
                <p className="text-gray-700 leading-relaxed mb-4">
                  We reserve the right to terminate or suspend your account and access to our services at our discretion, without prior notice, for:
                </p>
                <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
                  <li>Violation of these Terms</li>
                  <li>Non-payment of fees</li>
                  <li>Disruptive behavior</li>
                  <li>Fraudulent activities</li>
                  <li>Extended periods of inactivity</li>
                </ul>
              </div>

              {/* Governing Law */}
              <div className="mb-12">
                <div className="flex items-center mb-6">
                  <Shield className="h-8 w-8 text-purple-600 mr-3" />
                  <h2 className="text-3xl font-bold text-purple-900">Governing Law</h2>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  These Terms shall be governed by and construed in accordance with the laws of India. Any disputes arising from these Terms shall be subject to the exclusive jurisdiction of the courts in Chennai, Tamil Nadu.
                </p>
              </div>

              {/* Contact Information */}
              <div className="mb-12">
                <div className="flex items-center mb-6">
                  <Mail className="h-8 w-8 text-purple-600 mr-3" />
                  <h2 className="text-3xl font-bold text-purple-900">Contact Information</h2>
                </div>
                <p className="text-gray-700 leading-relaxed mb-6">
                  If you have any questions about these Terms and Conditions, please contact us:
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
                <h2 className="text-3xl font-bold text-purple-900 mb-6">Updates to Terms</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  We may update these Terms from time to time. We will notify users of any material changes by posting the updated Terms on this page and updating the "Last updated" date.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Your continued use of our services after any changes constitutes acceptance of the updated Terms.
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