import type { HTTPStatusCode, InvalidField } from '@fokus/shared';

export class AppServerError extends Error {
  public readonly errorType: keyof typeof HTTPStatusCode;
  public readonly invalidFields: InvalidField[];
  constructor(
    errorType: keyof typeof HTTPStatusCode,
    message: string,
    invalidFields: InvalidField[] = [],
  ) {
    super(message);
    this.errorType = errorType;
    this.invalidFields = invalidFields;

    this.name = 'AppServerError';
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this);
  }
}
