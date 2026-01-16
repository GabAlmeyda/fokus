import { model, Schema, type HydratedDocument } from 'mongoose';

interface IProgressLog {
  userId: string | Schema.Types.ObjectId;
  habitId: string | Schema.Types.ObjectId | null;
  goalId: string | Schema.Types.ObjectId | null;
  value: number;
  dateString: string;
  createdAt: Date;
  updatedAt: Date;
}

const progressLogSchema = new Schema<IProgressLog>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

  habitId: {
    type: Schema.Types.ObjectId,
    ref: 'Habit',
    default: null,
  },

  goalId: {
    type: Schema.Types.ObjectId,
    ref: 'Goal',
    default: null,
  },

  value: {
    type: Number,
    min: 1,
    default: 1,
  },

  dateString: {
    type: String,
    required: true,
    match: /^([0-9]{4})-([0-9]{2})-([0-9]{2})$/,
  },
});

export type ProgressLogDocument = HydratedDocument<IProgressLog>;
export const ProgressLogModel = model('ProgressLog', progressLogSchema);
