import mongoose, { Document, Schema } from 'mongoose';

export interface ITestimonial extends Document {
  studentName: string;
  role: string;
  language: string;
  type: string;
  rating: number;
  review: string;
  isApproved: boolean;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const TestimonialSchema: Schema = new Schema({
  studentName: {
    type: String,
    required: true,
    trim: true
  },
  role: {
    type: String,
    required: true,
    trim: true
  },
  language: {
    type: String,
    required: true,
    enum: ['Tamil', 'Telugu', 'Kannada', 'English'],
    default: 'Tamil'
  },
  type: {
    type: String,
    required: true,
    trim: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  review: {
    type: String,
    required: true,
    trim: true
  },
  isApproved: {
    type: Boolean,
    default: false
  },
  featured: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

export default mongoose.model<ITestimonial>('Testimonial', TestimonialSchema);
