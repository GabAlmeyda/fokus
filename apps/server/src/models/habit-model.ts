import {
  Schema,
  model,
  type HydratedDocument,
  type InferSchemaType,
} from 'mongoose';

const habitSchema = new Schema(
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
      type: Number as unknown as typeof Number | null,
      min: 1,
      default: null,
    },
    unitOfMeasure: {
      type: String as unknown as typeof String | null,
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
      type: String as unknown as typeof String | null,
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

type HabitSchema = InferSchemaType<typeof habitSchema>;
export type HabitDocument = HydratedDocument<HabitSchema>;
export const HabitModel = model<HabitDocument>('Habit', habitSchema);
