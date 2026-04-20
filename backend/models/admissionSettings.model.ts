import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IAdmissionSettings extends Document {
  isAdmissionOpen: boolean;
  admissionStartDate?: Date;
  admissionEndDate?: Date;
  currentEnrollments: number;
  announcement?: string;
  isAnnouncementActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const AdmissionSettingsSchema: Schema = new Schema({
  isAdmissionOpen: {
    type: Boolean,
    default: false
  },
  admissionStartDate: {
    type: Date
  },
  admissionEndDate: {
    type: Date
  },
  currentEnrollments: {
    type: Number,
    default: 0,
    min: 0
  },
  announcement: {
    type: String,
    trim: true,
    maxlength: 1000
  },
  isAnnouncementActive: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Define the model interface with statics
interface IAdmissionSettingsModel extends Model<IAdmissionSettings> {
  getSettings(): Promise<IAdmissionSettings>;
}

// Ensure only one settings document exists
AdmissionSettingsSchema.statics.getSettings = async function(): Promise<IAdmissionSettings> {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({});
  }
  return settings;
};

const AdmissionSettings = mongoose.model<IAdmissionSettings, IAdmissionSettingsModel>('AdmissionSettings', AdmissionSettingsSchema);

export default AdmissionSettings;
