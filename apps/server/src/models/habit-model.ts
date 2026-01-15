import { Schema, model, type HydratedDocument } from 'mongoose';

interface IHabit {
  userId: Schema.Types.ObjectId | string;
  title: string;
  type: 'qualitative' | 'quantitative';
  progressImpactValue: number | null;
  unitOfMeasure: string | null;
  weekDays: ('seg' | 'ter' | 'qua' | 'qui' | 'sex' | 'sab' | 'dom')[];
  reminder: string | null;
  streak: number;
  bestStreak: number;
  color: string;
  icon: string;
  createdAt: Date;
  updatedAt: Date;
}

const habitSchema = new Schema<IHabit>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      trim: true,
      minLength: 2,
      required: true,
    },
    type: {
      type: String,
      enum: ['qualitative', 'quantitative'],
      default: 'qualitative',
    },
    progressImpactValue: {
      type: Number,
      min: 1,
      default: null,
    },
    unitOfMeasure: {
      type: String,
      trim: true,
      minLength: 1,
      lowercase: true,
      default: null,
    },
    weekDays: {
      type: [String],
      enum: ['seg', 'ter', 'qua', 'qui', 'sex', 'sab', 'dom'],
      required: true,
    },
    reminder: {
      type: String,
      match: /^([01][0-9]|2[0-3]):([0-5][0-9])$/,
      default: null,
    },
    streak: {
      type: Number,
      min: 0,
      default: 0,
    },
    bestStreak: {
      type: Number,
      min: 0,
      default: 0,
    },
    color: {
      type: String,
      match: /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/,
      default: '#15E03B',
    },
    icon: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    collation: { locale: 'pt', strength: 2 },
  },
);

habitSchema.index(
  { userId: 1, weekDays: 1 },
  { name: 'idx_userId_weekDays', background: true },
);
habitSchema.index(
  { userId: 1, reminder: 1 },
  { name: 'idx_userId_reminder', background: true },
);
habitSchema.index(
  { userId: 1, title: 1 },
  {
    name: 'uidx_userId_title',
    background: true,
    unique: true,
    collation: {
      locale: 'pt',
      strength: 2,
    },
  },
);

export type HabitDocument = HydratedDocument<IHabit>;
export const HabitModel = model<IHabit>('Habit', habitSchema);
