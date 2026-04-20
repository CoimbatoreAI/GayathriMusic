import express, { RequestHandler } from 'express';
import { isAdmin } from '../middleware/auth.middleware';
import * as faqController from '../controllers/faq.controller';
import * as testimonialController from '../controllers/testimonial.controller';
import * as homeContentController from '../controllers/homeContent.controller';
import * as admissionController from '../controllers/admission.controller';
import * as courseController from '../controllers/course.controller';
import * as feeStructureController from '../controllers/feeStructure.controller';
import {
  validateFAQ,
  validateTestimonial,
  validateHomeContent,
  validateAdmissionSettings,
  validateCourse,
  validateFeeStructure,
  validate
} from '../middleware/validators';

// Helper function to convert ValidationChain arrays to RequestHandler arrays
const validationMiddleware = (validations: any[]): RequestHandler[] => {
  return validations.map(validation => validation as RequestHandler);
};

const router = express.Router();

// FAQ Routes
router.get('/faqs', isAdmin, faqController.getAdminFAQs);
// Temporarily disable validation to test
router.post('/faqs', isAdmin, faqController.createFAQ);
router.put('/faqs/:id', isAdmin, faqController.updateFAQ);
router.patch('/faqs/:id/toggle', isAdmin, faqController.toggleFAQStatus);
router.delete('/faqs/:id', isAdmin, faqController.deleteFAQ);

// Testimonial Routes
router.get('/testimonials', isAdmin, testimonialController.getAdminTestimonials);
// Temporarily disable validation to test
router.post('/testimonials', isAdmin, testimonialController.createAdminTestimonial);
router.put('/testimonials/:id', isAdmin, testimonialController.updateTestimonial);
router.patch('/testimonials/:id/approve', isAdmin, testimonialController.approveTestimonial);
router.delete('/testimonials/:id', isAdmin, testimonialController.deleteTestimonial);

// Home Content Routes
router.get('/home-content', isAdmin, homeContentController.getAdminHomeContent);
router.post('/home-content', isAdmin, [...validationMiddleware(validateHomeContent), validate], homeContentController.updateHomeContent);
router.patch('/home-content/:section/toggle', isAdmin, homeContentController.toggleSectionStatus);
router.post('/home-content/reorder', isAdmin, homeContentController.reorderSections);

// Admission Settings Routes
router.get('/admission/settings', isAdmin, admissionController.getAdmissionStatus);
router.put('/admission/settings', isAdmin, [...validationMiddleware(validateAdmissionSettings), validate], admissionController.updateAdmissionSettings);
router.post('/admission/reset-enrollments', isAdmin, admissionController.resetEnrollments);

// Course Routes
router.get('/courses', isAdmin, courseController.getAdminCourses);
router.post('/courses', isAdmin, [...validationMiddleware(validateCourse), validate], courseController.createCourse);
router.put('/courses/:id', isAdmin, [...validationMiddleware(validateCourse), validate], courseController.updateCourse);
router.patch('/courses/:id/toggle', isAdmin, courseController.toggleCourseStatus);
router.delete('/courses/:id', isAdmin, courseController.deleteCourse);

// Fee Structure Routes
router.get('/fee-structures', isAdmin, feeStructureController.getAdminFeeStructures);
router.get('/fee-structures/:id', isAdmin, feeStructureController.getFeeStructureById);
router.post('/fee-structures', isAdmin, [...validationMiddleware(validateFeeStructure), validate], feeStructureController.createFeeStructure);
router.put('/fee-structures/:id', isAdmin, [...validationMiddleware(validateFeeStructure), validate], feeStructureController.updateFeeStructure);
router.patch('/fee-structures/:id/toggle', isAdmin, feeStructureController.toggleFeeStructureStatus);
router.delete('/fee-structures/:id', isAdmin, feeStructureController.deleteFeeStructure);

export default router;
