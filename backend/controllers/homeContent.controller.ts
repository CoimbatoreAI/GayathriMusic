import { Request, Response } from 'express';
import HomeContent from '../models/homeContent.model';
import { validationResult } from 'express-validator';

// @desc    Get all home content sections
// @route   GET /api/home-content
// @access Public
export const getHomeContent = async (req: Request, res: Response): Promise<Response> => {
  try {
    const sections = await HomeContent.find({ isActive: true })
      .sort({ order: 1, createdAt: 1 });
    
    // Convert to object with section as key for easier access on frontend
    const contentMap: Record<string, unknown> = {};
    sections.forEach(section => {
      const sectionObj = section.toObject() as unknown as Record<string, unknown>;
      contentMap[section.section] = sectionObj;
      // Remove MongoDB specific fields
      delete sectionObj._id;
      delete sectionObj.__v;
      delete sectionObj.createdAt;
      delete sectionObj.updatedAt;
    });
    
    return res.json(contentMap);
  } catch (error) {
    console.error('Error fetching home content:', error);
    return res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get all home content sections (Admin)
// @route   GET /api/admin/home-content
// @access  Private/Admin
export const getAdminHomeContent = async (req: Request, res: Response): Promise<Response> => {
  try {
    const sections = await HomeContent.find().sort({ order: 1, createdAt: 1 });
    return res.json({
      success: true,
      data: sections
    });
  } catch (error) {
    console.error('Error fetching admin home content:', error);
    return res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Create or update home content section
// @route   POST /api/admin/home-content
// @access  Private/Admin
export const updateHomeContent = async (req: Request, res: Response): Promise<Response> => {
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

    const { section, title, subtitle, content, imageUrl, buttonText, buttonLink, isActive, order } = req.body;
    
    // Check if section exists
    let homeContent = await HomeContent.findOne({ section });
    
    if (homeContent) {
      // Update existing section
      homeContent.title = title || homeContent.title;
      homeContent.subtitle = subtitle !== undefined ? subtitle : homeContent.subtitle;
      homeContent.content = content || homeContent.content;
      homeContent.imageUrl = imageUrl !== undefined ? imageUrl : homeContent.imageUrl;
      homeContent.buttonText = buttonText !== undefined ? buttonText : homeContent.buttonText;
      homeContent.buttonLink = buttonLink !== undefined ? buttonLink : homeContent.buttonLink;
      homeContent.isActive = isActive !== undefined ? isActive : homeContent.isActive;
      homeContent.order = order !== undefined ? order : homeContent.order;
      
      await homeContent.save();
    } else {
      // Create new section
      homeContent = new HomeContent({
        section,
        title,
        subtitle,
        content,
        imageUrl,
        buttonText,
        buttonLink,
        isActive: isActive !== undefined ? isActive : true,
        order: order || 0
      });
      
      await homeContent.save();
    }
    
    return res.status(200).json({
      success: true,
      data: homeContent
    });
  } catch (error) {
    console.error('Error updating home content:', error);
    return res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Toggle section status
// @route   PATCH /api/admin/home-content/:section/toggle
// @access  Private/Admin
export const toggleSectionStatus = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { section } = req.params;
    const content = await HomeContent.findOne({ section });
    
    if (!content) {
      return res.status(404).json({ message: 'Section not found' });
    }

    content.isActive = !content.isActive;
    content.updatedAt = new Date();
    await content.save();

    return res.json({
      success: true,
      data: content,
      message: `Section ${content.isActive ? 'activated' : 'deactivated'} successfully`
    });
  } catch (error) {
    console.error('Error toggling section status:', error);
    return res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Reorder sections
// @route   POST /api/admin/home-content/reorder
// @access  Private/Admin
export const reorderSections = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { order } = req.body;
    
    if (!order || !Array.isArray(order)) {
      return res.status(400).json({ message: 'Invalid order array' });
    }
    
    const bulkOps = order.map((sectionId: string, index: number) => ({
      updateOne: {
        filter: { _id: sectionId },
        update: { $set: { order: index } }
      }
    }));
    
    await HomeContent.bulkWrite(bulkOps);
    
    const sections = await HomeContent.find().sort({ order: 1, createdAt: 1 });
    return res.json({
      success: true,
      data: sections
    });
  } catch (error) {
    console.error('Error reordering sections:', error);
    return res.status(500).json({ message: 'Server Error' });
  }
};
