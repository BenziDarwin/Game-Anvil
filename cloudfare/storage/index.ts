import { storage, bucketName, accountId } from "../config";
import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";

/**
 * Uploads a file to Cloudflare R2 Storage.
 * @param filePath - The path where the file will be stored in R2.
 * @param file - The file to upload (Blob or File).
 * @returns A promise that resolves to the public URL of the uploaded file.
 */
export async function uploadFile(
  filePath: string,
  file: Blob | File,
): Promise<string> {
  try {
    // Add a unique timestamp to prevent caching issues
    const timestamp = Date.now();
    const finalPath = `${filePath}?t=${timestamp}`;

    const arrayBuffer = await file.arrayBuffer();

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: finalPath,
      Body: Buffer.from(arrayBuffer),
      ContentType: file.type,
      // Add metadata to help with debugging
      Metadata: {
        uploadTime: new Date().toISOString(),
        originalName: file instanceof File ? file.name : "blob",
      },
    });

    console.log("Attempting upload with config:", {
      bucket: bucketName,
      key: finalPath,
      contentType: file.type,
    });

    const result = await storage.send(command);
    console.log("Upload result:", result);

    // For public buckets
    //const publicUrl = `https://${bucketName}.r2.cloudflarestorage.com/${finalPath}`;
    // For private buckets using access points
    const publicUrl =
      "https://pub-5569d5f835bd4513baad23dd8cd473d9.r2.dev/" +
      encodeURIComponent(`${finalPath}`);

    return publicUrl;
  } catch (error) {
    console.error("Full upload error:", error);
    if (error instanceof Error) {
      console.error("Error details:", {
        message: error.message,
        name: error.name,
        stack: error.stack,
      });
    }
    throw new Error(`File upload failed: ${error}`);
  }
}

/**
 * Deletes a file from Cloudflare R2 Storage.
 * @param filePath - The path of the file in R2 Storage to delete.
 * @returns A promise that resolves when the file is deleted.
 */
export async function deleteFile(filePath: string): Promise<void> {
  try {
    const command = new DeleteObjectCommand({
      Bucket: bucketName,
      Key: decodeURIComponent(filePath.split("dev/")[1]),
    });

    await storage.send(command);
  } catch (error) {
    console.error("Full deletion error:", error);
    if (error instanceof Error) {
      console.error("Error details:", {
        message: error.message,
        name: error.name,
        stack: error.stack,
      });
    }
    throw new Error(`File deletion failed: ${error}`);
  }
}
