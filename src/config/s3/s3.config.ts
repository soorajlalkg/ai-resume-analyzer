import { S3Client } from '@aws-sdk/client-s3';
import config from '../config';

const { S3_REGION, S3_ACCESS_KEY_ID, S3_SECRET_ACCESS_KEY, IS_LOCAL, S3_ENDPOINT } = config;

if (!S3_REGION || !S3_ACCESS_KEY_ID || !S3_SECRET_ACCESS_KEY) {
  throw new Error('Missing AWS S3 configuration in environment variables.');
}

const isLocal = IS_LOCAL === 'true';

const s3 = new S3Client({
  region: S3_REGION,
  ...(isLocal && {
    endpoint: S3_ENDPOINT,
  }),
  credentials: {
    accessKeyId: S3_ACCESS_KEY_ID,
    secretAccessKey: S3_SECRET_ACCESS_KEY,
  },
});

export default s3;
