import type { Request, Response, NextFunction } from 'express';
import { BadRequest, Forbidden, Unauthorized } from '../common/exceptions/index';
import { QueryFailedError } from 'typeorm';
import { failedResponse } from '../utils/response';
import {
    formatValidationErrors,
    VALIDATION_ERROR_TYPES,
} from '../common/validation/validationErrorTypes';

interface ErrorWithName extends Error {
    name: string;
}

interface ErrorWithMessage extends Error {
    message: string;
    stack?: string;
}

// Express error handlers receive unknown error types, so we use unknown and type guard
export function errorHandler(
    err: unknown,
    _req: Request,
    res: Response,
    _next: NextFunction
): Response | void {
    // Type guard for validation errors
    if (VALIDATION_ERROR_TYPES.some(errType => err instanceof errType)) {
        const validationError = err as Parameters<typeof formatValidationErrors>[0];
        const errors = formatValidationErrors(validationError);
        return res.status(400).json(failedResponse(errors, 400, 'VALIDATION_ERROR'));
    }

    // TypeORM QueryFailedError
    if (err instanceof QueryFailedError) {
        const message =
            process.env.NODE_ENV === 'production' ? 'Database query failed' : err.message;
        return res.status(500).json(failedResponse(message, 500, 'TYPEORM_QUERY_FAILED_ERROR'));
    }

    if (err instanceof BadRequest) {
        return res.status(400).json(failedResponse(err.message, err.statusCode, err.code));
    }

    if (err instanceof Unauthorized) {
        return res.status(401).json(failedResponse(err.message, err.statusCode, err.code));
    }

    if (err instanceof Forbidden) {
        return res.status(403).json(failedResponse(err.message, err.statusCode, err.code));
    }

    // Type guard for JWT errors
    if (err instanceof Error && 'name' in err) {
        const errorWithName = err as ErrorWithName;
        if (
            ['TokenExpiredError', 'JsonWebTokenError', 'NotBeforeError'].includes(
                errorWithName.name
            )
        ) {
            return res
                .status(401)
                .json(failedResponse(errorWithName.message, 401, errorWithName.name));
        }
    }

    // Type guard for error with message
    const errorWithMessage: ErrorWithMessage =
        err instanceof Error
            ? { ...err, message: err.message, stack: err.stack }
            : { name: 'Error', message: String(err) };

    console.log({
        message: errorWithMessage.message || 'Unknown error',
        stack: errorWithMessage.stack,
    });

    const { NODE_ENV } = process.env;

    const message =
        NODE_ENV === 'production'
            ? 'Something went wrong'
            : errorWithMessage.message || 'Unknown error';

    return res.status(500).json(failedResponse(message, 500));
}
