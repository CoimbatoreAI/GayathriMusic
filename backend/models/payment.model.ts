import mongoose, { Document, Schema } from 'mongoose';

export interface IPayment extends Document {
  _id: string;
  enrollmentId: string;
  studentId: string;
  courseId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled' | 'refunded';
  razorpayPaymentId?: string;
  razorpayOrderId?: string;
  razorpaySignature?: string;
  paymentMethod: 'razorpay' | 'card' | 'upi' | 'netbanking' | 'wallet';
  transactionId?: string;
  paymentDate?: Date;
  failureReason?: string;
  metadata: {
    courseType: string;
    courseLevel: string;
    studentName: string;
    studentEmail: string;
    contactNumber: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema: Schema = new Schema({
  enrollmentId: {
    type: String,
    required: true,
    unique: true
  },
  studentId: {
    type: String,
    required: true
  },
  courseId: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    default: 'INR'
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'cancelled', 'refunded'],
    default: 'pending'
  },
  razorpayPaymentId: {
    type: String,
    sparse: true
  },
  razorpayOrderId: {
    type: String,
    sparse: true
  },
  razorpaySignature: {
    type: String,
    sparse: true
  },
  paymentMethod: {
    type: String,
    enum: ['razorpay', 'card', 'upi', 'netbanking', 'wallet'],
    required: true
  },
  transactionId: {
    type: String,
    sparse: true
  },
  paymentDate: {
    type: Date
  },
  failureReason: {
    type: String
  },
  metadata: {
    courseType: { type: String, required: true },
    courseLevel: { type: String, required: true },
    studentName: { type: String, required: true },
    studentEmail: { type: String, required: true },
    contactNumber: { type: String, required: true }
  }
}, {
  timestamps: true
});

// Indexes for better query performance
PaymentSchema.index({ studentId: 1 });
PaymentSchema.index({ status: 1 });
PaymentSchema.index({ createdAt: -1 });

export default mongoose.model<IPayment>('Payment', PaymentSchema);