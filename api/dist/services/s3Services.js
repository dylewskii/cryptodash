"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFileFromS3 = exports.uploadFileToS3 = exports.generatePresignedUrl = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const { BUCKET_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY } = process.env;
if (!BUCKET_REGION || !AWS_ACCESS_KEY_ID || !AWS_SECRET_ACCESS_KEY) {
    throw new Error("Missing AWS configuration (access, secret, bucket region) in environment variables");
}
// s3 client
const s3 = new client_s3_1.S3Client({
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
const generatePresignedUrl = (key) => __awaiter(void 0, void 0, void 0, function* () {
    const command = new client_s3_1.GetObjectCommand({
        Bucket: process.env.BUCKET_NAME,
        Key: key,
    });
    // gen presigned URL that expires in 1hr
    const url = yield (0, s3_request_presigner_1.getSignedUrl)(s3, command, { expiresIn: 3600 });
    return url;
});
exports.generatePresignedUrl = generatePresignedUrl;
const uploadFileToS3 = (params) => __awaiter(void 0, void 0, void 0, function* () {
    const command = new client_s3_1.PutObjectCommand(params);
    yield s3.send(command);
});
exports.uploadFileToS3 = uploadFileToS3;
/**
 * Deletes a file from the S3 bucket.
 * @param {string} key - key of the file to delete.
 * @returns {Promise} - a promise that resolves if the file is successfully deleted.
 */
const deleteFileFromS3 = (key) => __awaiter(void 0, void 0, void 0, function* () {
    const params = {
        Bucket: process.env.BUCKET_NAME,
        Key: key,
    };
    try {
        const command = new client_s3_1.DeleteObjectCommand(params);
        yield s3.send(command);
        console.log(`s3 file deleted successfully: ${key}`);
    }
    catch (err) {
        console.error(`error deleting s3 file: ${key}`, err);
        throw err;
    }
});
exports.deleteFileFromS3 = deleteFileFromS3;
