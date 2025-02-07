import { storage } from "../config";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";

/**
 * Uploads a file to Firebase Storage and returns its download URL.
 * @param filePath - The path in Firebase Storage where the file should be uploaded.
 * @param file - The file to be uploaded (Blob or File).
 * @returns A promise that resolves to the file's download URL.
 */
export async function uploadFile(
  filePath: string,
  file: Blob | File,
): Promise<string> {
  try {
    const storageRef = ref(storage, filePath);
    const snapshot = await uploadBytes(storageRef, file);
    return await getDownloadURL(snapshot.ref);
  } catch (error) {
    throw new Error(`File upload failed: ${error}`);
  }
}

/**
 * Deletes a file from Firebase Storage.
 * @param filePath - The path of the file in Firebase Storage to delete.
 * @returns A promise that resolves when the file is deleted.
 */
export async function deleteFile(filePath: string): Promise<void> {
  try {
    const storageRef = ref(storage, filePath);
    await deleteObject(storageRef);
  } catch (error) {
    throw new Error(`File deletion failed: ${error}`);
  }
}
