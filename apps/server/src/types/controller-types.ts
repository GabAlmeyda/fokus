import type { HTTPErrorResponse, HTTPSuccessResponse } from '@fokus/shared';

export type HTTPResponse<B> = HTTPSuccessResponse<B> | HTTPErrorResponse;
