import {
  Schema,
  model,
  type HydratedDocument,
  type InferSchemaType,
} from 'mongoose';
import emailValidator from 'email-validator';

const userSchema = new Schema(
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

userSchema.index({ email: 1 }, { unique: true, background: true });

type UserSchema = InferSchemaType<typeof userSchema>;
export type UserDocument = HydratedDocument<UserSchema>;
export const UserModel = model<UserDocument>('User', userSchema);
