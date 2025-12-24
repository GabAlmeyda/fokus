import {
  Schema,
  Types,
  model,
  type HydratedDocument,
  type InferSchemaType,
} from 'mongoose';

const habitSchema = new Schema({
  userId: {
    type: Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    trim: true,
    minLength: 2,
    required: true,
  },
  progressImpactValue: {
    type: Number,
    min: 1,
    default: null,
  },
  unitOfMeasure: {
    type: String,
    trim: true,
    default: null,
    minLength: 1,
    lowercase: true,
  },
  weekDays: {
    type: [String],
    enum: ['seg', 'ter', 'qua', 'qui', 'sex', 'sab', 'dom'],
    required: true,
  },
  reminder: {
    type: String,
    match: /^([01][0-9]):(2[0-3][0-9])$/,
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
    match: /^#([0-9a-fA-F]{3})|([0-9a-fA-F]{6})$/,
    required: true,
    default: '#fff',
  },
  icon: {
    Type: String,
    required: true,
  },
});

type HabitSchemaType = InferSchemaType<typeof habitSchema>;
export type HabitDocument = HydratedDocument<HabitSchemaType>;
export const HabitModel = model<HabitDocument>('Task', habitSchema);
