import {
  DocumentData,
  WhereFilterOp,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  getDoc, // Import getDoc
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../config";

/**
 * Fetches all documents from a Firestore collection with optional filters.
 */
export async function getCollection<T = DocumentData>(
  collectionName: string,
  filters: Array<{ field: string; operator: WhereFilterOp; value: any }> = [],
): Promise<T[]> {
  const colRef = collection(db, collectionName);
  let q = query(colRef);

  filters.forEach((filter) => {
    q = query(q, where(filter.field, filter.operator, filter.value));
  });

  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }) as T);
}

/**
 * Fetches a single document by its ID from a Firestore collection.
 */
export async function getDocumentById<T = DocumentData>(
  collectionName: string,
  docId: string,
): Promise<T | null> {
  const docRef = doc(db, collectionName, docId);
  const docSnapshot = await getDoc(docRef);

  if (docSnapshot.exists()) {
    return { ...docSnapshot.data(), id: docSnapshot.id } as T;
  } else {
    console.warn(
      `Document with ID ${docId} not found in collection ${collectionName}`,
    );
    return null;
  }
}

/**
 * Adds a new document to a Firestore collection.
 */
export async function addDocument<T extends DocumentData>(
  collectionName: string,
  data: T,
): Promise<void> {
  const colRef = collection(db, collectionName);
  await addDoc(colRef, data);
}

/**
 * Updates an existing document in a Firestore collection.
 */
export async function updateDocument<T = DocumentData>(
  collectionName: string,
  docId: string,
  data: Partial<T>,
): Promise<void> {
  const docRef = doc(db, collectionName, docId);
  await updateDoc(docRef, data);
}

/**
 * Sets a document in a Firestore collection, creating it if it doesn't exist.
 */
export async function setDocument<T extends DocumentData>(
  collectionName: string,
  docId: string,
  data: T,
): Promise<void> {
  const docRef = doc(db, collectionName, docId);
  await setDoc(docRef, data);
}

/**
 * Deletes a document from a Firestore collection.
 */
export async function deleteDocument(
  collectionName: string,
  docId: string,
): Promise<void> {
  const docRef = doc(db, collectionName, docId);
  await deleteDoc(docRef);
}
