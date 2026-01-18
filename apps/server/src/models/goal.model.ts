import { Types, Schema, model, type HydratedDocument } from 'mongoose';

interface IGoal {
  userId: Types.ObjectId | string;
  categoryId: Types.ObjectId | string | null;
  title: string;
  type: 'qualitative' | 'quantitative';
  targetValue: number | null;
  unitOfMeasure: string | null;
  habits: (Types.ObjectId | string)[];
  deadline: Date | null;
  color: string;
  icon: string;
  createdAt: Date;
  updatedAt: Date;
}

const goalSchema = new Schema<IGoal>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      default: null,
    },
    title: {
      type: String,
      minLength: 2,
      trim: true,
      required: true,
    },
    type: {
      type: String,
      enum: ['qualitative', 'quantitative'],
      default: 'qualitative',
    },
    targetValue: {
      type: 'Number',
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
      type: [Schema.Types.ObjectId],
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
    color: {
      type: String,
      match: /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/,
      trim: true,
      lowercase: true,
      default: '#15E03B',
    },
    icon: {
      type: String,
      minLength: 2,
      required: true,
    },
  },
  {
    timestamps: true,
    collation: { locale: 'pt', strength: 2 },
  },
);

goalSchema.index(
  { userId: 1, title: 1 },
  {
    name: 'uidx_userId_title',
    unique: true,
    background: true,
    collation: {
      locale: 'pt',
      strength: 2,
    },
  },
);
goalSchema.index(
  { userId: 1, categoryId: 1 },
  { name: 'idx_userId_categoryId', background: true },
);
goalSchema.index(
  { userId: 1, deadline: 1 },
  { name: 'idx_userId_deadline', background: true },
);

export type GoalDocument = HydratedDocument<IGoal>;
export const GoalModel = model<IGoal>('Goal', goalSchema);
