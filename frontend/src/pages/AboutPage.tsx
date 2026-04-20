import React from 'react';
import { Heart, Star, Award, Globe } from 'lucide-react';

export default function AboutPage() {
  // Array of image paths
  const galleryImages = Array.from({ length: 9 }, (_, i) => `/images/${i + 1}.jpg`);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-purple-600 to-indigo-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-white">
            <h1 className="text-5xl font-bold mb-6">About Gayathri Thulasi</h1>
            <p className="text-xl max-w-3xl mx-auto">
              A dedicated Carnatic Music teacher with over 17 years of experience, 
              committed to preserving and sharing the divine art of Indian classical music.
            </p>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-purple-900 mb-6">My Journey</h2>
              <div className="space-y-4 text-purple-700 text-lg leading-relaxed">
                <p>
                  With over 17 years of dedicated experience in teaching Carnatic Music, I have had the privilege 
                  of nurturing countless students in their musical journey. My passion for this divine art form 
                  and commitment to preserving traditional Indian classical music drives everything I do.
                </p>
                <p>
                  As a polyglot, I break language barriers by teaching in Tamil, Telugu, Kannada, and English, 
                  making Carnatic Music accessible to students from diverse backgrounds. My teaching methodology 
                  combines traditional techniques with modern approaches.
                </p>
                <p>
                  Whether you're a complete beginner or looking to advance your skills, I provide personalized 
                  attention through both group classes and one-to-one sessions, available both online and offline 
                  to suit your convenience.
                </p>
              </div>
            </div>
            <div className="relative">
              <img
                src="/images/1.jpg"
                alt="Gayathri Thulasi teaching Carnatic Music"
                className="rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-purple-900 mb-4">Teaching Excellence</h2>
            <p className="text-xl text-purple-700">What makes my teaching approach unique and effective</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6">
              <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-6">
                <Award className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-purple-900 mb-3">17+ Years Experience</h3>
              <p className="text-purple-700">
                Extensive experience in teaching students of all ages and skill levels with proven results.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-6">
                <Globe className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-purple-900 mb-3">Multilingual Teaching</h3>
              <p className="text-purple-700">
                Teaching in Tamil, Telugu, Kannada, and English to reach students from diverse backgrounds.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-6">
                <Heart className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-purple-900 mb-3">Personalized Approach</h3>
              <p className="text-purple-700">
                Individual attention and customized learning plans for each student's unique needs.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-6">
                <Star className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-purple-900 mb-3">Traditional & Modern</h3>
              <p className="text-purple-700">
                Combining traditional Carnatic techniques with modern teaching methodologies.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Image Gallery Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-purple-900 text-center mb-12">Glimpses of Our Journey</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {galleryImages.map((src, index) => (
              <div key={index} className="aspect-square overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
                <img
                  src={src}
                  alt={`Gallery image ${index + 1}`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Teaching Philosophy */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-purple-900 mb-4">Teaching Philosophy</h2>
            <p className="text-xl text-gray-600">
              My approach to nurturing musical talent and preserving cultural heritage
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="bg-purple-50 p-8 rounded-xl">
              <p className="text-lg text-purple-700 leading-relaxed mb-6">
                "I believe that Carnatic music is not just about learning songs or techniques – it's about connecting 
                with our cultural heritage and developing a deep spiritual relationship with music. Every student is 
                unique, and I tailor my teaching approach to match their learning style, pace, and goals."
              </p>
              <p className="text-lg text-purple-700 leading-relaxed mb-6">
                "My methodology focuses on building a strong foundation in the basics while gradually introducing 
                more complex concepts. I emphasize the importance of understanding the theory behind each raga and 
                tala, as this knowledge enhances the emotional expression in performance."
              </p>
              <p className="text-lg text-purple-700 leading-relaxed">
                "Through patience, encouragement, and structured learning, I help my students not only master the 
                technical aspects of Carnatic music but also develop the confidence to express themselves through 
                this beautiful art form."
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}