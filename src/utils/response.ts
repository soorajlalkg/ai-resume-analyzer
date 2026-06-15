/* eslint-disable @typescript-eslint/no-explicit-any */
interface GoodResponse<T = any> {
    success: true;
    message: string;
    statusCode: number;
    data?: T;
    [key: string]: any;
}

interface FailedResponse {
    success: false;
    message: string | Record<string, any>[];
    statusCode: number;
    errorName?: string;
}

export const goodResponse = <T = any>(
    response: Record<string, any> | T,
    message: string,
    statusCode?: number
): GoodResponse<T> => ({
    ...response,
    success: true,
    message,
    statusCode: statusCode ?? 200,
});

export const failedResponse = (
    message: string | Record<string, any>[],
    statusCode = 401,
    errorName = ''
): FailedResponse => ({
    success: false,
    message,
    statusCode,
    errorName,
});
