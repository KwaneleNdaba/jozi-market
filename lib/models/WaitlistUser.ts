import mongoose, { Document, Model, Schema } from 'mongoose';

export type WaitlistUserType = 'buyer' | 'vendor';

export interface IWaitlistUser extends Document {
  name: string;
  email: string;
  phone: string;
  type: WaitlistUserType;
  ipAddress?: string;
  createdAt: Date;
  updatedAt: Date;
}

const WaitlistUserSchema = new Schema<IWaitlistUser>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
      maxlength: [20, 'Phone number cannot exceed 20 characters'],
    },
    type: {
      type: String,
      enum: ['buyer', 'vendor'],
      required: [true, 'User type is required'],
      default: 'buyer',
    },
    ipAddress: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
    collection: 'waitlist_users',
  }
);

WaitlistUserSchema.index({ email: 1 }, { unique: true });
WaitlistUserSchema.index({ type: 1 });
WaitlistUserSchema.index({ createdAt: -1 });

const WaitlistUser: Model<IWaitlistUser> =
  mongoose.models.WaitlistUser ||
  mongoose.model<IWaitlistUser>('WaitlistUser', WaitlistUserSchema);

export default WaitlistUser;
