import { useState, useEffect } from 'react';
import { Star, Quote, Users, Award, Globe, TrendingUp, Loader2, MessageCircle } from 'lucide-react';
import { apiClient } from '../lib/api';

interface ITestimonial {
  _id: string;
  studentName: string;
  role: string;
  language: string;
  type: string;
  rating: number;
  review: string;
  isApproved: boolean;
  featured: boolean;
  createdAt: string;
}

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<ITestimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await apiClient.getTestimonials();
        if (response.success && Array.isArray(response.data)) {
          setTestimonials(response.data);
        } else {
          setError('Failed to load testimonials');
        }
      } catch (err) {
        console.error('Error fetching testimonials:', err);
        setError('An error occurred while loading testimonials');
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  const stats = [
    { icon: Users, number: '1000+', label: 'Happy Students' },
    { icon: Award, number: '17+', label: 'Years Experience' },
    { icon: Globe, number: '4', label: 'Languages' },
    { icon: TrendingUp, number: '95%', label: 'Student Satisfaction' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-purple-600 animate-spin mx-auto mb-4" />
          <p className="text-purple-700 font-medium">Loading success stories...</p>
        </div>
      </div>
    );
  }

  if (error && testimonials.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center p-8 bg-purple-50 rounded-2xl max-w-md">
          <MessageCircle className="h-12 w-12 text-purple-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-purple-700 mb-2">No Testimonials Yet</h2>
          <p className="text-purple-600">Be the first to share your journey with us!</p>
          <a href="/contact" className="mt-4 inline-block px-6 py-2 bg-purple-600 text-white rounded-lg">Contact Us</a>
        </div>
      </div>
    );
  }

  const successStories = [
    {
      title: 'Competition Winners',
      description: 'Several students have won state and national level competitions'
    },
    {
      title: 'Professional Musicians',
      description: 'Many students have pursued music professionally'
    },
    {
      title: 'Cultural Ambassadors',
      description: 'Students promote Carnatic music in their communities'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-6">What Our Students Say</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Real experiences from students who have learned Carnatic Music with Gayathri Thulasi
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                    <IconComponent className="h-8 w-8 text-purple-600" />
                  </div>
                  <div className="text-3xl font-bold text-purple-900 mb-2">{stat.number}</div>
                  <div className="text-purple-700">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-purple-100"
              >
                <div className="flex items-center mb-4">
                  <Quote className="h-8 w-8 text-purple-400 mr-3" />
                  <div className="flex">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                </div>

                <p className="text-purple-700 mb-6 italic leading-relaxed">
                  "{testimonial.review}"
                </p>

                <div className="border-t border-purple-100 pt-4">
                  <div className="font-semibold text-purple-900">{testimonial.studentName}</div>
                  <div className="text-sm text-purple-600 mb-1">{testimonial.role} • {testimonial.language}</div>
                  <div className="text-xs text-purple-500 bg-purple-50 px-2 py-1 rounded-full inline-block">
                    {testimonial.type}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-20 bg-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-purple-900 mb-4">Success Stories</h2>
            <p className="text-xl text-purple-700">
              Our students' achievements speak for themselves
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {successStories.map((story, index) => (
              <div key={index} className="text-center p-6 bg-white rounded-xl shadow-lg">
                <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-6">
                  <Award className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-purple-900 mb-3">{story.title}</h3>
                <p className="text-purple-700">{story.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-purple-800 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Join Our Musical Family</h2>
          <p className="text-xl mb-8">
            Become part of a community that celebrates the beauty of Carnatic Music
          </p>
          <div className="space-x-4">
            <a
              href="/enroll"
              className="inline-block bg-yellow-400 text-purple-900 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-yellow-300 transition-all duration-300 transform hover:scale-105"
            >
              Start Your Journey
            </a>
            <a
              href="/contact"
              className="inline-block border-2 border-white text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-white hover:text-purple-900 transition-all duration-300"
            >
              Contact Us
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}