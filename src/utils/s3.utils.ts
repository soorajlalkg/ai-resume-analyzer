import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import {
    CopyObjectCommand,
    DeleteObjectCommand,
    GetObjectCommand,
    HeadObjectCommand,
    PutObjectCommand,
} from '@aws-sdk/client-s3';
import crypto from 'crypto';
import s3 from '../config/s3/s3.config';
import BadRequest from '../common/exceptions/badRequest';
import config from '../config/config';

const { S3_BUCKET, S3_REGION } = config;

if (!S3_BUCKET || !S3_REGION) {
    throw new Error('Missing S3_BUCKET or S3_REGION in environment variables');
}

const generateRandomFilename = (file: string): string | null => {
    if (!file) {
        return null;
    }
    const extension = file.split('.').pop();
    const name = file
        .replace(/\.[^/.]+$/, '')
        .replace(/[^a-zA-Z0-9_-]/g, '_')
        .replace(/_+/g, '_');

    return `${name}_${crypto.randomBytes(4).toString('hex')}.${extension}`;
};

export const getS3PublicUrl = (key: string): string => {
    return `https://${S3_BUCKET}.s3.${S3_REGION}.amazonaws.com/${key}`;
};

export const getS3SignedUrl = async (key: string, contentType: string = ''): Promise<string> => {
    try {
        const signedUrl: string = await getSignedUrl(
            s3,
            new GetObjectCommand({
                Bucket: S3_BUCKET,
                Key: key,
                ResponseContentType: contentType,
            }),
            { expiresIn: 3600 }
        );

        return signedUrl;
    } catch {
        throw new BadRequest('Failed to fetch image url', 'IMAGE_URL_NOT_FOUND');
    }
};

export const uploadToS3 = async (
    key: string,
    body: Buffer | Uint8Array | Blob | string,
    contentType: string = '',
    randomFilename: boolean = false
): Promise<{ key: string; url: string }> => {
    try {
        if (!key || !body) {
            throw new BadRequest('File key and body are required', 'MISSING_PARAMETERS');
        }

        const finalKey = randomFilename ? (generateRandomFilename(key) ?? key) : key;

        const options = {
            Bucket: S3_BUCKET,
            Key: finalKey,
            Body: body,
            ContentType: contentType || 'application/octet-stream',
        };

        await s3.send(new PutObjectCommand(options));

        return {
            key: finalKey,
            url: await getS3SignedUrl(finalKey),
        };
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to upload file';
        throw new BadRequest(errorMessage, 'FILE_UPLOAD_FAILED');
    }
};

export const deleteFromS3 = async (key: string): Promise<void> => {
    try {
        const options = {
            Bucket: S3_BUCKET,
            Key: key,
        };

        await s3.send(new DeleteObjectCommand(options));
    } catch {
        throw new BadRequest('Failed to fetch image', 'IMAGE_GET_FAILED');
    }
};
