import dotenv from 'dotenv';

dotenv.config();

interface Config {
  port: number;
  nodeEnv: string;
  DB_HOST: string;
  DB_NAME: string;
  DB_USERNAME: string;
  DB_PASSWORD: string;
  DB_SSL: boolean;
  DB_PORT: number;
  DB_LOGGING: boolean;
  DATA_ENCRYPTION_KEY: string;
  JWT_SECRET: string;

  SES_EMAIL: string;
  SES_ACCESS_KEY_ID: string;
  SES_SECRET_ACCESS_KEY: string;
  SES_REGION: string;
  SES_ENDPOINT: string;

  S3_REGION: string;
  S3_ACCESS_KEY_ID: string;
  S3_SECRET_ACCESS_KEY: string;
  S3_BUCKET: string;
  S3_ENDPOINT: string;

  IS_LOCAL: string;
}

const config: Config = {
  port: Number(process.env.PORT) || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  DB_HOST: process.env.DB_HOST as string,
  DB_NAME: process.env.DB_NAME as string,
  DB_USERNAME: process.env.DB_USERNAME as string,
  DB_PASSWORD: process.env.DB_PASSWORD as string,
  DB_SSL: process.env.DB_SSL === 'true' ? true : false,
  DB_PORT: Number(process.env.DB_PORT),
  DB_LOGGING: process.env.DB_LOGGING === 'true' ? true : false,
  DATA_ENCRYPTION_KEY: process.env.DATA_ENCRYPTION_KEY as string,
  JWT_SECRET: process.env.JWT_SECRET as string,

  SES_EMAIL: process.env.SES_EMAIL as string,
  SES_ACCESS_KEY_ID: process.env.SES_ACCESS_KEY_ID as string,
  SES_SECRET_ACCESS_KEY: process.env.SES_SECRET_ACCESS_KEY as string,
  SES_REGION: process.env.SES_REGION as string,
  SES_ENDPOINT: process.env.SES_ENDPOINT as string,

  S3_REGION: process.env.S3_REGION as string,
  S3_ACCESS_KEY_ID: process.env.S3_ACCESS_KEY_ID as string,
  S3_SECRET_ACCESS_KEY: process.env.S3_SECRET_ACCESS_KEY as string,
  S3_BUCKET: process.env.S3_BUCKET as string,
  S3_ENDPOINT: process.env.S3_ENDPOINT as string,

  IS_LOCAL: process.env.IS_LOCAL as string,
};

export default config;
