import express from 'express';
import * as courseController from '../controllers/course.controller';

const router = express.Router();

// Get active courses (public view)
router.get('/active', courseController.getActiveCourses);

// Get course by ID (public view)
router.get('/:id', courseController.getCourseById);

// Get all courses (public/admin list) - added to prevent 404 when requesting /api/courses
router.get('/', courseController.getAdminCourses);

export default router;