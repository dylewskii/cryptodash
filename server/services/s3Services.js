const {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
  DeleteObjectCommand,
} = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

// s3 client
const s3 = new S3Client({
  region: process.env.BUCKET_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

/**
 * Generates a presigned URL which allows temp access to image in bucket
 * @param {string} key - The key of the S3 object
 * @returns {Promise<string>} - A presigned URL to access the bucket object (image)
 */
const generatePresignedUrl = async (key) => {
  const command = new GetObjectCommand({
    Bucket: process.env.BUCKET_NAME,
    Key: key,
  });

  // gen presigned URL that expires in 1hr
  const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
  return url;
};

const uploadFileToS3 = async (params) => {
  const command = new PutObjectCommand(params);
  await s3.send(command);
};

/**
 * Deletes a file from the S3 bucket.
 * @param {string} key - key of the file to delete.
 * @returns {Promise} - a promise that resolves if the file is successfully deleted.
 */
const deleteFileFromS3 = async (key) => {
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

module.exports = {
  generatePresignedUrl,
  uploadFileToS3,
  deleteFileFromS3,
  s3,
};
