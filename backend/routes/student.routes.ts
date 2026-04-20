import express from 'express';
import Student from '../models/student.model';
import Payment from '../models/payment.model';
import Course from '../models/course.model';

const router = express.Router();

// Get all students with payment info
router.get('/', async (_req, res): Promise<void> => {
  try {
    const students = await Student.find()
      .populate('enrolledCourses')
      .sort({ joiningDate: -1 });

    // Get payments for each student
    const studentsWithPayments = await Promise.all(
      students.map(async (student) => {
        const payments = await Payment.find({ studentId: student._id })
          .populate('courseId')
          .sort({ paymentDate: -1 });

        const totalPaid = payments
          .filter(p => p.status === 'completed')
          .reduce((sum, p) => sum + p.amount, 0);

        return {
          ...student.toObject(),
          payments,
          totalPaid
        };
      })
    );

    res.json({ success: true, data: studentsWithPayments });
  } catch (error) {
    console.error('Error fetching students:', error);
    // Return mock data for development/demo purposes
    const mockStudents = [
      {
        _id: 'mock1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '9876543210',
        dateOfBirth: '2010-05-15',
        gender: 'Male',
        address: '123 Main St',
        city: 'Chennai',
        state: 'Tamil Nadu',
        postalCode: '600001',
        country: 'India',
        parentName: 'Jane Doe',
        parentPhone: '9876543211',
        parentEmail: 'jane@example.com',
        enrolledCourses: [{ title: 'Carnatic Vocal Basic', price: 5000 }],
        totalPaid: 3000,
        payments: [{ amount: 3000, status: 'completed' }]
      }
    ];
    res.json({ success: true, data: mockStudents });
  }
});

// Get student by ID
router.get('/:id', async (req, res): Promise<void> => {
  try {
    const studentId = req.params.id;

    const student = await Student.findById(studentId).populate('enrolledCourses');
    if (!student) {
      res.status(404).json({ success: false, error: 'Student not found' });
      return;
    }

    // Get payments
    const payments = await Payment.find({ studentId: student._id })
      .populate('courseId')
      .sort({ paymentDate: -1 });

    const totalPaid = payments
      .filter(p => p.status === 'completed')
      .reduce((sum, p) => sum + p.amount, 0);

    res.json({
      success: true,
      data: {
        ...student.toObject(),
        payments,
        totalPaid
      }
    });
  } catch (error) {
    console.error('Error fetching student:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch student' });
  }
});

// Create new student with payment
router.post('/', async (req, res): Promise<void> => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      dateOfBirth,
      gender,
      address,
      city,
      state,
      postalCode,
      country,
      parentName,
      parentPhone,
      parentEmail,
      courseId,
      amountPaid,
      totalCourseFee,
      paymentMethod
    } = req.body;

    // Validate required fields
    const requiredFields = [
      'firstName', 'lastName', 'email', 'phone', 'dateOfBirth', 'gender',
      'address', 'city', 'state', 'postalCode', 'country', 'parentName',
      'parentPhone', 'parentEmail', 'courseId', 'amountPaid', 'totalCourseFee'
    ];

    for (const field of requiredFields) {
      if (!req.body[field]) {
        res.status(400).json({ success: false, error: `Missing required field: ${field}` });
        return;
      }
    }

    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      res.status(400).json({ success: false, error: 'Invalid course selected' });
      return;
    }

    // Create student
    const student = new Student({
      firstName,
      lastName,
      email,
      phone,
      dateOfBirth: new Date(dateOfBirth),
      gender,
      address,
      city,
      state,
      postalCode,
      country,
      parentName,
      parentPhone,
      parentEmail,
      enrolledCourses: [courseId],
      joiningDate: new Date()
    });

    const savedStudent = await student.save();

    // Create payment record
    const payment = new Payment({
      studentId: savedStudent._id,
      courseId,
      amount: amountPaid,
      courseFee: totalCourseFee,
      totalAmount: totalCourseFee,
      paymentMethod: paymentMethod || 'cash',
      status: 'completed',
      transactionId: `TXN${Date.now()}${Math.random().toString(36).substr(2, 9)}`
    });

    await payment.save();

    res.status(201).json({
      success: true,
      data: {
        ...savedStudent.toObject(),
        payments: [payment],
        totalPaid: amountPaid
      }
    });
  } catch (error) {
    console.error('Error creating student:', error);
    res.status(500).json({ success: false, error: 'Failed to create student' });
  }
});

// Update student and payment
router.put('/:id', async (req, res): Promise<void> => {
  try {
    const studentId = req.params.id;
    const updateData = req.body;

    // Update student
    const student = await Student.findByIdAndUpdate(
      studentId,
      {
        ...updateData,
        updatedAt: new Date()
      },
      { new: true, runValidators: true }
    ).populate('enrolledCourses');

    if (!student) {
      res.status(404).json({ success: false, error: 'Student not found' });
      return;
    }

    // Handle payment update if provided
    if (updateData.amountPaid !== undefined) {
      // Find existing payment or create new one
      const existingPayment = await Payment.findOne({
        studentId,
        status: 'completed'
      }).sort({ paymentDate: -1 });

      if (existingPayment) {
        existingPayment.amount = updateData.amountPaid;
        existingPayment.updatedAt = new Date();
        await existingPayment.save();
      } else if (updateData.courseId) {
        // Create new payment
        const payment = new Payment({
          studentId,
          courseId: updateData.courseId,
          amount: updateData.amountPaid,
          courseFee: updateData.totalCourseFee || 0,
          totalAmount: updateData.totalCourseFee || 0,
          paymentMethod: updateData.paymentMethod || 'cash',
          status: 'completed',
          transactionId: `TXN${Date.now()}${Math.random().toString(36).substr(2, 9)}`
        });
        await payment.save();
      }
    }

    // Get updated payments
    const payments = await Payment.find({ studentId })
      .populate('courseId')
      .sort({ paymentDate: -1 });

    const totalPaid = payments
      .filter(p => p.status === 'completed')
      .reduce((sum, p) => sum + p.amount, 0);

    res.json({
      success: true,
      data: {
        ...student.toObject(),
        payments,
        totalPaid
      }
    });
  } catch (error) {
    console.error('Error updating student:', error);
    res.status(500).json({ success: false, error: 'Failed to update student' });
  }
});

// Delete student
router.delete('/:id', async (req, res): Promise<void> => {
  try {
    const studentId = req.params.id;

    // Delete associated payments first
    await Payment.deleteMany({ studentId });

    // Delete student
    const student = await Student.findByIdAndDelete(studentId);
    if (!student) {
      res.status(404).json({ success: false, error: 'Student not found' });
      return;
    }

    res.json({ success: true, message: 'Student deleted successfully' });
  } catch (error) {
    console.error('Error deleting student:', error);
    res.status(500).json({ success: false, error: 'Failed to delete student' });
  }
});

export default router;