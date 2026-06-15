export default class Forbidden extends Error {
  statusCode: number;
  code: string;

  constructor(message = 'Forbidden', code = 'FORBIDDEN', statusCode = 403) {
    super(message);
    this.name = 'Forbidden';
    this.code = code;
    this.statusCode = statusCode;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, Forbidden);
    }
  }
}
