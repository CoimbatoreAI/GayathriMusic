import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import AdmissionSettings, { IAdmissionSettings } from '../models/admissionSettings.model';

// @desc    Get current admission status
// @route   GET /api/admission/status
// @access  Public
export const getAdmissionStatus = async (req: Request, res: Response): Promise<Response> => {
  try {
    const settings = await AdmissionSettings.getSettings();
    
    // Check if admission is within date range if dates are set
    const now = new Date();
    let isAdmissionOpen = settings.isAdmissionOpen;
    
    if (settings.admissionStartDate && now < new Date(settings.admissionStartDate)) {
      isAdmissionOpen = false;
    }
    
    if (settings.admissionEndDate && now > new Date(settings.admissionEndDate)) {
      isAdmissionOpen = false;
    }
    
    return res.status(200).json({
      success: true,
      data: {
        isAdmissionOpen,
        admissionStartDate: settings.admissionStartDate,
        admissionEndDate: settings.admissionEndDate,
        currentEnrollments: settings.currentEnrollments,
        announcement: settings.isAnnouncementActive ? settings.announcement : null
      }
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error instanceof Error ? error.message : 'Unknown error' });
  }
};

// @desc    Update admission settings
// @route   PUT /api/admin/admission/settings
// @access  Private/Admin
export const updateAdmissionSettings = async (req: Request, res: Response): Promise<Response> => {
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

    const settings = await AdmissionSettings.getSettings();
    
    const updates: Partial<IAdmissionSettings> = {
      isAdmissionOpen: req.body.isAdmissionOpen ?? settings.isAdmissionOpen,
      admissionStartDate: req.body.admissionStartDate ?? settings.admissionStartDate,
      admissionEndDate: req.body.admissionEndDate ?? settings.admissionEndDate,
      announcement: req.body.announcement ?? settings.announcement,
      isAnnouncementActive: req.body.isAnnouncementActive ?? settings.isAnnouncementActive
    };

    const updatedSettings = await AdmissionSettings.findByIdAndUpdate(
      settings._id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      success: true,
      data: updatedSettings,
      message: 'Admission settings updated successfully'
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error instanceof Error ? error.message : 'Unknown error' });
  }
};

// @desc    Increment enrollment counter
// @route   POST /api/admission/increment-enrollments
// @access  Private
export const incrementEnrollments = async (req: Request, res: Response): Promise<Response> => {
  try {
    const settings = await AdmissionSettings.getSettings();

    const updatedSettings = await AdmissionSettings.findByIdAndUpdate(
      settings._id,
      { $inc: { currentEnrollments: 1 } },
      { new: true }
    );

    return res.status(200).json({
      message: 'Enrollment incremented successfully',
      currentEnrollments: updatedSettings?.currentEnrollments ?? 0
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error instanceof Error ? error.message : 'Unknown error' });
  }
};

// @desc    Reset enrollment counter
// @route   POST /api/admin/admission/reset-enrollments
// @access  Private/Admin
export const resetEnrollments = async (req: Request, res: Response): Promise<Response> => {
  try {
    const settings = await AdmissionSettings.getSettings();
    
    await AdmissionSettings.findByIdAndUpdate(
      settings._id,
      { $set: { currentEnrollments: 0 } },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: 'Enrollments reset successfully',
      data: { currentEnrollments: 0 }
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error instanceof Error ? error.message : 'Unknown error' });
  }
};
