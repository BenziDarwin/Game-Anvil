import { DocumentData, WhereFilterOp, addDoc, collection, deleteDoc, doc, getDocs, query, setDoc, updateDoc, where } from "firebase/firestore";
import { db } from "../config";

export async function getCollection<T = DocumentData>(
    collectionName: string, 
    filters: Array<{ field: string, operator: WhereFilterOp, value: any }> = []
): Promise<T[]> {
    const colRef = collection(db, collectionName);
    let q = query(colRef);

    filters.forEach(filter => {
        q = query(q, where(filter.field, filter.operator, filter.value));
    });

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data() as T);
}
export async function addDocument<T extends DocumentData>(
    collectionName: string, 
    data: T
): Promise<void> {
    const colRef = collection(db, collectionName);
    await addDoc(colRef, data);
}

export async function updateDocument<T = DocumentData>(
    collectionName: string, 
    docId: string, 
    data: Partial<T>
): Promise<void> {
    const docRef = doc(db, collectionName, docId);
    await updateDoc(docRef, data);
}

export async function setDocument<T extends DocumentData>(
    collectionName: string, 
    docId: string, 
    data: T
): Promise<void> {
    const docRef = doc(db, collectionName, docId);
    await setDoc(docRef, data);
}

export async function deleteDocument(
    collectionName: string, 
    docId: string
): Promise<void> {
    const docRef = doc(db, collectionName, docId);
    await deleteDoc(docRef);
}