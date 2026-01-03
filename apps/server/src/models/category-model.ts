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
  },
);

categorySchema.index(
  { userId: 1, name: 1 },
  { background: true, unique: true },
);

type CategorySchema = InferSchemaType<typeof categorySchema>;
export type CategoryDocument = HydratedDocument<CategorySchema>;
export const CategoryModel = model<CategoryDocument>(
  'Category',
  categorySchema,
);
