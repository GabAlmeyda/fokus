import {
  Schema,
  model,
  type HydratedDocument,
  type InferSchemaType,
} from 'mongoose';
import { Types } from 'mongoose';

const goalSchema = new Schema({
  userId: {
    type: Types.ObjectId,
    ref: 'User',
  },
  categoryId: {
    type: Types.ObjectId,
    ref: 'Category',
    default: null,
  },
  title: {
    type: String,
    minLength: 2,
    trim: true,
  },
  type: {
    type: String,
    enum: ['qualitative', 'quantitative'],
    default: 'qualitative',
  },
  currentValue: {
    type: Number,
    min: 0,
    default: null,
  },
  targetValue: {
    type: Number,
    min: 0,
    default: null,
  },
  unitOfMeasure: {
    type: String,
    minLength: 1,
    trim: true,
    lowercase: true,
    default: null,
  },
  habits: {
    type: [Types.ObjectId],
    ref: 'Habit',
    default: [],
  },
  deadline: {
    type: Date,
    default: null,
    set: function (val: Date | null) {
      if (!val) return null;

      const date = new Date(val);
      date.setUTCHours(0, 0, 0, 0);

      return date;
    },
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  color: {
    type: String,
    match: /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/,
    trim: true,
    lowercase: true,
    default: '#15E03B',
  },
});

type GoalSchemaType = InferSchemaType<typeof goalSchema>;
export type GoalDocument = HydratedDocument<GoalSchemaType>;
export const GoalModel = model<GoalDocument>('Goal', goalSchema);
