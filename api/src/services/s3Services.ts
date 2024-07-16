import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import dotenv from "dotenv";
dotenv.config();

const { BUCKET_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY } = process.env;

if (!BUCKET_REGION || !AWS_ACCESS_KEY_ID || !AWS_SECRET_ACCESS_KEY) {
  throw new Error(
    "Missing AWS configuration (access, secret, bucket region) in environment variables"
  );
}

// s3 client
const s3 = new S3Client({
  region: BUCKET_REGION,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
  },
});

/**
 * Generates a presigned URL which allows temp access to image in bucket
 * @param {string} key - The key of the S3 object
 * @returns {Promise<string>} - A presigned URL to access the bucket object (image)
 */
export const generatePresignedUrl = async (key: string): Promise<string> => {
  const command = new GetObjectCommand({
    Bucket: process.env.BUCKET_NAME,
    Key: key,
  });

  // gen presigned URL that expires in 1hr
  const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
  return url;
};

export const uploadFileToS3 = async (params: any) => {
  const command = new PutObjectCommand(params);
  await s3.send(command);
};

/**
 * Deletes a file from the S3 bucket.
 * @param {string} key - key of the file to delete.
 * @returns {Promise} - a promise that resolves if the file is successfully deleted.
 */
export const deleteFileFromS3 = async (key: string): Promise<any> => {
  const params = {
    Bucket: process.env.BUCKET_NAME,
    Key: key,
  };

  try {
    const command = new DeleteObjectCommand(params);
    await s3.send(command);
    console.log(`s3 file deleted successfully: ${key}`);
  } catch (err) {
    console.error(`error deleting s3 file: ${key}`, err);
    throw err;
  }
};
