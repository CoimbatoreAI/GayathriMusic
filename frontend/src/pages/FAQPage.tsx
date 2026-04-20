import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, HelpCircle, Loader2 } from 'lucide-react';
import { apiClient } from '../lib/api';

interface FAQ {
  _id: string;
  question: string;
  answer: string;
  category: string;
  isActive: boolean;
}

export default function FAQPage() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        const response = await apiClient.getFAQs();
        if (response.success && Array.isArray(response.data)) {
          setFaqs(response.data.filter((faq: FAQ) => faq.isActive));
        } else {
          setError('Failed to load FAQs');
        }
      } catch (err) {
        console.error('Error fetching FAQs:', err);
        setError('An error occurred while loading FAQs');
      } finally {
        setLoading(false);
      }
    };

    fetchFAQs();
  }, []);

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-purple-600 animate-spin mx-auto mb-4" />
          <p className="text-purple-700 font-medium">Loading answers...</p>
        </div>
      </div>
    );
  }

  if (error && faqs.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center p-8 bg-red-50 rounded-2xl max-w-md">
          <HelpCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-red-700 mb-2">Oops!</h2>
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-6">Frequently Asked Questions</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Find answers to common questions about learning Carnatic Music with Gayathri Thulasi
          </p>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white border border-purple-200 rounded-xl shadow-lg overflow-hidden"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-purple-50 transition-colors duration-200"
                >
                  <h3 className="text-lg font-semibold text-purple-900 pr-4">
                    {faq.question}
                  </h3>
                  {openFAQ === index ? (
                    <ChevronUp className="h-5 w-5 text-purple-600 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-purple-600 flex-shrink-0" />
                  )}
                </button>

                {openFAQ === index && (
                  <div className="px-6 pb-4">
                    <div className="border-t border-purple-100 pt-4">
                      <p className="text-purple-700 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-purple-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <HelpCircle className="h-16 w-16 text-purple-600 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-purple-900 mb-4">Still Have Questions?</h2>
            <p className="text-lg text-purple-700 mb-8">
              Can't find the answer you're looking for? We're here to help you with any questions
              about learning Carnatic Music.
            </p>
            <div className="space-x-4">
              <a
                href="/contact"
                className="inline-block bg-purple-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-purple-700 transition-all duration-300 transform hover:scale-105"
              >
                Contact Us
              </a>
              <a
                href="/enroll"
                className="inline-block border-2 border-purple-600 text-purple-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-purple-600 hover:text-white transition-all duration-300"
              >
                Enroll Now
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}