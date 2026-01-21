import { model, Schema, type HydratedDocument } from 'mongoose';

interface IProgressLog {
  userId: string | Schema.Types.ObjectId;
  habitId: string | Schema.Types.ObjectId | null;
  goalId: string | Schema.Types.ObjectId | null;
  value: number;
  date: Date;
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

  date: {
    type: Date,
    required: true,
    set: (val: Date) => {
      const date = new Date(val);

      date.setUTCHours(0, 0, 0, 0);
      return date;
    },
  },
});

progressLogSchema.index(
  { userId: 1, goalId: 1, date: -1 },
  {
    name: 'idx_userId_goalId_dateString',
    partialFilterExpression: { goalId: { $type: 'objectId' } },
    background: true,
  },
);
progressLogSchema.index(
  { userId: 1, habitId: 1, date: -1 },
  {
    name: 'uidx_userId_habitId_dateString',
    partialFilterExpression: { habitId: { $type: 'objectId' } },
    background: true,
    unique: true,
  },
);
progressLogSchema.index(
  {
    userId: 1,
    date: -1,
  },
  { name: 'idx_userId_dateString', background: true },
);

export type ProgressLogDocument = HydratedDocument<IProgressLog>;
export const ProgressLogModel = model('ProgressLog', progressLogSchema);
