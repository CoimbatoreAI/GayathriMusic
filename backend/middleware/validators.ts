import { body, ValidationChain, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: {
        id: string;
        username: string;
        role: 'admin' | 'student' | 'super_admin';
        [key: string]: unknown;
      };
    }
  }
}

export const validateFAQ: ValidationChain[] = [
  body('question').trim().notEmpty().withMessage('Question is required'),
  body('answer').trim().notEmpty().withMessage('Answer is required'),
  body('category').optional().isIn(['general', 'admission', 'fees', 'courses', 'other']).withMessage('Invalid category'),
  body('isActive').optional().isBoolean().withMessage('isActive must be a boolean')
];

export const validateTestimonial: ValidationChain[] = [
  body('studentName').trim().notEmpty().withMessage('Student name is required'),
  body('role').trim().notEmpty().withMessage('Role is required'),
  body('language').isIn(['Tamil', 'Telugu', 'Kannada', 'English']).withMessage('Valid language is required'),
  body('type').trim().notEmpty().withMessage('Class type is required'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('review').trim().notEmpty().withMessage('Review is required'),
  body('isApproved').optional().isBoolean().withMessage('isApproved must be a boolean'),
  body('featured').optional().isBoolean().withMessage('featured must be a boolean')
];

export const validateHomeContent: ValidationChain[] = [
  body('section').trim().notEmpty().withMessage('Section is required'),
  body('title').optional().trim().notEmpty().withMessage('Title cannot be empty if provided'),
  body('content').optional().trim(),
  body('isActive').optional().isBoolean().withMessage('isActive must be a boolean'),
  body('order').optional().isInt().withMessage('Order must be an integer')
];

export const validateAdmissionSettings: ValidationChain[] = [
  body('isAdmissionOpen').optional().isBoolean().withMessage('isAdmissionOpen must be a boolean'),
  body('admissionStartDate').optional().isISO8601().withMessage('Invalid start date format'),
  body('admissionEndDate').optional().isISO8601().withMessage('Invalid end date format'),
  body('maxEnrollments').optional().isInt({ min: 1 }).withMessage('Max enrollments must be at least 1'),
  body('announcement').optional().trim(),
  body('isAnnouncementActive').optional().isBoolean().withMessage('isAnnouncementActive must be a boolean')
];

export const validateCourse: ValidationChain[] = [
  body('title').trim().notEmpty().withMessage('Title is required').isLength({ max: 255 }).withMessage('Title must be less than 255 characters'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('classesPerMonth').isInt({ min: 1 }).withMessage('Classes per month must be at least 1'),
  body('studentsPerBatch').isInt({ min: 1 }).withMessage('Students per batch must be at least 1'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('language').isIn(['Tamil', 'Telugu', 'Kannada', 'English']).withMessage('Valid language is required'),
  body('level').isIn(['Beginner', 'Intermediate', 'Advanced']).withMessage('Valid level is required'),
  body('maxStudents').isInt({ min: 1 }).withMessage('Max students must be at least 1'),
  body('schedule').trim().notEmpty().withMessage('Schedule is required').isLength({ max: 255 }).withMessage('Schedule must be less than 255 characters'),
  body('syllabus').isArray({ min: 1 }).withMessage('Syllabus must be a non-empty array'),
  body('syllabus.*.title').trim().notEmpty().withMessage('Syllabus item title is required'),
  body('syllabus.*.topics').isArray({ min: 1 }).withMessage('Syllabus item must have at least one topic'),
  body('syllabus.*.topics.*').trim().notEmpty().withMessage('Topic cannot be empty'),
  body('category').optional().isIn(['vocal', 'instrumental', 'theory', 'other']).withMessage('Invalid category'),
  body('isActive').optional().isBoolean().withMessage('isActive must be a boolean'),
  body('isFeatured').optional().isBoolean().withMessage('isFeatured must be a boolean'),
  body('enrolledStudents').optional().isInt({ min: 0 }).withMessage('Enrolled students must be a non-negative number'),
  body('isEnrollmentOpen').optional().isBoolean().withMessage('isEnrollmentOpen must be a boolean'),
  body('batchType').optional().isIn(['weekday', 'weekend', 'both']).withMessage('Invalid batch type'),
  body('certificateIncluded').optional().isBoolean().withMessage('certificateIncluded must be a boolean')
];

export const validateFeeStructure: ValidationChain[] = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 255 }).withMessage('Name must be less than 255 characters'),
  body('description').optional().trim().isLength({ max: 500 }).withMessage('Description must be less than 500 characters'),
  body('courseType').isIn(['vocal', 'instrumental', 'theory', 'other']).withMessage('Valid course type is required'),
  body('courseLevel').isIn(['Beginner', 'Intermediate', 'Advanced']).withMessage('Valid course level is required'),
  body('language').isIn(['Tamil', 'Telugu', 'Kannada', 'English']).withMessage('Valid language is required'),
  body('basePrice').isFloat({ min: 0 }).withMessage('Base price must be a non-negative number'),
  body('registrationFee').isFloat({ min: 0 }).withMessage('Registration fee must be a non-negative number'),
  body('discountAmount').optional().isFloat({ min: 0 }).withMessage('Discount amount must be a non-negative number'),
  body('discountPercentage').optional().isFloat({ min: 0, max: 100 }).withMessage('Discount percentage must be between 0 and 100'),
  body('validFrom').isISO8601().withMessage('Valid from date must be a valid date'),
  body('validUntil').optional().isISO8601().withMessage('Valid until date must be a valid date'),
  body('isActive').optional().isBoolean().withMessage('isActive must be a boolean')
];

// Express-validator error handler
export const validate = (req: Request, res: Response, next: NextFunction): Response | void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('❌ Validation errors:', errors.array());
    return res.status(400).json({ errors: errors.array() });
  }
  return next();
};


// Check if user is admin (duplicate - using auth middleware version)

// Check if user is super admin
export const isSuperAdmin = (req: Request, res: Response, next: NextFunction): Response | void => {
  if (req.user && req.user.role === 'super_admin') {
    return next();
  }
  return res.status(403).json({ message: 'Access denied. Super admin privileges required.' });
};
