export default class Conflict extends Error {
    statusCode: number;
    code: string;

    constructor(message = 'Conflict', code = 'CONFLICT', statusCode = 409) {
        super(message);
        this.name = 'Conflict';
        this.code = code;
        this.statusCode = statusCode;

        // Maintain proper stack trace (only available on V8)
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, Conflict);
        }
    }
}
