import { Schema, model, type HydratedDocument } from 'mongoose';
import emailValidator from 'email-validator';

interface IUser {
  name: string;
  email: string;
  password: string;
  themeMode: 'light' | 'dark';
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      minLength: 2,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      validate: {
        validator: (value: string) => emailValidator.validate(value),
        message: 'Invalid email provided.',
      },
    },
    password: {
      type: String,
      required: true,
      minLength: 8,
      trim: true,
      select: false,
    },
    themeMode: {
      type: String,
      enum: ['light', 'dark'],
      default: 'light',
    },
  },
  {
    timestamps: true,
  },
);

userSchema.index(
  { email: 1 },
  { name: 'uidx_email', unique: true, background: true },
);

export type UserDocument = HydratedDocument<IUser>;
export const UserModel = model<IUser>('User', userSchema);
