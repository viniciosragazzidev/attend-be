import type { ApiError, ApiSuccess } from "./schemas";

export function ok<T>(
  data: T,
  meta?: { timestamp?: string; requestId?: string }
): ApiSuccess<T> {
  return {
    success: true,
    data,
    meta: {
      timestamp: new Date().toISOString(),
      ...meta,
    },
  };
}

export function created<T>(
  data: T,
  meta?: { timestamp?: string; requestId?: string }
): ApiSuccess<T> {
  return {
    success: true,
    data,
    meta: {
      timestamp: new Date().toISOString(),
      ...meta,
    },
  };
}

export function fail(
  code: string,
  message: string,
  details?: unknown,
  meta?: { timestamp?: string; requestId?: string }
): ApiError {
  return {
    success: false,
    error: {
      code,
      message,
      details,
    },
    meta: {
      timestamp: new Date().toISOString(),
      ...meta,
    },
  };
}
