import { Request, Response } from 'express';
import mongoose from 'mongoose';
import crypto from 'crypto';
import Payment from '../models/payment.model';
import Student from '../models/student.model';
import Course from '../models/course.model';
import { NotificationService, EnrollmentNotificationData } from '../services/notification.service';
import Razorpay from 'razorpay';

// Razorpay configuration
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || '',
  key_secret: process.env.RAZORPAY_KEY_SECRET || '',
});

// Create Razorpay order
export const createRazorpayOrder = async (req: Request, res: Response): Promise<Response> => {
  try {
    // Check Razorpay credentials first
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      console.error('❌ Razorpay credentials not configured');
      return res.status(500).json({
        success: false,
        error: 'Razorpay payment system not properly configured'
      });
    }

    const {
      enrollmentId,
      studentId,
      courseId,
      amount,
      currency = 'INR',
      metadata
    } = req.body;

    // Validate required fields with detailed logging
    console.log('🔍 Validating Razorpay order fields:', {
      enrollmentId: !!enrollmentId,
      studentId: !!studentId,
      courseId: !!courseId,
      amount: !!amount,
      metadata: !!metadata,
      metadataKeys: metadata ? Object.keys(metadata) : 'No metadata'
    });

    if (!enrollmentId || !studentId || !courseId || !amount || !metadata) {
      const missingFields = [];
      if (!enrollmentId) missingFields.push('enrollmentId');
      if (!studentId) missingFields.push('studentId');
      if (!courseId) missingFields.push('courseId');
      if (!amount) missingFields.push('amount');
      if (!metadata) missingFields.push('metadata');

      console.error('❌ Missing required fields:', missingFields);
      return res.status(400).json({
        success: false,
        error: `Missing required fields: ${missingFields.join(', ')}`
      });
    }

    // Validate amount
    const numericAmount = Number(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      console.error('❌ Invalid amount:', amount);
      return res.status(400).json({
        success: false,
        error: 'Amount must be a valid positive number'
      });
    }

    // Convert amount to paise for Razorpay (Razorpay expects amount in smallest currency unit)
    const amountInPaise = Math.round(numericAmount * 100);

    // Create Razorpay order
    const orderOptions = {
      amount: amountInPaise,
      currency: currency,
      receipt: enrollmentId,
      notes: {
        enrollmentId: enrollmentId,
        studentId: studentId,
        courseId: courseId,
        courseType: metadata.courseType,
        courseLevel: metadata.courseLevel,
        studentName: metadata.studentName,
        studentEmail: metadata.studentEmail,
        contactNumber: metadata.contactNumber
      }
    };

    console.log('📤 Creating Razorpay order with amount (paise):', amountInPaise);
    const razorpayOrder = await razorpay.orders.create(orderOptions);

    console.log('✅ Razorpay order created:', razorpayOrder.id);

    if (!razorpayOrder.id) {
      console.error('❌ No order ID received from Razorpay:', razorpayOrder);
      return res.status(500).json({
        success: false,
        error: 'Failed to create Razorpay order - no order ID received'
      });
    }

    // Save payment record to database
    const payment = new Payment({
      enrollmentId,
      studentId,
      courseId,
      amount: numericAmount,
      currency,
      status: 'pending',
      razorpayOrderId: razorpayOrder.id,
      paymentMethod: 'razorpay',
      metadata
    });

    await payment.save();
    console.log('✅ Payment record saved to database');

    return res.json({
      success: true,
      data: {
        orderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        key: process.env.RAZORPAY_KEY_ID,
        receipt: razorpayOrder.receipt
      }
    });

  } catch (error) {
    console.error('Error creating Razorpay order:', error);

    // Ensure we always return valid JSON
    const errorMessage = error instanceof Error ? error.message : 'Failed to create Razorpay order';

    return res.status(500).json({
      success: false,
      error: errorMessage,
      timestamp: new Date().toISOString()
    });
  }
};

// Webhook handlers for Razorpay
export const handleRazorpayPaymentSuccess = async (webhookBody: any): Promise<void> => {
  try {
    const { event, payload } = webhookBody;

    if (event === 'payment.authorized' || event === 'payment.captured') {
      const paymentEntity = payload.payment?.entity;
      const orderEntity = payload.order?.entity;

      if (!paymentEntity || !orderEntity) {
        console.error('❌ Invalid webhook payload structure');
        return;
      }

      const razorpayPaymentId = paymentEntity.id;
      const razorpayOrderId = orderEntity.id;
      const amount = paymentEntity.amount / 100; // Convert from paise to rupees
      const currency = paymentEntity.currency;

      console.log('🔔 Razorpay Webhook - Payment successful:', {
        paymentId: razorpayPaymentId,
        orderId: razorpayOrderId,
        amount,
        currency,
        method: paymentEntity.method,
        timestamp: new Date().toISOString()
      });

      // Find and update payment record
      const payment = await Payment.findOne({
        razorpayOrderId: razorpayOrderId
      });

      if (payment) {
        payment.status = 'completed';
        payment.paymentDate = new Date();
        payment.transactionId = razorpayPaymentId;
        payment.razorpayPaymentId = razorpayPaymentId;
        payment.razorpaySignature = paymentEntity.acquirer_data?.rrn || '';
        await payment.save();

        // Update student enrollment status
        await Student.findByIdAndUpdate(payment.studentId, {
          enrollmentStatus: 'confirmed',
          paymentStatus: 'completed',
          enrollmentDate: new Date()
        });

        // Send admin notification
        try {
          const student = await Student.findById(payment.studentId);
          if (student) {
            const enrollmentNotificationData: EnrollmentNotificationData = {
              studentName: `${student.firstName} ${student.lastName}`,
              studentAge: student.dateOfBirth ? new Date().getFullYear() - student.dateOfBirth.getFullYear() : 0,
              contactNumber: student.phone,
              email: student.email,
              location: `${student.city}, ${student.state}`,
              courseType: payment.metadata?.courseType || 'Unknown',
              courseLevel: payment.metadata?.courseLevel || 'Unknown',
              preferredLanguage: 'Tamil',
              totalAmount: payment.amount,
              enrollmentId: payment.enrollmentId,
              paymentMethod: 'Razorpay',
              enrollmentDate: new Date().toLocaleDateString('en-IN')
            };

            await NotificationService.sendEnrollmentNotificationToAdmin(enrollmentNotificationData);
            console.log('Admin notification sent via webhook');
          }
        } catch (error) {
          console.error('Error sending admin notification via webhook:', error);
        }
      }
    }
  } catch (error) {
    console.error('Error handling Razorpay payment success:', error);
  }
};

export const handleRazorpayPaymentFailed = async (webhookBody: any): Promise<void> => {
  try {
    const { event, payload } = webhookBody;

    if (event === 'payment.failed') {
      const paymentEntity = payload.payment?.entity;
      const orderEntity = payload.order?.entity;

      if (!paymentEntity || !orderEntity) {
        console.error('❌ Invalid webhook payload structure');
        return;
      }

      const razorpayPaymentId = paymentEntity.id;
      const razorpayOrderId = orderEntity.id;

      console.log('❌ Razorpay Webhook - Payment failed:', {
        paymentId: razorpayPaymentId,
        orderId: razorpayOrderId,
        errorReason: paymentEntity.error_reason,
        timestamp: new Date().toISOString()
      });

      // Update payment status to failed
      const payment = await Payment.findOne({
        razorpayOrderId: razorpayOrderId
      });

      if (payment) {
        payment.status = 'failed';
        payment.failureReason = paymentEntity.error_reason || 'Payment failed';
        await payment.save();
      }
    }
  } catch (error) {
    console.error('Error handling Razorpay payment failure:', error);
  }
};

// Verify Razorpay payment
export const verifyRazorpayPayment = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;

    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        error: 'Missing required payment verification fields'
      });
    }

    // Find payment record
    const payment = await Payment.findOne({ razorpayOrderId: razorpay_order_id });

    if (!payment) {
      return res.status(404).json({
        success: false,
        error: 'Payment record not found'
      });
    }

    // Verify payment signature
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '')
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      console.error('❌ Invalid payment signature');
      payment.status = 'failed';
      payment.failureReason = 'Invalid payment signature';
      await payment.save();

      return res.status(400).json({
        success: false,
        error: 'Invalid payment signature'
      });
    }

    // Fetch payment details from Razorpay
    const paymentDetails = await razorpay.payments.fetch(razorpay_payment_id);

    if (paymentDetails.status !== 'captured') {
      payment.status = 'failed';
      payment.failureReason = `Payment status: ${paymentDetails.status}`;
      await payment.save();

      return res.status(400).json({
        success: false,
        error: `Payment not captured. Status: ${paymentDetails.status}`
      });
    }

    // Update payment record
    payment.status = 'completed';
    payment.razorpayPaymentId = razorpay_payment_id;
    payment.razorpaySignature = razorpay_signature;
    payment.transactionId = razorpay_payment_id;
    payment.paymentDate = new Date();
    await payment.save();

    // Update student enrollment status
    await Student.findByIdAndUpdate(payment.studentId, {
      enrollmentStatus: 'confirmed',
      paymentStatus: 'completed',
      enrollmentDate: new Date()
    });

    // Send welcome notifications to student after successful payment
    try {
      const student = await Student.findById(payment.studentId);
      if (student) {
        // Send welcome notifications to student
        const welcomeData = {
          studentName: `${student.firstName} ${student.lastName}`,
          courseName: payment.metadata?.courseType || 'Unknown',
          courseLevel: payment.metadata?.courseLevel || 'Unknown',
          startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }),
          contactNumber: student.phone,
          email: student.email,
          totalAmount: payment.amount
        };

        // Send welcome notifications asynchronously (don't block payment response)
        setImmediate(async () => {
          try {
            await NotificationService.sendWelcomeNotifications(welcomeData);
            console.log('✅ Welcome notifications sent successfully for:', student.email);
          } catch (error) {
            console.error('❌ Failed to send welcome notifications:', error);
          }
        });

        // Send admin notification about new enrollment
        const enrollmentNotificationData: EnrollmentNotificationData = {
          studentName: `${student.firstName} ${student.lastName}`,
          studentAge: student.dateOfBirth ? new Date().getFullYear() - student.dateOfBirth.getFullYear() : 0,
          contactNumber: student.phone,
          email: student.email,
          location: `${student.city}, ${student.state}`,
          courseType: payment.metadata?.courseType || 'Unknown',
          courseLevel: payment.metadata?.courseLevel || 'Unknown',
          preferredLanguage: 'Tamil',
          totalAmount: payment.amount,
          enrollmentId: payment.enrollmentId,
          paymentMethod: 'Razorpay',
          enrollmentDate: new Date().toLocaleDateString('en-IN')
        };

        setImmediate(async () => {
          try {
            await NotificationService.sendEnrollmentNotificationToAdmin(enrollmentNotificationData);
            console.log('✅ Admin enrollment notification sent successfully');
          } catch (error) {
            console.error('❌ Failed to send admin enrollment notification:', error);
          }
        });
      }
    } catch (error) {
      console.error('❌ Error preparing notifications:', error);
    }

    return res.json({
      success: true,
      data: {
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
        status: 'completed',
        amount: Number(paymentDetails.amount) / 100,
        currency: paymentDetails.currency
      }
    });

  } catch (error) {
    console.error('Error verifying Razorpay payment:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to verify Razorpay payment'
    });
  }
};

// Get payment status
export const getPaymentStatus = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { paymentId } = req.params;

    if (!paymentId) {
      return res.status(400).json({
        success: false,
        error: 'Payment ID is required'
      });
    }

    const payment = await Payment.findOne({
      $or: [
        { razorpayPaymentId: paymentId },
        { razorpayOrderId: paymentId },
        { _id: paymentId }
      ]
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        error: 'Payment not found'
      });
    }

    return res.json({
      success: true,
      data: {
        paymentId: payment._id,
        status: payment.status,
        amount: payment.amount,
        currency: payment.currency,
        paymentDate: payment.paymentDate,
        transactionId: payment.transactionId
      }
    });

  } catch (error) {
    console.error('Error fetching payment status:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch payment status'
    });
  }
};

// Process enrollment with payment
export const processEnrollmentWithPayment = async (req: Request, res: Response): Promise<Response> => {
  try {
    // Check database connection and wait if necessary
    if (Number(mongoose.connection.readyState) !== 1) {
      console.log('Database not ready, current state:', mongoose.connection.readyState);
      console.log('Waiting for database connection...');

      // Wait for database connection (up to 10 seconds)
      let retries = 0;
      while (Number(mongoose.connection.readyState) !== 1 && retries < 20) {
        await new Promise(resolve => setTimeout(resolve, 500));
        retries++;
      }

      if (Number(mongoose.connection.readyState) !== 1) {
        console.error('❌ Database connection not available after', retries * 500, 'ms');
        return res.status(500).json({
          success: false,
          error: 'Database connection not available. Please try again later.'
        });
      }

      console.log('Database connection established after', retries * 500, 'ms');
    }

    // Check if required environment variables are configured
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      console.error('Razorpay credentials not configured');
      return res.status(500).json({
        success: false,
        error: 'Payment system not properly configured. Please contact administrator.'
      });
    }

    if (!process.env.FRONTEND_URL) {
      console.error('Frontend URL not configured');
      return res.status(500).json({
        success: false,
        error: 'Frontend URL not configured. Please contact administrator.'
      });
    }

    const {
      studentName,
      studentAge,
      contactNumber,
      email,
      location,
      courseType,
      courseLevel,
      preferredLanguage,
      selectedCourse
    } = req.body;

    // Validate required fields with detailed logging
    const requiredFields = ['studentName', 'studentAge', 'contactNumber', 'email', 'location', 'courseType', 'courseLevel', 'selectedCourse'];
    const missingFields = requiredFields.filter(field => {
      const value = req.body[field];
      const isMissing = value === undefined || value === null || value === '';
      if (isMissing) {
        console.error(`Missing or empty field: ${field}, value: ${value}, type: ${typeof value}`);
      }
      return isMissing;
    });

    if (missingFields.length > 0) {
      console.error('Missing required fields in enrollment request:', {
        missingFields,
        requestBody: req.body,
        bodyKeys: Object.keys(req.body)
      });
      return res.status(400).json({
        success: false,
        error: `Missing required fields: ${missingFields.join(', ')}`
      });
    }

    // Additional validation for selectedCourse structure
    if (req.body.selectedCourse && typeof req.body.selectedCourse === 'object') {
      if (!req.body.selectedCourse.price) {
        console.error('selectedCourse missing price field:', req.body.selectedCourse);
        return res.status(400).json({
          success: false,
          error: 'Course price information is missing'
        });
      }

      if (typeof req.body.selectedCourse.price !== 'number' || req.body.selectedCourse.price <= 0) {
        console.error('Invalid course price:', req.body.selectedCourse.price);
        return res.status(400).json({
          success: false,
          error: 'Course price must be a valid positive number'
        });
      }
    }

    // Additional validation for specific fields
    if (typeof req.body.studentAge !== 'number' || req.body.studentAge < 5) {
      console.error('Invalid student age:', {
        age: req.body.studentAge,
        type: typeof req.body.studentAge,
        timestamp: new Date().toISOString()
      });
      return res.status(400).json({
        success: false,
        error: 'Student age must be a number and at least 5 years'
      });
    }

    if (!req.body.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(req.body.email)) {
      return res.status(400).json({
        success: false,
        error: 'Valid email address is required'
      });
    }

    // Generate unique enrollment ID
    const enrollmentId = `ENR-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;

    // Map preferredLanguage to match Course model enum values
    const languageMap: { [key: string]: string } = {
      'tamil': 'Tamil',
      'telugu': 'Telugu',
      'kannada': 'Kannada',
      'english': 'English'
    };
    const mappedLanguage = languageMap[preferredLanguage.toLowerCase()] || 'Tamil';

    // Find or create course
    console.log('🔍 Finding or creating course:', {
      title: `${courseType} - ${courseLevel}`,
      price: selectedCourse.price,
      preferredLanguage,
      mappedLanguage,
      timestamp: new Date().toISOString()
    });

    let course;
    try {
      course = await Course.findOne({
        title: `${courseType} - ${courseLevel}`,
        price: selectedCourse.price
      });
    } catch (error) {
      console.error('Error finding course:', error);
      return res.status(500).json({
        success: false,
        error: 'Database error while finding course'
      });
    }

    if (!course) {
      console.log('📚 Creating new course record');
      course = new Course({
        title: `${courseType} - ${courseLevel}`,
        description: `Carnatic Music Course - ${courseType} - ${courseLevel}`,
        classesPerMonth: 8,
        studentsPerBatch: 20,
        price: selectedCourse.price,
        language: mappedLanguage,
        level: courseLevel.includes('Basic') ? 'Beginner' : courseLevel.includes('Intermediate') ? 'Intermediate' : 'Advanced',
        isActive: true,
        schedule: 'Flexible',
        syllabus: [
          { title: 'Basic Music Theory', topics: ['Introduction to Carnatic Music', 'Basic Concepts'] },
          { title: 'Carnatic Music Fundamentals', topics: ['Ragams', 'Talams', 'Swara Patterns'] },
          { title: 'Practice Sessions', topics: ['Voice Training', 'Rhythm Practice'] }
        ]
      });
      try {
        await course.save();
        console.log('✅ Course created successfully:', course._id);
      } catch (error) {
        console.error('Error creating course:', error);
        return res.status(500).json({
          success: false,
          error: 'Failed to create course record'
        });
      }
    } else {
      console.log('✅ Existing course found:', course._id);
    }

    // Check if student already exists first
    console.log('🔍 Checking for existing student with email:', email);

    let studentRecord = await Student.findOne({ email: email });

    if (studentRecord) {
      console.log('✅ Found existing student:', studentRecord._id);

      // Update existing student with new enrollment information
      studentRecord.enrolledCourses = studentRecord.enrolledCourses || [];
      const enrolledCourseIds = studentRecord.enrolledCourses.map((id: mongoose.Types.ObjectId) => id?.toString() || '');
      const courseIdString = course._id?.toString() || '';
      if (!enrolledCourseIds.includes(courseIdString)) {
        studentRecord.enrolledCourses.push(course._id as mongoose.Types.ObjectId);
      }
      studentRecord.enrollmentStatus = 'pending';
      studentRecord.paymentStatus = 'pending';
      studentRecord.joiningDate = new Date();

      await studentRecord.save();
      console.log('✅ Updated existing student record');
    } else {
      console.log('👤 Creating new student record');

      // Create student record
      const nameParts = studentName.trim().split(' ');
      const firstName = nameParts[0] || studentName;
      const lastName = nameParts.slice(1).join(' ') || 'Unknown';

      console.log('👤 Creating student record:', {
        firstName,
        lastName,
        email,
        phone: contactNumber,
        age: studentAge,
        location,
        timestamp: new Date().toISOString()
      });

      const student = new Student({
        firstName,
        lastName,
        email,
        phone: contactNumber,
        dateOfBirth: new Date(new Date().getFullYear() - studentAge, 0, 1),
        gender: 'Other', // Valid enum value: 'Male' | 'Female' | 'Other'
        address: location,
        city: location.split(',')[0]?.trim() || location,
        state: 'Tamil Nadu', // Changed from 'Not specified' to valid state
        postalCode: '600001', // Changed from 'Not specified' to valid postal code
        country: 'India',
        parentName: studentName,
        parentPhone: contactNumber,
        parentEmail: email,
        joiningDate: new Date(),
        enrolledCourses: [course._id],
        enrollmentStatus: 'pending',
        paymentStatus: 'pending'
      });

      try {
        studentRecord = await student.save();
        console.log('✅ Student created successfully:', studentRecord._id);
      } catch (error) {
        console.error('Error creating student:', error);

        // Handle duplicate email error (shouldn't happen now, but just in case)
        if ((error as { name?: string; code?: number }).name === 'MongoServerError' && (error as { name?: string; code?: number }).code === 11000) {
          console.log('📧 Student with this email already exists, finding existing record...');

          // Try to find existing student with same email
          const existingStudent = await Student.findOne({ email: email });
          if (existingStudent) {
            console.log('✅ Found existing student after duplicate error:', existingStudent._id);
            studentRecord = existingStudent;
          } else {
            console.error('❌ Could not find existing student with email:', email);
            return res.status(500).json({
              success: false,
              error: 'Failed to create or find student record'
            });
          }
        } else {
          return res.status(500).json({
            success: false,
            error: 'Failed to create student record'
          });
        }
      }
    }

    // Calculate total amount (course fee + registration fee) in INR
    const totalAmountINR = (selectedCourse.price || 0) + 250;
    const totalAmount = totalAmountINR; // Keep in INR for Razorpay

    // Note: Welcome notifications will be sent only after successful payment capture
    console.log('📧 Welcome notifications will be sent after successful payment');

    console.log('📤 Sending enrollment response:', {
      enrollmentId,
      studentId: studentRecord._id,
      courseId: course._id,
      amount: totalAmount,
      currency: 'INR'
    });

    return res.json({
      success: true,
      data: {
        enrollmentId,
        studentId: studentRecord._id,
        courseId: course._id,
        amount: totalAmount,
        currency: 'INR',
        originalAmountINR: totalAmountINR,
        nextSteps: [
          'Complete payment using Razorpay (INR currency)',
          'Receive confirmation email and WhatsApp notification',
          'Get access to course materials',
          'Schedule first class with teacher'
        ]
      }
    });

  } catch (error) {
    console.error('Error processing enrollment:', {
      error: error instanceof Error ? error.message : error,
      stack: error instanceof Error ? error.stack : 'No stack trace',
      requestBody: req.body,
      timestamp: new Date().toISOString()
    });

    // Check for specific error types and provide better error messages
    let errorMessage = 'Failed to process enrollment';
    if (error instanceof Error) {
      if (error.message.includes('MongoServerError') || error.message.includes('MongooseError')) {
        errorMessage = 'Database error occurred. Please try again.';
      } else if (error.message.includes('ValidationError')) {
        errorMessage = 'Invalid data provided. Please check your information.';
      } else {
        errorMessage = error.message;
      }
    }

    return res.status(500).json({
      success: false,
      error: errorMessage
    });
  }
};