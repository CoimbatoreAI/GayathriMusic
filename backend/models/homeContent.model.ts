import mongoose, { Document, Schema } from 'mongoose';

export interface IHomeContent extends Document {
  section: string;
  title: string;
  subtitle?: string;
  content?: string;
  imageUrl?: string;
  buttonText?: string;
  buttonLink?: string;
  isActive: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const HomeContentSchema: Schema = new Schema({
  section: {
    type: String,
    required: true,
    enum: ['hero', 'about', 'services', 'features', 'testimonials', 'cta', 'gallery', 'languages', 'keypoints'],
    unique: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  subtitle: {
    type: String,
    trim: true
  },
  content: {
    type: String,
    trim: true
  },
  imageUrl: {
    type: String,
    trim: true
  },
  buttonText: {
    type: String,
    trim: true
  },
  buttonLink: {
    type: String,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

export default mongoose.model<IHomeContent>('HomeContent', HomeContentSchema);
