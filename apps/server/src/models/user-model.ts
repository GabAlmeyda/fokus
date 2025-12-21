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
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      transform: (_, ret: any) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;

        return ret;
      },
    },
  },
);

userSchema.index({ email: 1 }, { unique: true, background: true });

type UserSchemaType = InferSchemaType<typeof userSchema>;
export type UserDocument = HydratedDocument<UserSchemaType>;
export const UserModel = model<UserDocument>('User', userSchema);
