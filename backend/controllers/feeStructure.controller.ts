import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import FeeStructure from '../models/feeStructure.model';

// @desc    Get all fee structures
// @route   GET /api/fee-structures
// @access  Public
export const getFeeStructures = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { courseType, courseLevel, language } = req.query;
    const query: any = { isActive: true };

    if (courseType) query.courseType = courseType;
    if (courseLevel) query.courseLevel = courseLevel;
    if (language) query.language = language;

    const feeStructures = await FeeStructure.find(query)
      .sort({ courseType: 1, courseLevel: 1, language: 1 });

    return res.json({
      success: true,
      data: feeStructures
    });
  } catch (error) {
    console.error('Error fetching fee structures:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch fee structures'
    });
  }
};

// @desc    Get all fee structures (Admin)
// @route   GET /api/admin/fee-structures
// @access  Private/Admin
export const getAdminFeeStructures = async (req: Request, res: Response): Promise<Response> => {
  try {
    const feeStructures = await FeeStructure.find().sort({ createdAt: -1 });
    return res.json({
      success: true,
      data: feeStructures
    });
  } catch (error) {
    console.error('Error fetching admin fee structures:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch fee structures'
    });
  }
};

// @desc    Get fee structure by ID
// @route   GET /api/admin/fee-structures/:id
// @access  Private/Admin
export const getFeeStructureById = async (req: Request, res: Response): Promise<Response> => {
  try {
    const feeStructure = await FeeStructure.findById(req.params.id);

    if (!feeStructure) {
      return res.status(404).json({
        success: false,
        error: 'Fee structure not found'
      });
    }

    return res.json({
      success: true,
      data: feeStructure
    });
  } catch (error) {
    console.error('Error fetching fee structure:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch fee structure'
    });
  }
};

// @desc    Create new fee structure
// @route   POST /api/admin/fee-structures
// @access  Private/Admin
export const createFeeStructure = async (req: Request, res: Response): Promise<Response> => {
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

    const feeData = req.body;

    // Calculate final price
    let finalPrice = feeData.basePrice + feeData.registrationFee;
    if (feeData.discountAmount) {
      finalPrice -= feeData.discountAmount;
    } else if (feeData.discountPercentage) {
      finalPrice -= (finalPrice * feeData.discountPercentage / 100);
    }
    feeData.finalPrice = Math.max(0, finalPrice);

    const feeStructure = new FeeStructure(feeData);
    const savedFeeStructure = await feeStructure.save();

    return res.status(201).json({
      success: true,
      data: savedFeeStructure
    });
  } catch (error) {
    console.error('Error creating fee structure:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to create fee structure'
    });
  }
};

// @desc    Update fee structure
// @route   PUT /api/admin/fee-structures/:id
// @access  Private/Admin
export const updateFeeStructure = async (req: Request, res: Response): Promise<Response> => {
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

    const feeData = req.body;

    // Calculate final price if price fields are being updated
    if (feeData.basePrice || feeData.registrationFee || feeData.discountAmount || feeData.discountPercentage) {
      const currentFee = await FeeStructure.findById(req.params.id);
      if (currentFee) {
        let finalPrice = (feeData.basePrice || currentFee.basePrice) + (feeData.registrationFee || currentFee.registrationFee);
        if (feeData.discountAmount || currentFee.discountAmount) {
          finalPrice -= (feeData.discountAmount || currentFee.discountAmount);
        } else if (feeData.discountPercentage || currentFee.discountPercentage) {
          finalPrice -= (finalPrice * ((feeData.discountPercentage || currentFee.discountPercentage) || 0) / 100);
        }
        feeData.finalPrice = Math.max(0, finalPrice);
      }
    }

    const feeStructure = await FeeStructure.findByIdAndUpdate(
      req.params.id,
      { ...feeData, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!feeStructure) {
      return res.status(404).json({
        success: false,
        error: 'Fee structure not found'
      });
    }

    return res.json({
      success: true,
      data: feeStructure
    });
  } catch (error) {
    console.error('Error updating fee structure:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to update fee structure'
    });
  }
};

// @desc    Toggle fee structure status
// @route   PATCH /api/admin/fee-structures/:id/toggle
// @access  Private/Admin
export const toggleFeeStructureStatus = async (req: Request, res: Response): Promise<Response> => {
  try {
    const feeStructure = await FeeStructure.findById(req.params.id);

    if (!feeStructure) {
      return res.status(404).json({
        success: false,
        error: 'Fee structure not found'
      });
    }

    feeStructure.isActive = !feeStructure.isActive;
    feeStructure.updatedAt = new Date();
    await feeStructure.save();

    return res.json({
      success: true,
      data: feeStructure
    });
  } catch (error) {
    console.error('Error toggling fee structure status:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to toggle fee structure status'
    });
  }
};

// @desc    Delete fee structure
// @route   DELETE /api/admin/fee-structures/:id
// @access  Private/Admin
export const deleteFeeStructure = async (req: Request, res: Response): Promise<Response> => {
  try {
    const feeStructure = await FeeStructure.findByIdAndDelete(req.params.id);

    if (!feeStructure) {
      return res.status(404).json({
        success: false,
        error: 'Fee structure not found'
      });
    }

    return res.json({
      success: true,
      message: 'Fee structure deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting fee structure:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to delete fee structure'
    });
  }
};

// @desc    Get fee for specific course criteria
// @route   POST /api/fee-structures/calculate
// @access  Public
export const calculateFee = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { courseType, courseLevel, language } = req.body;

    if (!courseType || !courseLevel || !language) {
      return res.status(400).json({
        success: false,
        error: 'Course type, level, and language are required'
      });
    }

    const feeStructure = await FeeStructure.findOne({
      courseType,
      courseLevel,
      language,
      isActive: true,
      validFrom: { $lte: new Date() },
      $or: [{ validUntil: { $exists: false } }, { validUntil: { $gte: new Date() } }]
    });

    if (!feeStructure) {
      return res.status(404).json({
        success: false,
        error: 'No fee structure found for the specified criteria'
      });
    }

    return res.json({
      success: true,
      data: {
        feeStructure,
        breakdown: {
          basePrice: feeStructure.basePrice,
          registrationFee: feeStructure.registrationFee,
          discountAmount: feeStructure.discountAmount,
          discountPercentage: feeStructure.discountPercentage,
          finalPrice: feeStructure.finalPrice
        }
      }
    });
  } catch (error) {
    console.error('Error calculating fee:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to calculate fee'
    });
  }
};