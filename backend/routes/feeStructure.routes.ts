import express from 'express';
import * as feeStructureController from '../controllers/feeStructure.controller';
import { validateFeeStructure, validate } from '../middleware/validators';

// Helper function to convert ValidationChain arrays to RequestHandler arrays
const validationMiddleware = (validations: any[]): express.RequestHandler[] => {
  return validations.map(validation => validation as express.RequestHandler);
};

const router = express.Router();

// Public routes
router.get('/', feeStructureController.getFeeStructures);
router.post('/calculate', feeStructureController.calculateFee);

export default router;