import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import FAQ from '../models/faq.model';

// Extend the Request type to include the validation errors
declare global {
  interface Request {
    validationErrors?: () => Record<string, unknown>;
  }
}

// @desc    Get all FAQs
// @route   GET /api/faqs
// @access  Public
export const getFAQs = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category } = req.query;
    const query: { isActive: boolean; category?: string } = { isActive: true };
    
    if (category && typeof category === 'string') {
      query.category = category;
    }
    
    const faqs = await FAQ.find(query).sort({ createdAt: -1 });
    res.json({
      success: true,
      data: faqs
    });
  } catch (error) {
    console.error('Error fetching FAQs:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get all FAQs (Admin)
// @route   GET /api/admin/faqs
// @access  Private/Admin
export const getAdminFAQs = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status } = req.query;
    const query: { isActive?: boolean } = {};

    if (status === 'active') {
      query.isActive = true;
    } else if (status === 'inactive') {
      query.isActive = false;
    } else if (status === 'all') {
      // No filter
    } else {
      // Default to active
      query.isActive = true;
    }

    const faqs = await FAQ.find(query).sort({ createdAt: -1 });
    res.json({
      success: true,
      data: faqs
    });
  } catch (error) {
    console.error('Error fetching admin FAQs:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Create a new FAQ
// @route   POST /api/admin/faqs
// @access  Private/Admin
interface FAQRequest extends Request {
  body: {
    question: string;
    answer: string;
    category?: string;
    isActive?: boolean;
  };
}

export const createFAQ = async (req: FAQRequest, res: Response): Promise<void> => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array()
      });
      return;
    }

    const { question, answer, category, isActive } = req.body;

    const newFAQ = new FAQ({
      question,
      answer,
      category: category || 'general',
      isActive: isActive !== undefined ? isActive : true
    });

    const savedFAQ = await newFAQ.save();
    res.status(201).json({
      success: true,
      data: savedFAQ
    });
  } catch (error) {
    console.error('Error creating FAQ:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update a FAQ
// @route   PUT /api/admin/faqs/:id
// @access  Private/Admin
interface UpdateFAQRequest extends Request {
  params: {
    id: string;
  };
  body: {
    question: string;
    answer: string;
    category: string;
    isActive: boolean;
  };
}

export const updateFAQ = async (req: UpdateFAQRequest, res: Response): Promise<void> => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array()
      });
      return;
    }

    const { question, answer, category, isActive } = req.body;

    const updatedFAQ = await FAQ.findByIdAndUpdate(
      req.params.id,
      {
        question,
        answer,
        category,
        isActive,
        updatedAt: new Date()
      },
      { new: true, runValidators: true }
    );

    if (!updatedFAQ) {
      res.status(404).json({ message: 'FAQ not found' });
      return;
    }

    res.json({
      success: true,
      data: updatedFAQ
    });
  } catch (error) {
    console.error('Error updating FAQ:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Toggle FAQ status
// @route   PATCH /api/admin/faqs/:id/toggle
// @access  Private/Admin
interface ToggleFAQStatusRequest extends Request {
  params: {
    id: string;
  };
}

export const toggleFAQStatus = async (req: ToggleFAQStatusRequest, res: Response): Promise<void> => {
  try {
    const faq = await FAQ.findById(req.params.id);
    
    if (!faq) {
      res.status(404).json({ message: 'FAQ not found' });
      return;
    }

    faq.isActive = !faq.isActive;
    faq.updatedAt = new Date();
    await faq.save();

    res.json({
      success: true,
      data: faq,
      message: `FAQ ${faq.isActive ? 'activated' : 'deactivated'} successfully`
    });
  } catch (error) {
    console.error('Error toggling FAQ status:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Delete a FAQ
// @route   DELETE /api/admin/faqs/:id
// @access  Private/Admin
interface DeleteFAQRequest extends Request {
  params: {
    id: string;
  };
}

export const deleteFAQ = async (req: DeleteFAQRequest, res: Response): Promise<void> => {
  try {
    const faq = await FAQ.findByIdAndDelete(req.params.id);
    
    if (!faq) {
      res.status(404).json({ message: 'FAQ not found' });
      return;
    }

    res.json({
      success: true,
      message: 'FAQ deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting FAQ:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};
