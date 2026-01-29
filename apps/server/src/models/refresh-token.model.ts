import { Schema, model, type HydratedDocument } from 'mongoose';
import { randomUUID } from 'crypto';

interface IRefreshToken {
  userId: string | Schema.Types.ObjectId;
  token: string;
  familyId: string;
  isRevoked: boolean;
  replacedAt?: Date;
  expiresAt: Date;
}

const refreshTokenSchema = new Schema<IRefreshToken>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    token: {
      type: String,
      default: () => randomUUID(),
      trim: true,
    },
    familyId: {
      type: String,
      required: true,
      trim: true,
    },
    isRevoked: {
      type: Boolean,
      default: false,
    },
    replacedAt: {
      type: Date,
      required: false,
    },
    expiresAt: {
      type: Date,
      required: false,
      default: () => {
        const DAYS_TO_EXPIRE = 7;
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + DAYS_TO_EXPIRE);

        return expiresAt;
      },
    },
  },
  {
    timestamps: true,
  },
);

refreshTokenSchema.index(
  { token: 1 },
  { name: 'uidx_token', unique: true, background: true },
);
refreshTokenSchema.index(
  { familyId: 1 },
  { name: 'idx_familyId', background: true },
);
refreshTokenSchema.index(
  { expiresAt: 1 },
  { name: 'eidx_expiresAt', expireAfterSeconds: 0, background: true },
);

export type RefreshTokenDocument = HydratedDocument<IRefreshToken>;
export const RefreshTokenModel = model<IRefreshToken>(
  'RefreshToken',
  refreshTokenSchema,
);
