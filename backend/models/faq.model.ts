import mongoose, { Document, Schema } from 'mongoose';

export interface IFAQ extends Document {
  question: string;
  answer: string;
  category: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const FAQSchema: Schema = new Schema({
  question: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000
  },
  answer: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['general', 'admission', 'fees', 'courses', 'other'],
    default: 'general'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

export default mongoose.model<IFAQ>('FAQ', FAQSchema);
