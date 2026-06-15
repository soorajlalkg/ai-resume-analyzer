export default class BadRequest extends Error {
  statusCode: number;
  code: string;

  constructor(message = 'Bad Request', code = 'BAD_REQUEST', statusCode = 400) {
    super(message);
    this.name = 'BadRequest';
    this.code = code;
    this.statusCode = statusCode;

    // Maintain proper stack trace (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, BadRequest);
    }
  }
}
