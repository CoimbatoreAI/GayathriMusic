import { Request, Response } from 'express';
import Testimonial from '../models/testimonial.model';
import { validationResult } from 'express-validator';

// @desc    Get all approved testimonials
// @route   GET /api/testimonials
// @access  Public
export const getTestimonials = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { featured, limit } = req.query;
    const query: { isApproved: boolean; featured?: boolean } = { isApproved: true };
    
    if (featured === 'true') {
      query.featured = true;
    }
    
    let queryBuilder = Testimonial.find(query)
      .sort({ featured: -1, createdAt: -1 });
    
    if (limit && !isNaN(Number(limit))) {
      queryBuilder = queryBuilder.limit(Number(limit));
    }
    
    const testimonials = await queryBuilder.exec();
    return res.json(testimonials);
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    return res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get all testimonials (Admin)
// @route   GET /api/admin/testimonials
// @access  Private/Admin
export const getAdminTestimonials = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { status } = req.query;
    const query: { isApproved?: boolean; featured?: boolean } = {};

    if (status === 'pending') {
      query.isApproved = false;
    } else if (status === 'approved') {
      query.isApproved = true;
    } else if (status === 'featured') {
      query.featured = true;
    } else if (status === 'all') {
      // No filter
    } else {
      // Default to approved
      query.isApproved = true;
    }

    const testimonials = await Testimonial.find(query)
      .sort({ isApproved: 1, featured: -1, createdAt: -1 });

    return res.json({
      success: true,
      data: testimonials
    });
  } catch (error) {
    console.error('Error fetching admin testimonials:', error);
    return res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Create a new testimonial
// @route   POST /api/testimonials
// @access  Public
export const createTestimonial = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { studentName, role, language, type, rating, review } = req.body;

    const newTestimonial = new Testimonial({
      studentName,
      role,
      language,
      type,
      rating,
      review,
      isApproved: false, // Needs admin approval
      featured: false
    });

    const savedTestimonial = await newTestimonial.save();

    return res.status(201).json({
      success: true,
      data: savedTestimonial
    });
  } catch (error) {
    console.error('Error creating testimonial:', error);
    return res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update testimonial status
// @route   PATCH /api/admin/testimonials/:id/approve
// @access  Private/Admin
export const approveTestimonial = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { isApproved, featured } = req.body;
    
    const testimonial = await Testimonial.findById(req.params.id);
    
    if (!testimonial) {
      return res.status(404).json({ message: 'Testimonial not found' });
    }
    
    if (isApproved !== undefined) {
      testimonial.isApproved = isApproved;
    }
    
    if (featured !== undefined) {
      // If setting as featured, unfeature others
      if (featured === true) {
        await Testimonial.updateMany(
          { _id: { $ne: testimonial._id } },
          { $set: { featured: false } }
        );
      }
      testimonial.featured = featured;
    }
    
    testimonial.updatedAt = new Date();
    await testimonial.save();

    return res.json({
      success: true,
      data: testimonial
    });
  } catch (error) {
    console.error('Error updating testimonial:', error);
    return res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Create a new testimonial (Admin)
// @route   POST /api/admin/testimonials
// @access  Private/Admin
export const createAdminTestimonial = async (req: Request, res: Response): Promise<Response> => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { studentName, role, language, type, rating, review, isApproved, featured } = req.body;

    const newTestimonial = new Testimonial({
      studentName,
      role,
      language,
      type,
      rating,
      review,
      isApproved: isApproved !== undefined ? isApproved : false,
      featured: featured !== undefined ? featured : false
    });

    const savedTestimonial = await newTestimonial.save();

    return res.status(201).json({
      success: true,
      data: savedTestimonial
    });
  } catch (error) {
    console.error('Error creating testimonial:', error);
    return res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update a testimonial (Admin)
// @route   PUT /api/admin/testimonials/:id
// @access  Private/Admin
export const updateTestimonial = async (req: Request, res: Response): Promise<Response> => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { studentName, role, language, type, rating, review, isApproved, featured } = req.body;

    const testimonial = await Testimonial.findById(req.params.id);

    if (!testimonial) {
      return res.status(404).json({ message: 'Testimonial not found' });
    }

    // Update fields
    testimonial.studentName = studentName || testimonial.studentName;
    testimonial.role = role || testimonial.role;
    testimonial.language = language || testimonial.language;
    testimonial.type = type || testimonial.type;
    testimonial.rating = rating || testimonial.rating;
    testimonial.review = review || testimonial.review;
    testimonial.isApproved = isApproved !== undefined ? isApproved : testimonial.isApproved;

    // Handle featured status
    if (featured !== undefined) {
      // If setting as featured, unfeature others
      if (featured === true) {
        await Testimonial.updateMany(
          { _id: { $ne: testimonial._id } },
          { $set: { featured: false } }
        );
      }
      testimonial.featured = featured;
    }

    testimonial.updatedAt = new Date();
    await testimonial.save();

    return res.json({
      success: true,
      data: testimonial
    });
  } catch (error) {
    console.error('Error updating testimonial:', error);
    return res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Delete a testimonial
// @route   DELETE /api/admin/testimonials/:id
// @access  Private/Admin
export const deleteTestimonial = async (req: Request, res: Response): Promise<Response> => {
  try {
    const testimonial = await Testimonial.findByIdAndDelete(req.params.id);

    if (!testimonial) {
      return res.status(404).json({ message: 'Testimonial not found' });
    }

    return res.json({
      success: true,
      message: 'Testimonial deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting testimonial:', error);
    return res.status(500).json({ message: 'Server Error' });
  }
};
