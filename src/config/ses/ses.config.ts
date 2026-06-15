import { SESClient } from '@aws-sdk/client-ses';
import config from '../config';

const { SES_ACCESS_KEY_ID, SES_SECRET_ACCESS_KEY, SES_REGION, IS_LOCAL, SES_ENDPOINT } = config;

if (!SES_ACCESS_KEY_ID || !SES_SECRET_ACCESS_KEY) {
    throw new Error('AWS SES credentials are not defined in environment variables.');
}
const isLocal = IS_LOCAL === 'true';
export const sesClient = new SESClient({
    region: SES_REGION,
    ...(isLocal && {
    endpoint: SES_ENDPOINT,
    }),
    credentials: {
        accessKeyId: SES_ACCESS_KEY_ID,
        secretAccessKey: SES_SECRET_ACCESS_KEY,
    },
});
