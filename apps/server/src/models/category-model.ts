import {
  Schema,
  Types,
  model,
  type HydratedDocument,
  type InferSchemaType,
} from 'mongoose';

const categorySchema = new Schema(
  {
    userId: {
      type: Types.ObjectId,
      ref: 'User',
      required: true,
    },

    name: {
      type: String,
      required: true,
      minLength: 2,
      trim: true,
      lowercase: true,
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

type CategorySchemaType = InferSchemaType<typeof categorySchema>;
export type CategoryDocument = HydratedDocument<CategorySchemaType>;
export const CategoryModel = model<CategoryDocument>(
  'Category',
  categorySchema,
);
