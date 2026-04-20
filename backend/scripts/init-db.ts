import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Import models
import Admin from '../models/admin.model';
import Course from '../models/course.model';
import Student from '../models/student.model';
import Payment from '../models/payment.model';
import FAQ from '../models/faq.model';
import Testimonial from '../models/testimonial.model';
import HomeContent from '../models/homeContent.model';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/carnatic_music_school';

interface SampleData {
  admins: Record<string, unknown>[];
  courses: Record<string, unknown>[];
  students: Record<string, unknown>[];
  payments: Record<string, unknown>[];
  faqs: Record<string, unknown>[];
  testimonials: Record<string, unknown>[];
  homeContent: Record<string, unknown>[];
}

const sampleData: SampleData = {
  admins: [
    {
      username: 'admin@gayathrithulasi',
      email: 'admin@gayathrithulasi',
      password: 'gayathrithulasi',
      role: 'super_admin',
      isActive: true,
      lastLogin: null,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ],

  courses: [
    {
      title: 'Individual Online Basic Course (Indian Students)',
      description: 'Perfect for beginners starting their Carnatic music journey. Build a strong foundation with essential exercises and basic compositions.',
      duration: '1 month',
      price: 6000,
      language: 'Tamil',
      level: 'Beginner',
      isActive: true,
      maxStudents: 1,
      enrolledStudents: 0,
      schedule: 'Flexible timing',
      syllabus: [
        {
          title: 'Introduction to Carnatic Music',
          topics: ['Basic Swara Exercises', 'Jantai Varisaigal', 'Dattu Varisaigal', 'Saptha Thaala Alankaras', 'Basic Akkaaram practices', 'Few Bhajans']
        }
      ],
      prerequisites: 'No prior music experience required',
      materials: [
        'Course workbook',
        'Practice audio files',
        'Video tutorials',
        'Notation sheets'
      ],
      instructor: 'Gayathri Thulasi',
      classType: 'individual',
      location: 'Online',
      startDate: new Date('2024-04-01'),
      endDate: new Date('2024-04-30'),
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      title: 'Individual Online Intermediate Course (Indian Students)',
      description: 'Advance your skills with traditional compositions and develop your understanding of ragas and talas.',
      duration: '1 month',
      price: 6000,
      language: 'Tamil',
      level: 'Intermediate',
      isActive: true,
      maxStudents: 1,
      enrolledStudents: 0,
      schedule: 'Flexible timing',
      syllabus: [
        {
          title: 'Advanced Topics',
          topics: ['Complex Ragas (Kamboji, Kalyani)', 'Varnams and Kritis', 'Advanced Tala Patterns', 'Manodharma (Improvisation)', 'Concert Preparation']
        }
      ],
      prerequisites: 'Basic course completion or equivalent experience',
      materials: [
        'Advanced workbook',
        'Raga notation sheets',
        'Practice recordings',
        'Performance guidelines'
      ],
      instructor: 'Gayathri Thulasi',
      classType: 'individual',
      location: 'Online',
      startDate: new Date('2024-04-01'),
      endDate: new Date('2024-04-30'),
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      title: 'Individual Online Post Intermediate Course (Indian Students)',
      description: 'Master advanced compositions and develop your own style with complex ragas and devotional pieces.',
      duration: '1 month',
      price: 7500,
      language: 'Tamil',
      level: 'Advanced',
      isActive: true,
      maxStudents: 1,
      enrolledStudents: 0,
      schedule: 'Flexible timing',
      syllabus: [
        {
          title: 'Advanced Compositions',
          topics: ['Thirupukazh', 'Devaaram', 'Complex Varnam', 'Advanced Krithis', 'Raga Alapana', 'Tani Avartanam']
        }
      ],
      prerequisites: 'Intermediate course completion',
      materials: [
        'Advanced notation books',
        'Concert recordings',
        'Performance analysis',
        'Composition guides'
      ],
      instructor: 'Gayathri Thulasi',
      classType: 'individual',
      location: 'Online',
      startDate: new Date('2024-04-01'),
      endDate: new Date('2024-04-30'),
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      title: 'Group Online Basic Course (Indian Students)',
      description: 'Learn Carnatic music in a group setting with fellow enthusiasts. Perfect for building community while learning.',
      duration: '1 month',
      price: 2500,
      language: 'Tamil',
      level: 'Beginner',
      isActive: true,
      maxStudents: 25,
      enrolledStudents: 0,
      schedule: 'Sat, Sun - 10:00 AM IST',
      syllabus: [
        {
          title: 'Group Learning',
          topics: ['Group swara exercises', 'Basic compositions', 'Group singing techniques', 'Peer learning activities']
        }
      ],
      prerequisites: 'No prior experience required',
      materials: [
        'Group workbook',
        'Shared audio resources',
        'Group practice guides'
      ],
      instructor: 'Gayathri Thulasi',
      classType: 'group',
      location: 'Online',
      startDate: new Date('2024-04-01'),
      endDate: new Date('2024-04-30'),
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      title: 'Group Online Intermediate Course (Indian Students)',
      description: 'Advance your skills in a group setting with traditional compositions and raga understanding.',
      duration: '1 month',
      price: 2500,
      language: 'Tamil',
      level: 'Intermediate',
      isActive: true,
      maxStudents: 25,
      enrolledStudents: 0,
      schedule: 'Sat, Sun - 10:00 AM IST',
      syllabus: [
        {
          title: 'Intermediate Group Topics',
          topics: ['Complex Ragas (Kamboji, Kalyani)', 'Varnams and Kritis', 'Advanced Tala Patterns', 'Group Manodharma', 'Concert Preparation']
        }
      ],
      prerequisites: 'Basic course completion or equivalent experience',
      materials: [
        'Advanced workbook',
        'Raga notation sheets',
        'Practice recordings',
        'Performance guidelines'
      ],
      instructor: 'Gayathri Thulasi',
      classType: 'group',
      location: 'Online',
      startDate: new Date('2024-04-01'),
      endDate: new Date('2024-04-30'),
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      title: 'Group Online Post Intermediate Course (Indian Students)',
      description: 'Master advanced compositions in a group setting with complex ragas and devotional pieces.',
      duration: '1 month',
      price: 4000,
      language: 'Tamil',
      level: 'Advanced',
      isActive: true,
      maxStudents: 25,
      enrolledStudents: 0,
      schedule: 'Sat, Sun - 10:00 AM IST',
      syllabus: [
        {
          title: 'Advanced Compositions',
          topics: ['Thirupukazh', 'Devaaram', 'Complex Varnam', 'Advanced Krithis', 'Raga Alapana', 'Tani Avartanam']
        }
      ],
      prerequisites: 'Intermediate course completion',
      materials: [
        'Advanced notation books',
        'Concert recordings',
        'Performance analysis',
        'Composition guides'
      ],
      instructor: 'Gayathri Thulasi',
      classType: 'group',
      location: 'Online',
      startDate: new Date('2024-04-01'),
      endDate: new Date('2024-04-30'),
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      title: 'Individual Online Basic Course (Foreign Students)',
      description: 'Perfect for beginners starting their Carnatic music journey. Build a strong foundation with essential exercises and basic compositions.',
      duration: '1 month',
      price: 8000,
      language: 'English',
      level: 'Beginner',
      isActive: true,
      maxStudents: 1,
      enrolledStudents: 0,
      schedule: 'Flexible timing',
      syllabus: [
        {
          title: 'Introduction to Carnatic Music',
          topics: ['Basic Swara Exercises', 'Jantai Varisaigal', 'Dattu Varisaigal', 'Saptha Thaala Alankaras', 'Basic Akkaaram practices', 'Few Bhajans']
        }
      ],
      prerequisites: 'No prior music experience required',
      materials: [
        'Course workbook',
        'Practice audio files',
        'Video tutorials',
        'Notation sheets'
      ],
      instructor: 'Gayathri Thulasi',
      classType: 'individual',
      location: 'Online',
      startDate: new Date('2024-04-01'),
      endDate: new Date('2024-04-30'),
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      title: 'Individual Online Intermediate Course (Foreign Students)',
      description: 'Advance your skills with traditional compositions and develop your understanding of ragas and talas.',
      duration: '1 month',
      price: 8000,
      language: 'English',
      level: 'Intermediate',
      isActive: true,
      maxStudents: 1,
      enrolledStudents: 0,
      schedule: 'Flexible timing',
      syllabus: [
        {
          title: 'Advanced Topics',
          topics: ['Complex Ragas (Kamboji, Kalyani)', 'Varnams and Kritis', 'Advanced Tala Patterns', 'Manodharma (Improvisation)', 'Concert Preparation']
        }
      ],
      prerequisites: 'Basic course completion or equivalent experience',
      materials: [
        'Advanced workbook',
        'Raga notation sheets',
        'Practice recordings',
        'Performance guidelines'
      ],
      instructor: 'Gayathri Thulasi',
      classType: 'individual',
      location: 'Online',
      startDate: new Date('2024-04-01'),
      endDate: new Date('2024-04-30'),
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      title: 'Individual Online Post Intermediate Course (Foreign Students)',
      description: 'Master advanced compositions and develop your own style with complex ragas and devotional pieces.',
      duration: '1 month',
      price: 9500,
      language: 'English',
      level: 'Advanced',
      isActive: true,
      maxStudents: 1,
      enrolledStudents: 0,
      schedule: 'Flexible timing',
      syllabus: [
        {
          title: 'Advanced Group Topics',
          topics: ['Thirupukazh', 'Devaaram', 'Complex Varnam', 'Advanced Krithis', 'Raga Alapana', 'Tani Avartanam']
        }
      ],
      prerequisites: 'Intermediate course completion',
      materials: [
        'Advanced notation books',
        'Concert recordings',
        'Performance analysis',
        'Composition guides'
      ],
      instructor: 'Gayathri Thulasi',
      classType: 'individual',
      location: 'Online',
      startDate: new Date('2024-04-01'),
      endDate: new Date('2024-04-30'),
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      title: 'Individual Offline Basic Course (Chennai Only)',
      description: 'Personal one-on-one training at our Chennai facility. Ideal for focused, intensive learning.',
      duration: '1 month',
      price: 8000,
      language: 'Tamil',
      level: 'Beginner',
      isActive: true,
      maxStudents: 1,
      enrolledStudents: 0,
      schedule: 'Flexible timing (Mon-Sat)',
      syllabus: [
        {
          title: 'Personalized Learning',
          topics: ['Personalized curriculum', 'Intensive practice sessions', 'One-on-one feedback', 'Flexible pacing']
        }
      ],
      prerequisites: 'No prior experience required',
      materials: [
        'Personal workbook',
        'Recording equipment access',
        'Private practice room',
        'Custom learning materials'
      ],
      instructor: 'Gayathri Thulasi',
      classType: 'individual',
      location: 'Chennai, Tamil Nadu',
      startDate: new Date('2024-04-01'),
      endDate: new Date('2024-04-30'),
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      title: 'Individual Offline Intermediate Course (Chennai Only)',
      description: 'Advance your skills with personal one-on-one training at our Chennai facility.',
      duration: '1 month',
      price: 8000,
      language: 'Tamil',
      level: 'Intermediate',
      isActive: true,
      maxStudents: 1,
      enrolledStudents: 0,
      schedule: 'Flexible timing (Mon-Sat)',
      syllabus: [
        {
          title: 'Advanced Topics',
          topics: ['Complex Ragas (Kamboji, Kalyani)', 'Varnams and Kritis', 'Advanced Tala Patterns', 'Manodharma (Improvisation)', 'Concert Preparation']
        }
      ],
      prerequisites: 'Basic course completion or equivalent experience',
      materials: [
        'Advanced workbook',
        'Raga notation sheets',
        'Practice recordings',
        'Performance guidelines'
      ],
      instructor: 'Gayathri Thulasi',
      classType: 'individual',
      location: 'Chennai, Tamil Nadu',
      startDate: new Date('2024-04-01'),
      endDate: new Date('2024-04-30'),
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      title: 'Individual Offline Post Intermediate Course (Chennai Only)',
      description: 'Master advanced compositions with personal one-on-one training at our Chennai facility.',
      duration: '1 month',
      price: 9500,
      language: 'Tamil',
      level: 'Advanced',
      isActive: true,
      maxStudents: 1,
      enrolledStudents: 0,
      schedule: 'Flexible timing (Mon-Sat)',
      syllabus: [
        {
          title: 'Advanced Compositions',
          topics: ['Thirupukazh', 'Devaaram', 'Complex Varnam', 'Advanced Krithis', 'Raga Alapana', 'Tani Avartanam']
        }
      ],
      prerequisites: 'Intermediate course completion',
      materials: [
        'Advanced notation books',
        'Concert recordings',
        'Performance analysis',
        'Composition guides'
      ],
      instructor: 'Gayathri Thulasi',
      classType: 'individual',
      location: 'Chennai, Tamil Nadu',
      startDate: new Date('2024-04-01'),
      endDate: new Date('2024-04-30'),
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ],

  students: [
    {
      firstName: 'Arun',
      lastName: 'Kumar',
      email: 'arun.kumar@email.com',
      phone: '+919876543210',
      dateOfBirth: new Date('2000-05-15'),
      gender: 'Male',
      address: '123 MG Road, Chennai, Tamil Nadu, 600001, India',
      city: 'Chennai',
      state: 'Tamil Nadu',
      postalCode: '600001',
      country: 'India',
      parentName: 'Priya Kumar',
      parentPhone: '+919876543211',
      parentEmail: 'priya.kumar@email.com',
      joiningDate: new Date('2024-01-15'),
      status: 'active',
      enrolledCourses: [],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      firstName: 'Meera',
      lastName: 'Sharma',
      email: 'meera.sharma@email.com',
      phone: '+918765432109',
      dateOfBirth: new Date('1998-08-22'),
      gender: 'Female',
      address: '456 Anna Nagar, Chennai, Tamil Nadu, 600040, India',
      city: 'Chennai',
      state: 'Tamil Nadu',
      postalCode: '600040',
      country: 'India',
      parentName: 'Raj Sharma',
      parentPhone: '+918765432110',
      parentEmail: 'raj.sharma@email.com',
      joiningDate: new Date('2024-02-01'),
      status: 'active',
      enrolledCourses: [],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      firstName: 'Vikram',
      lastName: 'Rao',
      email: 'vikram.rao@email.com',
      phone: '+917654321098',
      dateOfBirth: new Date('1995-12-10'),
      gender: 'Male',
      address: '789 T. Nagar, Chennai, Tamil Nadu, 600017, India',
      city: 'Chennai',
      state: 'Tamil Nadu',
      postalCode: '600017',
      country: 'India',
      parentName: 'Lakshmi Rao',
      parentPhone: '+917654321099',
      parentEmail: 'lakshmi.rao@email.com',
      joiningDate: new Date('2023-11-20'),
      status: 'inactive',
      enrolledCourses: [],
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ],

  payments: [
    {
      studentId: null, // Will be set after student creation
      courseId: null, // Will be set after course creation
      amount: 6250,
      currency: 'INR',
      paymentMethod: 'upi',
      transactionId: 'TXN_20240115_001',
      status: 'completed',
      paymentDate: new Date('2024-01-15T10:30:00Z'),
      registrationFee: 250,
      courseFee: 6000,
      totalAmount: 6250,
      gatewayResponse: {
        gateway: 'razorpay',
        paymentId: 'pay_1234567890',
        orderId: 'order_1234567890',
        signature: 'signature_hash_here'
      },
      notes: 'First month payment for Basic Course',
      createdAt: new Date('2024-01-15T10:30:00Z'),
      updatedAt: new Date('2024-01-15T10:30:00Z')
    },
    {
      studentId: null, // Will be set after student creation
      courseId: null, // Will be set after course creation
      amount: 8250,
      currency: 'INR',
      paymentMethod: 'net_banking',
      transactionId: 'TXN_20240201_002',
      status: 'completed',
      paymentDate: new Date('2024-02-01T14:20:00Z'),
      registrationFee: 250,
      courseFee: 8000,
      totalAmount: 8250,
      gatewayResponse: {
        gateway: 'razorpay',
        paymentId: 'pay_0987654321',
        orderId: 'order_0987654321',
        signature: 'signature_hash_here'
      },
      notes: 'Intermediate course enrollment',
      createdAt: new Date('2024-02-01T14:20:00Z'),
      updatedAt: new Date('2024-02-01T14:20:00Z')
    }
  ],

  faqs: [
    {
      question: "What is the procedure to enroll?",
      answer: "Select the course you want to join and complete the online payment of fees. Once the payment is successful, you will receive a welcome email and WhatsApp message from us. Within 12 hours, our team will send you email and WhatsApp messages regarding the next course of action.",
      category: 'admission',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      question: "How to determine which course I have to join?",
      answer: "If you have never had any Carnatic Music Classes previously, then you are a beginner and have to choose BASIC level. If you have some previous experience with learning Carnatic Music, you can choose between the INTERMEDIATE or POST-INTERMEDIATE levels. If you are unable to determine which level you belong to, the teacher will assess you and guide you to your correct level at the first class.",
      category: 'courses',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      question: "What is the procedure to join online classes?",
      answer: "Once you enroll by paying the fees, our team will communicate with you on how to join the online class. Online classes are usually done through Google Meet. We will let you know the date and time and send you the link to join.",
      category: 'courses',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      question: "Will there be extra classes if the teacher is unable to show up for one or more scheduled classes?",
      answer: "If the teacher is unable to be present for the scheduled classes, extra classes will be rescheduled at a later date and time that is convenient for both the teacher and the student.",
      category: 'courses',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      question: "Can the student have an extra class if the student is unable to show up for one of the 8 classes in the month?",
      answer: "We will try to accommodate an extra class as best as we could depending on the availability of the teacher.",
      category: 'courses',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      question: "Will Gayathri Thulasi be teaching every student that enrolls?",
      answer: "Gayathri Thulasi will be accommodating students in her teaching schedule. Any student that she is unable to accommodate in her teaching schedule will be handled by her team of teachers and Gayathri Thulasi will be tracking their progress and overseeing a part of one class per month.",
      category: 'courses',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      question: "What is the minimum age to join Carnatic music classes?",
      answer: "Minimum age is 5 years.",
      category: 'admission',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      question: "Can the students have the recorded version of their online classes?",
      answer: "Yes. The students can request a recorded version of their online classes from the teacher.",
      category: 'courses',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      question: "Will you guide me towards exams that provide me certification of passing?",
      answer: "Yes. We will guide you towards exams that provide you certification of passing.",
      category: 'courses',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      question: "Will you provide reading material for the students?",
      answer: "Yes. We will be providing PDF files for theoretical learning.",
      category: 'courses',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major payment methods including credit cards, debit cards, UPI, net banking, and international payment options for foreign students.",
      category: 'fees',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      question: "Are there any technical requirements for online classes?",
      answer: "You need a stable internet connection, a device with camera and microphone (computer, tablet, or smartphone), and Google Meet access. We recommend using headphones for better audio quality.",
      category: 'courses',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      question: "Can I switch between online and offline classes?",
      answer: "Yes, you can switch between online and offline classes based on availability and your location. Please note that offline classes are only available for Chennai-based students.",
      category: 'courses',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      question: "What happens if I miss multiple classes in a month?",
      answer: "We understand that emergencies happen. We will work with you to reschedule missed classes based on teacher availability. However, we encourage regular attendance for best learning outcomes.",
      category: 'courses',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      question: "Do you provide performance opportunities for students?",
      answer: "Yes, we organize regular student performances, recitals, and encourage participation in competitions to build confidence and showcase progress.",
      category: 'courses',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ],

  testimonials: [
    {
      studentName: 'Priya Sharma',
      role: 'Adult Student',
      language: 'English',
      type: 'Individual Online Classes',
      rating: 5,
      review: 'Gayathri ma\'am is an exceptional teacher who made learning Carnatic music so enjoyable. Her patience and dedication helped me progress from a complete beginner to performing confidently. The online classes were perfectly structured and interactive.',
      isApproved: true,
      featured: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      studentName: 'Ravi Kumar',
      role: 'Parent of 12-year-old',
      language: 'Tamil',
      type: 'Individual Offline Classes',
      rating: 5,
      review: 'My daughter has been learning from Gayathri teacher for 2 years now. The improvement in her voice and understanding of ragas is remarkable. The teacher\'s ability to explain complex concepts in simple Tamil makes learning effective.',
      isApproved: true,
      featured: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      studentName: 'Meera Reddy',
      role: 'College Student',
      language: 'Telugu',
      type: 'Group Online Classes',
      rating: 5,
      review: 'Learning Carnatic music in Telugu from Gayathri ma\'am has been a wonderful experience. Her teaching methodology combines traditional techniques with modern approaches. The group classes create a great learning environment.',
      isApproved: true,
      featured: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      studentName: 'Ananya Rao',
      role: 'Working Professional',
      language: 'Kannada',
      type: 'Individual Online Classes',
      rating: 5,
      review: 'As a working professional, the flexible timing of online classes was perfect for me. Gayathri teacher\'s expertise in Kannada made learning comfortable and natural. Her encouragement boosted my confidence tremendously.',
      isApproved: true,
      featured: false,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      studentName: 'Lakshmi Iyer',
      role: 'Senior Citizen',
      language: 'Tamil',
      type: 'Individual Offline Classes',
      rating: 5,
      review: 'At 65, I thought it was too late to learn music. Gayathri ma\'am proved me wrong! Her patient teaching and understanding of senior learners\' needs made my musical journey beautiful. The offline classes provide personal attention I needed.',
      isApproved: true,
      featured: false,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      studentName: 'Arjun Nair',
      role: 'Teenager',
      language: 'English',
      type: 'Group Offline Classes',
      rating: 5,
      review: 'Gayathri teacher makes Carnatic music cool and accessible. Her modern teaching approach while maintaining traditional values is amazing. The group classes with other students my age make learning fun and competitive.',
      isApproved: true,
      featured: false,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      studentName: 'Divya Krishnan',
      role: 'Music Enthusiast',
      language: 'Tamil',
      type: 'Performance Training',
      rating: 5,
      review: 'The depth of knowledge Gayathri ma\'am possesses is incredible. She doesn\'t just teach songs but explains the theory, history, and emotions behind each raga. Her passion for music is contagious and inspiring.',
      isApproved: true,
      featured: false,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      studentName: 'Suresh Babu',
      role: 'Parent of 8-year-old',
      language: 'Telugu',
      type: 'Individual Offline Classes',
      rating: 5,
      review: 'My son started learning when he was 6. Gayathri teacher\'s child-friendly approach and ability to keep young minds engaged is remarkable. The progress in just 2 years has been phenomenal. Highly recommended for children.',
      isApproved: true,
      featured: false,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ],

  homeContent: [
    {
      section: 'hero',
      title: 'Learn Carnatic Music with Gayathri Thulasi',
      content: 'Master the divine art of Carnatic Music with over 17 years of teaching experience from Gayathri Thulasi. Learn in your preferred language - Tamil, Telugu, Kannada, or English.',
      isActive: true,
      order: 1
    },
    {
      section: 'about',
      title: 'Why Choose Our Music School?',
      content: 'We provide comprehensive Carnatic music education with experienced teachers and flexible learning options.',
      isActive: true,
      order: 2
    },
    {
      section: 'services',
      title: 'Teaching Services',
      content: 'We offer various teaching services including online classes, offline classes, group classes, and one-to-one sessions.',
      isActive: true,
      order: 3
    },
    {
      section: 'cta',
      title: 'Start Your Musical Journey Today',
      content: 'Join our community of music lovers and begin your Carnatic music journey with expert guidance.',
      buttonText: 'View Fees Structure',
      buttonLink: '/fees',
      isActive: true,
      order: 4
    },
    {
      section: 'keypoints',
      title: 'Key Points',
      content: JSON.stringify([
        { value: '17+', title: 'Years Experience', description: 'Expert Guidance' },
        { value: '4+', title: 'Languages', description: 'Tamil, Telugu, Kannada, English' },
        { value: 'Flexible', title: 'Learning Modes', description: 'Online & Offline Classes' }
      ]),
      isActive: true,
      order: 5
    }
  ]
};

async function initializeDatabase(): Promise<void> {
  try {
    console.log('🚀 Starting database initialization...');
    console.log('📋 MongoDB URI:', MONGODB_URI.replace(/:([^:@]{8})[^:@]*@/, ':$1****@'));

    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB Atlas');

    // Test database permissions
    console.log('🔍 Testing database permissions...');
    try {
      const db = mongoose.connection.db;
      if (!db) {
        throw new Error('Database connection not established');
      }
      const collections = await db.listCollections().toArray();
      console.log(`✅ Can access database. Found ${collections.length} collections`);
    } catch (error: unknown) {
      const errorMessage = (error as Error)?.message || '';
      if (errorMessage && errorMessage.includes('user is not allowed to do action')) {
        console.error('❌ Database permission error detected!');
        console.log('💡 To fix this issue:');
        console.log('   1. Go to MongoDB Atlas Dashboard');
        console.log('   2. Navigate to Network Access');
        console.log('   3. Add IP Address: 0.0.0.0/0 (Allow Access from Anywhere)');
        console.log('   4. Go to Database > Manage');
        console.log('   5. Edit the database user permissions to include:');
        console.log('      - Read/Write access to carnatic_music_school database');
        console.log('   6. Or create a new user with proper permissions');
        throw error;
      }
      throw error;
    }

    // Clear existing data to avoid duplicates
    console.log('🧹 Clearing existing data...');
    await Admin.deleteMany({});
    await Course.deleteMany({});
    await Student.deleteMany({});
    await Payment.deleteMany({});
    await HomeContent.deleteMany({});

    // Insert sample courses
    console.log('📚 Creating sample courses...');
    for (const courseData of sampleData.courses) {
      try {
        const course = new Course(courseData);
        await course.save();
      } catch (error: unknown) {
        const errorMessage = (error as Error)?.message || '';
        if ((error as { code?: number })?.code === 11000) {
          console.log('ℹ️  Course already exists, skipping...');
        } else {
          console.error('❌ Error creating course:', error);
        }
      }
    }
    console.log(`✅ Sample courses created: ${sampleData.courses.length}`);

    // Create admin user with specified credentials
    console.log('👤 Creating admin user...');
    try {
      const admin = new Admin({
        ...sampleData.admins[0],
        password: 'gayathrithulasi'  // Let the model pre-save hook hash it
      });
      await admin.save();
      console.log('✅ Admin user created: admin@gayathrithulasi / gayathrithulasi');
    } catch (error: unknown) {
      const errorMessage = (error as Error)?.message || '';
      if ((error as { code?: number })?.code === 11000) {
        console.log('ℹ️  Admin user already exists, skipping creation...');
      } else if (errorMessage && errorMessage.includes('user is not allowed to do action')) {
        console.error('❌ MongoDB permission error: Cannot create admin user');
        console.log('💡 To fix this issue:');
        console.log('   1. Go to MongoDB Atlas Dashboard');
        console.log('   2. Navigate to Network Access');
        console.log('   3. Add IP Address: 0.0.0.0/0 (Allow Access from Anywhere)');
        console.log('   4. Go to Database > Manage');
        console.log('   5. Edit the database user permissions to include:');
        console.log('      - Read/Write access to carnatic_music_school database');
        console.log('      - Or create a new user with proper permissions');
        console.log('');
        console.log('🔧 Alternative: Use the HTTP endpoint to create admin:');
        console.log('   POST http://localhost:5000/api/admin/init-default');
        throw error;
      } else {
        console.error('❌ Error creating admin user:', error);
        throw error;
      }
    }

    // Create indexes for better performance
    console.log('⚡ Creating database indexes...');

    // Admin indexes
    await Admin.collection.createIndex({ username: 1 }, { unique: true });
    await Admin.collection.createIndex({ email: 1 }, { unique: true });
    await Admin.collection.createIndex({ role: 1 });
    await Admin.collection.createIndex({ isActive: 1 });

    // Course indexes
    await Course.collection.createIndex({ isActive: 1, level: 1, language: 1 });
    await Course.collection.createIndex({ title: 1 });
    await Course.collection.createIndex({ classType: 1 });
    await Course.collection.createIndex({ location: 1 });
    await Course.collection.createIndex({ startDate: 1 });
    await Course.collection.createIndex({ instructor: 1 });
    await Course.collection.createIndex({ price: 1 });

    // Student indexes
    await Student.collection.createIndex({ email: 1 }, { unique: true });
    await Student.collection.createIndex({ status: 1 });
    await Student.collection.createIndex({ joiningDate: -1 });
    await Student.collection.createIndex({ firstName: 1, lastName: 1 });
    await Student.collection.createIndex({ enrolledCourses: 1 });

    // Payment indexes
    try {
      await Payment.collection.createIndex({ studentId: 1 });
      await Payment.collection.createIndex({ courseId: 1 });
      await Payment.collection.createIndex({ status: 1 });
      await Payment.collection.createIndex({ paymentDate: -1 });
      await Payment.collection.createIndex({ transactionId: 1 }, { unique: true, background: true });
      await Payment.collection.createIndex({ paymentMethod: 1 });
      await Payment.collection.createIndex({ amount: 1 });
    } catch (error) {
      console.log('ℹ️  Some payment indexes already exist, skipping...');
    }

    // FAQ indexes
    try {
      await FAQ.collection.createIndex({ category: 1 });
      await FAQ.collection.createIndex({ isActive: 1 });
      await FAQ.collection.createIndex({ createdAt: -1 });
    } catch (error) {
      console.log('ℹ️  Some FAQ indexes already exist, skipping...');
    }

    // Testimonial indexes
    try {
      await Testimonial.collection.createIndex({ isApproved: 1 });
      await Testimonial.collection.createIndex({ featured: 1 });
      await Testimonial.collection.createIndex({ rating: -1 });
      await Testimonial.collection.createIndex({ language: 1 });
      await Testimonial.collection.createIndex({ type: 1 });
      await Testimonial.collection.createIndex({ createdAt: -1 });
    } catch (error) {
      console.log('ℹ️  Some testimonial indexes already exist, skipping...');
    }

    console.log('✅ Database indexes created');


    // Insert sample FAQs
    console.log('❓ Creating sample FAQs...');
    for (const faqData of sampleData.faqs) {
      try {
        const faq = new FAQ(faqData);
        await faq.save();
      } catch (error: unknown) {
        const errorMessage = (error as Error)?.message || '';
        if ((error as { code?: number })?.code === 11000) {
          console.log('ℹ️  FAQ already exists, skipping...');
        } else {
          console.error('❌ Error creating FAQ:', error);
        }
      }
    }
    console.log(`✅ Sample FAQs created: ${sampleData.faqs.length}`);

    // Insert sample Testimonials
    console.log('⭐ Creating sample Testimonials...');
    for (const testimonialData of sampleData.testimonials) {
      try {
        const testimonial = new Testimonial(testimonialData);
        await testimonial.save();
      } catch (error: unknown) {
        const errorMessage = (error as Error)?.message || '';
        if ((error as { code?: number })?.code === 11000) {
          console.log('ℹ️  Testimonial already exists, skipping...');
        } else {
          console.error('❌ Error creating Testimonial:', error);
        }
      }
    }
    console.log(`✅ Sample Testimonials created: ${sampleData.testimonials.length}`);

    // Insert sample Home Content
    console.log('🏠 Creating sample Home Content...');
    for (const contentData of sampleData.homeContent) {
      try {
        const content = new HomeContent(contentData);
        await content.save();
      } catch (error: unknown) {
        const errorMessage = (error as Error)?.message || '';
        if ((error as { code?: number })?.code === 11000) {
          console.log('ℹ️  Home Content already exists, skipping...');
        } else {
          console.error('❌ Error creating Home Content:', error);
        }
      }
    }
    console.log(`✅ Sample Home Content created: ${sampleData.homeContent.length}`);

    // Display summary
    console.log('\n🎉 Database initialization completed successfully!');
    console.log('📊 Summary:');
    console.log(`   • Admin users: ${await Admin.countDocuments()}`);
    console.log(`   • Courses: ${await Course.countDocuments()}`);
    console.log(`   • Students: ${await Student.countDocuments()}`);
    console.log(`   • FAQs: ${await FAQ.countDocuments()}`);
    console.log(`   • Testimonials: ${await Testimonial.countDocuments()}`);
    console.log(`   • Home Content: ${await HomeContent.countDocuments()}`);

    console.log('\n🔐 Admin Login Credentials:');
    console.log('   Username: admin@gayathrithulasi');
    console.log('   Password: gayathrithulasi');

    console.log('\n🚀 Admin user setup completed!');
    console.log('\n📝 Next Steps:');
    console.log('   1. Go to http://localhost:5174/admin/login');
    console.log('   2. Use the credentials above to login');
    console.log('   3. Start managing your music academy!');

  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
}

// Run the initialization
if (require.main === module) {
  initializeDatabase();
}

export default initializeDatabase;