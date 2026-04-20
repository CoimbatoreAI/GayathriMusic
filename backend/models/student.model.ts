import mongoose, { Document, Schema } from 'mongoose';

export interface IStudent extends Document {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: Date;
  gender: 'Male' | 'Female' | 'Other';
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  parentName: string;
  parentPhone: string;
  parentEmail: string;
  joiningDate: Date;
  status: 'active' | 'inactive' | 'suspended' | 'completed';
  enrolledCourses: mongoose.Types.ObjectId[];
  enrollmentStatus: 'pending' | 'confirmed' | 'cancelled';
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded';
  enrollmentDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const StudentSchema: Schema = new Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    maxlength: 100
  },
  phone: {
    type: String,
    required: true,
    maxlength: 20
  },
  dateOfBirth: {
    type: Date,
    required: true
  },
  gender: {
    type: String,
    required: true,
    enum: ['Male', 'Female', 'Other']
  },
  address: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true,
    maxlength: 50
  },
  state: {
    type: String,
    required: true,
    maxlength: 50
  },
  postalCode: {
    type: String,
    required: true,
    maxlength: 20
  },
  country: {
    type: String,
    required: true,
    maxlength: 50
  },
  parentName: {
    type: String,
    required: true,
    maxlength: 100
  },
  parentPhone: {
    type: String,
    required: true,
    maxlength: 20
  },
  parentEmail: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    maxlength: 100
  },
  joiningDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  status: {
    type: String,
    required: true,
    enum: ['active', 'inactive', 'suspended', 'completed'],
    default: 'active'
  },
  enrolledCourses: [{
    type: Schema.Types.ObjectId,
    ref: 'Course'
  }],
  enrollmentStatus: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  enrollmentDate: {
    type: Date
  }
}, {
  timestamps: true,
  collection: 'students'
});

// Create indexes for better query performance
StudentSchema.index({ status: 1 });
StudentSchema.index({ joiningDate: -1 });
StudentSchema.index({ firstName: 1, lastName: 1 });

// Virtual for full name
StudentSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Ensure virtual fields are serialized
StudentSchema.set('toJSON', { virtuals: true });
StudentSchema.set('toObject', { virtuals: true });

export default mongoose.model<IStudent>('Student', StudentSchema);
