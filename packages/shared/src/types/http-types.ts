export type HTTPRequest<B> = {
  headers?: Record<string, string | undefined>;
  params?: Record<string, string | undefined>;
  query?: Record<string, string | string[] | undefined>;
  body?: B;
  userId?: string;
};

export type HTTPSuccessResponse<B> = {
  statusCode: (typeof HTTPStatusCode)[keyof typeof HTTPStatusCode];
  body: B;
};

export type HTTPErrorResponse = {
  statusCode: (typeof HTTPStatusCode)[keyof typeof HTTPStatusCode];
  body: { message: string; invalidFields?: InvalidField[] };
};

export const HTTPStatusCode = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,

  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE: 422,

  INTERNAL_SERVER_ERROR: 500,
} as const;

export type InvalidField = {
  field: string;
  message?: string;
};
