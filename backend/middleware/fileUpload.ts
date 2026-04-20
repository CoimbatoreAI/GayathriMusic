import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { Request, Response, NextFunction } from 'express';

// Type declarations for multer file handling

// Define FileFilterCallback type since it's not exported in newer multer versions
type FileFilterCallback = (error: Error | null, acceptFile: boolean) => void;

// Configure storage for uploaded files
const storage = (multer as any).diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
    const uploadPath = path.join(__dirname, '..', 'uploads');
    cb(null, uploadPath);
  },
  filename: (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
    try {
      const uniqueSuffix = `${Date.now()}-${uuidv4()}`;
      const ext = path.extname(file.originalname).toLowerCase();
      const filename = `${file.fieldname}-${uniqueSuffix}${ext}`;
      cb(null, filename);
    } catch (error) {
      cb(error as Error, '');
    }
  }
});

// File filter to accept only certain file types
const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  try {
    const filetypes = /jpe?g|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      const error = new Error('Only image files are allowed (jpeg, jpg, png, gif)');
      cb(error, false);
    }
  } catch (error) {
    cb(error as Error, false);
  }
};

// Configure multer with the storage and file filter
const upload = (multer as any)({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 1, // Allow only one file per request
    fields: 10, // Limit number of non-file fields
    headerPairs: 20 // Limit number of header key=>value pairs
  }
});

// Error handling middleware for file uploads
export const handleFileUploadError = (err: unknown, req: Request, res: Response, next: NextFunction): Response | void => {
  if (err) {
    // Check if it's a multer error by checking the error structure
    const multerError = err as any;
    if (multerError && multerError.code) {
      // A Multer error occurred when uploading
      if (multerError.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ message: 'File size is too large. Maximum size is 5MB.' });
      }
      if (multerError.code === 'LIMIT_FILE_COUNT') {
        return res.status(400).json({ message: 'Too many files. Only one file is allowed.' });
      }
      if (multerError.code === 'LIMIT_UNEXPECTED_FILE') {
        return res.status(400).json({ message: 'Unexpected file field.' });
      }
      return res.status(400).json({ message: `File upload error: ${multerError.message || 'Unknown error'}` });
    }

    // An unknown error occurred when uploading
    const errorResponse: { message: string; error?: string } = {
      message: 'An error occurred while uploading the file.'
    };

    if (process.env.NODE_ENV === 'development') {
      errorResponse.error = (err as Error).message || 'Unknown error';
    }

    return res.status(500).json(errorResponse);
  }

  // Everything went fine
  return next();
};

export default upload;
