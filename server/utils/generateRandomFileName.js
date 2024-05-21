const crypto = require("crypto");

/**
 * Generates a random file name using crypto random bytes
 * @param {number} bytes - Nr of bytes to generate for the file name - default is 32
 * @returns {string} - A random hexadecimal string
 */
const generateRandomFileName = (bytes = 32) => {
  return crypto.randomBytes(bytes).toString("hex");
};

export default generateRandomFileName;
