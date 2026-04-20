import express from 'express';
import * as faqController from '../controllers/faq.controller';
import * as testimonialController from '../controllers/testimonial.controller';
import * as homeContentController from '../controllers/homeContent.controller';
import * as admissionController from '../controllers/admission.controller';
import { NotificationService } from '../services/notification.service';

const router = express.Router();

// FAQ Routes
router.get('/faqs', faqController.getFAQs);

// Testimonial Routes
router.get('/testimonials', testimonialController.getTestimonials);
router.post('/testimonials', testimonialController.createTestimonial);

// Home Content Routes
router.get('/home-content', homeContentController.getHomeContent);

// Admission Routes
router.get('/admission/status', admissionController.getAdmissionStatus);
router.post('/admission/increment-enrollments', admissionController.incrementEnrollments);

// Test email endpoint
router.post('/test-email', async (req, res) => {
  try {
    console.log('🧪 Testing email system...');
    console.log('Environment check:', {
      RESEND_API_KEY: !!process.env.RESEND_API_KEY,
      ADMIN_NOTIFICATION_EMAIL: process.env.ADMIN_NOTIFICATION_EMAIL,
      RESEND_FROM_EMAIL: process.env.RESEND_FROM_EMAIL
    });

    const testData = {
      studentName: 'Email Test User',
      courseName: 'Carnatic Vocal Basic',
      courseLevel: 'Beginner',
      startDate: 'Next Week',
      contactNumber: '9876543210',
      email: 'test@example.com',
      totalAmount: 6250
    };

    await NotificationService.sendEnrollmentNotificationToAdmin({
      ...testData,
      studentAge: 25,
      location: 'Chennai, Tamil Nadu',
      courseType: 'Individual Online (Indian Students)',
      preferredLanguage: 'Tamil',
      enrollmentId: 'EMAIL-TEST-' + Date.now(),
      paymentMethod: 'Test Payment',
      enrollmentDate: new Date().toLocaleDateString('en-IN')
    });

    res.json({
      success: true,
      message: 'Test email process completed',
      checkEmail: 'thulasi5885@gmail.com',
      checkResend: 'https://resend.com/',
      fromEmail: 'Gayathri Music Academy <thulasi5885@gmail.com>',
      timestamp: new Date().toISOString()
    });
  } catch (error: unknown) {
    const errorMessage = (error as Error)?.message || 'Unknown error';
    console.error('❌ Test email endpoint error:', errorMessage);
    res.status(500).json({
      success: false,
      error: 'Test email failed',
      details: errorMessage,
      checkInbox: 'thulasi5885@gmail.com',
      checkResend: 'https://resend.com/',
      environment: {
        RESEND_API_KEY: !!process.env.RESEND_API_KEY,
        ADMIN_NOTIFICATION_EMAIL: process.env.ADMIN_NOTIFICATION_EMAIL,
        RESEND_FROM_EMAIL: process.env.RESEND_FROM_EMAIL
      }
    });
  }
});

export default router;
