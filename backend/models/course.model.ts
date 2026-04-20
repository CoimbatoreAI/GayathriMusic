import mongoose, { Document, Schema } from 'mongoose';

export interface ICourse extends Document {
  title: string;
  subtitle?: string;
  description: string;
  detailedDescription?: string;
  classesPerMonth: number;
  studentsPerBatch: number;
  price: number;
  discountPrice?: number;
  language: 'Tamil' | 'Telugu' | 'Kannada' | 'English';
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  isActive: boolean;
  isFeatured: boolean;
  enrolledStudents: number;
  schedule: string;
  syllabus: {
    title: string;
    topics: string[];
  }[];
  requirements?: string[];
  learningOutcomes?: string[];
  imageUrl?: string;
  videoUrl?: string;
  category: 'vocal' | 'instrumental' | 'theory' | 'other';
  instructor?: string;
  isEnrollmentOpen: boolean;
  startDate?: Date;
  endDate?: Date;
  classTimings?: string[];
  batchType: 'weekday' | 'weekend' | 'both';
  certificateIncluded: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CourseSchema: Schema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 255
  },
  subtitle: {
    type: String,
    trim: true,
    maxlength: 255
  },
  description: {
    type: String,
    required: true
  },
  detailedDescription: {
    type: String,
    trim: true
  },
  classesPerMonth: {
    type: Number,
    required: true,
    min: 1
  },
  studentsPerBatch: {
    type: Number,
    required: true,
    min: 1
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  discountPrice: {
    type: Number,
    min: 0
  },
  language: {
    type: String,
    required: true,
    enum: ['Tamil', 'Telugu', 'Kannada', 'English']
  },
  level: {
    type: String,
    required: true,
    enum: ['Beginner', 'Intermediate', 'Advanced']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  enrolledStudents: {
    type: Number,
    default: 0,
    min: 0
  },
  schedule: {
    type: String,
    required: true,
    maxlength: 255
  },
  syllabus: [{
    title: {
      type: String,
      required: true
    },
    topics: [{
      type: String,
      required: true
    }]
  }],
  requirements: [{
    type: String
  }],
  learningOutcomes: [{
    type: String
  }],
  imageUrl: {
    type: String,
    trim: true
  },
  videoUrl: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['vocal', 'instrumental', 'theory', 'other'],
    default: 'instrumental'
  },
  instructor: {
    type: String,
    trim: true
  },
  isEnrollmentOpen: {
    type: Boolean,
    default: true
  },
  startDate: {
    type: Date
  },
  endDate: {
    type: Date
  },
  classTimings: [{
    type: String
  }],
  batchType: {
    type: String,
    enum: ['weekday', 'weekend', 'both'],
    default: 'weekday'
  },
  certificateIncluded: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  collection: 'courses'
});

// Create indexes for better query performance
CourseSchema.index({ isActive: 1, level: 1, language: 1 });
CourseSchema.index({ title: 1 });
CourseSchema.index({ createdAt: -1 });

// Static methods
CourseSchema.statics = {
  // Get all courses
  async getAllCourses(): Promise<ICourse[]> {
    return this.find().sort({ title: 1 });
  },

  // Get active courses only
  async getActiveCourses(): Promise<ICourse[]> {
    return this.find({ isActive: true }).sort({ title: 1 });
  },

  // Get course by ID
  async getCourseById(id: string): Promise<ICourse | null> {
    return this.findById(id);
  },

  // Create new course
  async createCourse(courseData: Partial<ICourse>): Promise<ICourse> {
    const course = new this(courseData);
    return course.save();
  },

  // Update course
  async updateCourse(id: string, courseData: Partial<ICourse>): Promise<ICourse | null> {
    return this.findByIdAndUpdate(
      id,
      { ...courseData, updatedAt: new Date() },
      { new: true, runValidators: true }
    );
  },

  // Toggle course status
  async toggleCourseStatus(id: string): Promise<ICourse | null> {
    const course = await this.findById(id);
    if (!course) return null;

    course.isActive = !course.isActive;
    course.updatedAt = new Date();
    return course.save();
  },

  // Delete course
  async deleteCourse(id: string): Promise<boolean> {
    const result = await this.findByIdAndDelete(id);
    return !!result;
  }
};

export default mongoose.model<ICourse>('Course', CourseSchema);