import {
  Schema,
  model,
  type HydratedDocument,
  type InferSchemaType,
} from 'mongoose';

const goalSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    categoryId: {
      type: Schema.Types.ObjectId as unknown as
        | typeof Schema.Types.ObjectId
        | null,
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
    currentValue: {
      type: Number as unknown as typeof Number | null,
      min: 0,
      default: null,
    },
    targetValue: {
      type: Number as unknown as typeof Number | null,
      min: 0,
      default: null,
    },
    unitOfMeasure: {
      type: String as unknown as typeof String | null,
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
      type: Date as unknown as typeof Date | null,
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
    icon: {
      type: String,
      minLength: 2,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

goalSchema.index(
  { userId: 1, title: 1 },
  { name: 'idx_userId_title', unique: true, background: true },
);
goalSchema.index(
  { userId: 1, categoryId: 1 },
  { name: 'idx_userId_categoryId', background: true },
);
goalSchema.index(
  { userId: 1, deadline: 1 },
  { name: 'idx_userId_deadline', background: true },
);

type GoalSchema = InferSchemaType<typeof goalSchema>;
export type GoalDocument = HydratedDocument<GoalSchema>;
export const GoalModel = model<GoalDocument>('Goal', goalSchema);
