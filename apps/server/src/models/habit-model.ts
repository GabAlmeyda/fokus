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
      default: 'quantitative',
      required: true,
    },
    progressImpactValue: {
      type: Number,
      min: 1,
      default: null,
      required: false,
    },
    unitOfMeasure: {
      type: String,
      trim: true,
      default: null,
      required: false,
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
      match: /^([01][0-9]|2[0-3]):([0-5][0-9])$/,
      default: null,
      required: false,
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
      required: true,
      default: '#fff',
    },
    icon: {
      type: String,
      required: true,
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

type HabitSchemaType = InferSchemaType<typeof habitSchema>;
export type HabitDocument = HydratedDocument<HabitSchemaType>;
export const HabitModel = model<HabitDocument>('Habit', habitSchema);
