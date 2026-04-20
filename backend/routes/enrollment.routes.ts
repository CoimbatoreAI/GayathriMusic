import express from 'express';
import { NotificationService, WelcomeMessageData } from '../services/notification.service';

const router = express.Router();

interface EnrollmentData {
  studentName: string;
  studentAge: number;
  contactNumber: string;
  email: string;
  location: string;
  courseType: string;
  courseLevel: string;
  classType: string;
  preferredLanguage: string;
  paymentMethod: string;
  selectedCourse: {
    type: string;
    level: string;
    price: number;
    classes: number;
  };
}

// Process enrollment and send welcome notifications
router.post('/complete', async (req, res): Promise<void> => {
  try {
    const enrollmentData: EnrollmentData = req.body;

    // Validate required fields
    const requiredFields = [
      'studentName', 'contactNumber', 'email', 'courseType',
      'courseLevel', 'selectedCourse'
    ];

    for (const field of requiredFields) {
      if (!enrollmentData[field as keyof EnrollmentData]) {
        res.status(400).json({
          error: `Missing required field: ${field}`
        });
        return;
      }
    }

    // Prepare welcome message data
    const welcomeData: WelcomeMessageData = {
      studentName: enrollmentData.studentName,
      courseName: enrollmentData.selectedCourse.type,
      courseLevel: enrollmentData.selectedCourse.level,
      startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }), // 7 days from now
      contactNumber: enrollmentData.contactNumber,
      email: enrollmentData.email,
      totalAmount: enrollmentData.selectedCourse.price + 250 // Including registration fee
    };

    // Send welcome notifications asynchronously
    // This won't block the enrollment response
    setImmediate(async () => {
      try {
        await NotificationService.sendWelcomeNotifications(welcomeData);
        console.log('Welcome notifications sent successfully for:', enrollmentData.email);
      } catch (error) {
        console.error('Failed to send welcome notifications:', error);
        // Log error but don't fail the enrollment
      }
    });

    // Return success response
    res.status(200).json({
      success: true,
      message: 'Enrollment completed successfully! Welcome notifications will be sent shortly.',
      enrollmentId: `ENR${Date.now()}`,
      nextSteps: [
        'Check your email for welcome message and course details',
        'Check your WhatsApp for class schedule and instructions',
        'Download required learning materials from student portal',
        'Join your first class at the scheduled time'
      ]
    });

  } catch (error) {
    console.error('Error processing enrollment:', error);
    res.status(500).json({
      error: 'Failed to process enrollment. Please contact support.'
    });
  }
});

// Test notification endpoint (for development/testing)
router.post('/test-notification', async (req, res): Promise<void> => {
  try {
    const testData: WelcomeMessageData = {
      studentName: 'Test Student',
      courseName: 'Test Course',
      courseLevel: 'Beginner',
      startDate: 'Tomorrow',
      contactNumber: req.body.contactNumber || '9876543210',
      email: req.body.email || 'test@example.com',
      totalAmount: 6000
    };

    await NotificationService.sendWelcomeNotifications(testData);

    res.json({ success: true, message: 'Test notifications sent successfully' });
  } catch (error) {
    console.error('Error sending test notifications:', error);
    res.status(500).json({ error: 'Failed to send test notifications' });
  }
});

export default router;