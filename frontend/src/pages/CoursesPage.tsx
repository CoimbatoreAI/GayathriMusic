import React from 'react';
import { Music, Star, Users } from 'lucide-react';

export default function CoursesPage() {
  const courses = [
    {
      id: '1',
      name: 'Basic Course',
      description: 'Perfect for beginners starting their Carnatic music journey. Build a strong foundation with essential exercises and basic compositions.',
      duration: '6-12 months',
      syllabus: [
        'Swaravali Varisaigal',
        'Jantai Varisaigal', 
        'Dhattu Varisaigal',
        'Upper Sthayi Varisaigal',
        'Saptha Thaala Alankaras',
        'Basic Akkaaram practices',
        'Few Bhajans'
      ],
      image_url: '/images/cm (1).jpeg'
    },
    {
      id: '2',
      name: 'Intermediate Course',
      description: 'Advance your skills with traditional compositions and develop your understanding of ragas and talas.',
      duration: '4-6 months',
      syllabus: [
        'Geetham',
        'Swarajathi',
        'Jathiswaram',
        'Nottuswaram',
        'Bhajans and Akkaarams'
      ],
      image_url: '/images/cm (2).jpeg'
    },
    {
      id: '3',
      name: 'Post Intermediate Course',
      description: 'Master advanced compositions and develop your own style with complex ragas and devotional pieces.',
      duration: '4-6 months',
      syllabus: [
        'Thirupukazh',
        'Devaaram',
        'Varnam',
        'Krithis'
      ],
      image_url: '/images/cm (3).jpeg'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-8">
      {/* Header */}
      <section className="py-16 bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-6">Carnatic Music Courses</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Structured learning programs designed to take you from beginner to advanced levels 
            in the divine art of Carnatic Music.
          </p>
        </div>
      </section>

      {/* Courses Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course) => (
              <div
                key={course.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="h-48 bg-gray-200 overflow-hidden">
                  <img
                    src={course.image_url}
                    alt={course.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-semibold text-purple-900 mb-3">{course.name}</h3>
                  <p className="text-purple-700 mb-4 leading-relaxed">{course.description}</p>
                  
                  <div className="mb-4">
                    <h4 className="font-semibold text-purple-800 mb-2">Syllabus:</h4>
                    <ul className="text-sm text-purple-600 space-y-1">
                      {course.syllabus.map((item, index) => (
                        <li key={index} className="flex items-center">
                          <span className="w-2 h-2 bg-purple-400 rounded-full mr-2"></span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="mb-4">
                    <p className="text-sm text-purple-600">
                      <strong>Duration:</strong> Duration depends entirely on the student's ability. 
                      {course.duration} can be an average estimate.
                    </p>
                  </div>
                  
                  <a 
                    href="/enroll" 
                    className="block w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors duration-300 text-center"
                  >
                    Choose This Course
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Course Benefits */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-purple-900 mb-4">Why Choose Our Courses</h2>
            <p className="text-xl text-purple-700">
              Comprehensive learning experience designed for your musical growth
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-6">
                <Music className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-purple-900 mb-3">Traditional Foundation</h3>
              <p className="text-purple-700">
                Learn authentic Carnatic music with proper foundation in swaras, ragas, and talas.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-6">
                <Star className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-purple-900 mb-3">Personalized Learning</h3>
              <p className="text-purple-700">
                Courses adapted to your pace and learning style with individual attention.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-6">
                <Users className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-purple-900 mb-3">Cultural Heritage</h3>
              <p className="text-purple-700">
                Connect with centuries of musical tradition and cultural wisdom through authentic teaching.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}