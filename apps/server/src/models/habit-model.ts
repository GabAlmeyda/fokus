import {
  Schema,
  Types,
  model,
  type HydratedDocument,
  type InferSchemaType,
} from 'mongoose';

const habitSchema = new Schema(
  {
    userId: {
      type: Types.ObjectId,
      ref: 'User',
    },
    title: {
      type: String,
      trim: true,
      minLength: 2,
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
      default: null,
      minLength: 1,
      lowercase: true,
    },
    weekDays: {
      type: [String],
      enum: ['seg', 'ter', 'qua', 'qui', 'sex', 'sab', 'dom'],
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
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      transform(_, ret: any) {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;

        return ret;
      },
    },
  },
);

habitSchema.index({ userId: 1, weekDays: 1 });
habitSchema.index({ userId: 1, reminder: 1 }, { sparse: true });
habitSchema.index({ userId: 1, title: 1 });

type HabitSchemaType = InferSchemaType<typeof habitSchema>;
export type HabitDocument = HydratedDocument<HabitSchemaType>;
export const HabitModel = model<HabitDocument>('Habit', habitSchema);
