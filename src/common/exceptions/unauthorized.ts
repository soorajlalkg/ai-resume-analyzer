export default class Unauthorized extends Error {
  statusCode: number;
  code: string;

  constructor(message = 'Unauthorized', code = 'UNAUTHORIZED', statusCode = 401) {
    super(message);
    this.name = 'Unauthorized';
    this.code = code;
    this.statusCode = statusCode;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, Unauthorized);
    }
  }
}
