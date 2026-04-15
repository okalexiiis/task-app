export type StatusCode = 200 | 400 | 401 | 403 | 404 | 409 | 500;

export type AppError = {
  message: string;
  cause?: unknown;
};

export type Result<T, E = AppError> =
  | {
      success: true;
      status: StatusCode;
      data: T;
    }
  | {
      success: false;
      status: StatusCode;
      error: E;
    };

export const ok = <T>(data: T): Result<T> => ({
  success: true,
  status: 200,
  data,
});

export const fail = <E = { message: string; cause: AppError }>(
  status: StatusCode,
  error: E,
): Result<never, E> => ({
  success: false,
  status,
  error,
});
