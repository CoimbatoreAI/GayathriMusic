import { Request, Response } from 'express';
import Course from '../models/course.model';

// Get all courses (admin view)
export const getAdminCourses = async (req: Request, res: Response): Promise<void> => {
  try {
    const courses = await Course.find().sort({ title: 1 });
    res.json({
      success: true,
      data: courses
    });
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch courses'
    });
  }
};

// Get active courses (public view)
export const getActiveCourses = async (req: Request, res: Response): Promise<void> => {
  try {
    const courses = await Course.find({ isActive: true }).sort({ title: 1 });
    res.json({
      success: true,
      data: courses
    });
  } catch (error) {
    console.error('Error fetching active courses:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch active courses'
    });
  }
};

// Get course by ID
export const getCourseById = async (req: Request, res: Response): Promise<void> => {
  try {
    const courseId = req.params.id;

    const course = await Course.findById(courseId);
    if (!course) {
      res.status(404).json({
        success: false,
        error: 'Course not found'
      });
      return;
    }

    res.json({
      success: true,
      data: course
    });
  } catch (error) {
    console.error('Error fetching course:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch course'
    });
  }
};

// Create new course
export const createCourse = async (req: Request, res: Response): Promise<void> => {
  try {
    const courseData = req.body;

    // Set default values
    courseData.category = courseData.category || 'instrumental';
    courseData.isActive = courseData.isActive !== undefined ? courseData.isActive : true;
    courseData.isFeatured = courseData.isFeatured !== undefined ? courseData.isFeatured : false;
    courseData.enrolledStudents = courseData.enrolledStudents || 0;
    courseData.isEnrollmentOpen = courseData.isEnrollmentOpen !== undefined ? courseData.isEnrollmentOpen : true;
    courseData.batchType = courseData.batchType || 'weekday';
    courseData.certificateIncluded = courseData.certificateIncluded !== undefined ? courseData.certificateIncluded : true;

    const course = new Course(courseData);
    const savedCourse = await course.save();
    res.status(201).json({
      success: true,
      data: savedCourse
    });
  } catch (error) {
    console.error('Error creating course:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create course'
    });
  }
};

// Update course
export const updateCourse = async (req: Request, res: Response): Promise<void> => {
  try {
    const courseId = req.params.id;
    const courseData = req.body;

    const course = await Course.findByIdAndUpdate(
      courseId,
      { ...courseData, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!course) {
      res.status(404).json({
        success: false,
        error: 'Course not found'
      });
      return;
    }

    res.json({
      success: true,
      data: course
    });
  } catch (error) {
    console.error('Error updating course:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update course'
    });
  }
};

// Toggle course status (enable/disable)
export const toggleCourseStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const courseId = req.params.id;

    const course = await Course.findByIdAndUpdate(
      courseId,
      { $set: { isActive: { $not: '$isActive' }, updatedAt: new Date() } },
      { new: true }
    );

    if (!course) {
      res.status(404).json({
        success: false,
        error: 'Course not found'
      });
      return;
    }

    res.json({
      success: true,
      data: course
    });
  } catch (error) {
    console.error('Error toggling course status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to toggle course status'
    });
  }
};

// Delete course
export const deleteCourse = async (req: Request, res: Response): Promise<void> => {
  try {
    const courseId = req.params.id;

    const course = await Course.findByIdAndDelete(courseId);
    if (!course) {
      res.status(404).json({
        success: false,
        error: 'Course not found'
      });
      return;
    }

    res.json({
      success: true,
      message: 'Course deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting course:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete course'
    });
  }
};