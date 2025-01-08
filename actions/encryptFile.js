const crypto = require("crypto");
const { Readable } = require("stream");

// Define encryption settings
const ALGORITHM = "aes-256-cbc";
const IV_LENGTH = 16; // AES block size in bytes
const KEY_LENGTH = 32; // AES key size in bytes

/**
 * Generate a random encryption key
 * @returns {Uint8Array} - Encryption key
 */
function generateKey() {
  return new Uint8Array(crypto.randomBytes(KEY_LENGTH));
}

/**
 * Encrypt a file object and return the encrypted content
 * @param {File} file - Input File object
 * @param {Uint8Array} key - Encryption key
 * @returns {Promise<File>} - Encrypted File object
 */
async function encryptFile(file, key) {
  return new Promise((resolve, reject) => {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

    const chunks = [];
    const reader = new FileReader();

    reader.onload = (e) => {
      const fileBuffer = e.target.result; // ArrayBuffer of the file content
      const inputStream = Readable.from([Buffer.from(fileBuffer)]); // Convert ArrayBuffer to Buffer and create stream

      // Write IV at the beginning
      chunks.push(iv);

      inputStream
        .pipe(cipher)
        .on("data", (chunk) => chunks.push(chunk))
        .on("end", () => {
          const encryptedBuffer = Buffer.concat(chunks);
          const encryptedFile = new File(
            [encryptedBuffer],
            `${file.name}.gvil`,
          );
          resolve(encryptedFile);
        })
        .on("error", reject);
    };

    reader.onerror = reject;
    reader.readAsArrayBuffer(file); // Read the file as ArrayBuffer
  });
}

/**
 * Decrypt an encrypted file and return the decrypted content
 * @param {File} encryptedFile - Encrypted File object
 * @param {Uint8Array} key - Encryption key
 * @returns {Promise<File>} - Decrypted File object
 */
async function decryptFile(encryptedFile, key) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    const reader = new FileReader();

    reader.onload = (e) => {
      const encryptedBuffer = e.target.result; // ArrayBuffer of the encrypted file
      const inputStream = Readable.from([Buffer.from(encryptedBuffer)]); // Convert ArrayBuffer to Buffer and create stream

      // Read the IV from the beginning of the file
      const iv = Buffer.alloc(IV_LENGTH);
      inputStream.once("readable", () => {
        const chunk = inputStream.read(IV_LENGTH);
        if (chunk) {
          chunk.copy(iv);
        } else {
          return reject(new Error("Unable to read IV"));
        }

        const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);

        inputStream
          .pipe(decipher)
          .on("data", (chunk) => chunks.push(chunk))
          .on("end", () => {
            const decryptedBuffer = Buffer.concat(chunks);
            const decryptedFile = new File(
              [decryptedBuffer],
              encryptedFile.name.replace(".gvil", ".decrypted"),
            );
            resolve(decryptedFile);
          })
          .on("error", reject);
      });
    };

    reader.onerror = reject;
    reader.readAsArrayBuffer(encryptedFile); // Read the encrypted file as ArrayBuffer
  });
}

module.exports = {
  generateKey,
  encryptFile,
  decryptFile,
};
