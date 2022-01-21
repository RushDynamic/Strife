import S3 from 'aws-sdk/clients/s3.js';
import dotenv from 'dotenv';
dotenv.config();
export const bucketName = process.env.S3_BUCKET_NAME;
const region = process.env.S3_AWS_REGION;
const accessKeyId = process.env.S3_ACCESS_KEY_ID;
const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY;

const s3 = new S3({
  region,
  accessKeyId,
  secretAccessKey,
});

export default s3;
