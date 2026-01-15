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
    collation: { locale: 'pt', strength: 2 },
  },
);

categorySchema.index(
  { userId: 1, name: 1 },
  {
    name: 'uidx_userId_name',
    background: true,
    unique: true,
    collation: { locale: 'pt', strength: 2 },
  },
);

type CategorySchema = InferSchemaType<typeof categorySchema>;
export type CategoryDocument = HydratedDocument<CategorySchema>;
export const CategoryModel = model<CategoryDocument>(
  'Category',
  categorySchema,
);
