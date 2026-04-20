import mongoose, { Document, Schema } from 'mongoose';

export interface IFeeStructure extends Document {
  name: string;
  description?: string;
  courseType: 'Individual Online - Indian' | 'Group Online - Indian' | 'Individual Online - Foreign' | 'Individual Offline - Chennai' | 'other';
  courseLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  language: 'Tamil' | 'Telugu' | 'Kannada' | 'English';
  basePrice: number;
  registrationFee: number;
  discountAmount?: number;
  discountPercentage?: number;
  finalPrice: number;
  isActive: boolean;
  validFrom: Date;
  validUntil?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const FeeStructureSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 255
  },
  description: {
    type: String,
    trim: true,
    maxlength: 500
  },
  courseType: {
    type: String,
    required: true,
    enum: ['Individual Online - Indian', 'Group Online - Indian', 'Individual Online - Foreign', 'Individual Offline - Chennai', 'other']
  },
  courseLevel: {
    type: String,
    required: true,
    enum: ['Beginner', 'Intermediate', 'Advanced']
  },
  language: {
    type: String,
    required: true,
    enum: ['Tamil', 'Telugu', 'Kannada', 'English']
  },
  basePrice: {
    type: Number,
    required: true,
    min: 0
  },
  registrationFee: {
    type: Number,
    required: true,
    min: 0
  },
  discountAmount: {
    type: Number,
    min: 0
  },
  discountPercentage: {
    type: Number,
    min: 0,
    max: 100
  },
  finalPrice: {
    type: Number,
    required: true,
    min: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  validFrom: {
    type: Date,
    required: true
  },
  validUntil: {
    type: Date
  }
}, {
  timestamps: true,
  collection: 'feeStructures'
});

// Create indexes for better query performance
FeeStructureSchema.index({ courseType: 1, courseLevel: 1, language: 1, isActive: 1 });
FeeStructureSchema.index({ validFrom: 1, validUntil: 1 });
FeeStructureSchema.index({ createdAt: -1 });

// Pre-save middleware to calculate final price
FeeStructureSchema.pre('save', function (next) {
  const doc = this as any;
  let finalPrice = doc.basePrice + doc.registrationFee;

  if (doc.discountAmount) {
    finalPrice -= doc.discountAmount;
  } else if (doc.discountPercentage) {
    finalPrice -= (finalPrice * doc.discountPercentage / 100);
  }

  doc.finalPrice = Math.max(0, finalPrice); // Ensure price doesn't go negative
  next();
});

// Static methods
FeeStructureSchema.statics = {
  // Get all active fee structures
  async getActiveFeeStructures(): Promise<IFeeStructure[]> {
    return this.find({ isActive: true, validFrom: { $lte: new Date() }, $or: [{ validUntil: { $exists: false } }, { validUntil: { $gte: new Date() } }] })
      .sort({ courseType: 1, courseLevel: 1, language: 1 });
  },

  // Get fee structure by criteria
  async getFeeStructureByCriteria(courseType: string, courseLevel: string, language: string): Promise<IFeeStructure | null> {
    return this.findOne({
      courseType,
      courseLevel,
      language,
      isActive: true,
      validFrom: { $lte: new Date() },
      $or: [{ validUntil: { $exists: false } }, { validUntil: { $gte: new Date() } }]
    });
  },

  // Create new fee structure
  async createFeeStructure(feeData: Partial<IFeeStructure>): Promise<IFeeStructure> {
    const feeStructure = new this(feeData);
    return feeStructure.save();
  },

  // Update fee structure
  async updateFeeStructure(id: string, feeData: Partial<IFeeStructure>): Promise<IFeeStructure | null> {
    return this.findByIdAndUpdate(
      id,
      { ...feeData, updatedAt: new Date() },
      { new: true, runValidators: true }
    );
  },

  // Toggle fee structure status
  async toggleFeeStructureStatus(id: string): Promise<IFeeStructure | null> {
    const feeStructure = await this.findById(id);
    if (!feeStructure) return null;

    feeStructure.isActive = !feeStructure.isActive;
    feeStructure.updatedAt = new Date();
    return feeStructure.save();
  },

  // Delete fee structure
  async deleteFeeStructure(id: string): Promise<boolean> {
    const result = await this.findByIdAndDelete(id);
    return !!result;
  }
};

export default mongoose.model<IFeeStructure>('FeeStructure', FeeStructureSchema);