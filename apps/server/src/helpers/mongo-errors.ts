import mongoose from 'mongoose';
import { HTTPStatusCode, type InvalidField } from '@fokus/shared';

export class MongoRepositoryError extends Error {
  public readonly errorType: keyof typeof HTTPStatusCode;
  public readonly invalidFields: InvalidField[] | undefined;
  constructor(
    errorType: keyof typeof HTTPStatusCode,
    message: string,
    invalidFields?: InvalidField[] | undefined,
  ) {
    super(message);
    this.errorType = errorType;
    this.invalidFields = invalidFields;

    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromMongoose(err: any) {
    if (err instanceof mongoose.Error.ValidationError) {
      const invalidFields: InvalidField[] = Object.values(err.errors).map(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (e: any) => ({
          field: e.path as string,
          message: e.message as string,
        }),
      );

      const fields = invalidFields.map((err) => `'${err.field}'`).join(', ');

      return new MongoRepositoryError(
        'UNPROCESSABLE',
        `Validation error on fields: ${fields}`,
        invalidFields,
      );
    }

    if (err.code === 11000) {
      const field = Object.keys(err.keyValue)[0] as string;
      const value = Object.values(err.keyValue)[0] as string;

      return new MongoRepositoryError(
        'CONFLICT',
        `Dupliated value for field '${field}'`,
        [
          {
            field,
            message: `Field '${field}' already has a value equal to '${value}'.`,
          },
        ],
      );
    }

    if (err instanceof mongoose.Error.CastError) {
      const invalidField = {
        field: err.path,
        message: `Expect type was '${err.kind}', got '${typeof err.value}' instead.`,
      };

      return new MongoRepositoryError(
        'BAD_REQUEST',
        `Cast error on field '${err.path}'`,
        [invalidField],
      );
    }

    return new MongoRepositoryError(
      'INTERNAL_SERVER_ERROR',
      'Internal Mongo Error',
    );
  }
}
