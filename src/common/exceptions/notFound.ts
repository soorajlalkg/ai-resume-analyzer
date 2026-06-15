export default class NotFound extends Error {
    statusCode: number;
    code: string;

    constructor(message = 'Not Found', code = 'NOT_FOUND', statusCode = 404) {
        super(message);
        this.name = 'NotFound';
        this.code = code;
        this.statusCode = statusCode;

        // Maintain proper stack trace (only available on V8)
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, NotFound);
        }
    }
}
