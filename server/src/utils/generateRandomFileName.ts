import crypto from "crypto";

/**
 * Generates a random file name using crypto random bytes
 * @param {number} bytes - Nr of bytes to generate for the file name - default is 32
 * @returns {string} - A random hexadecimal string
 */
export const generateRandomFileName = (bytes: number = 32): string => {
  return crypto.randomBytes(bytes).toString("hex");
};
