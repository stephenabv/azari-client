import {
  collection,
  getDocs,
  doc,
  getDoc,
  query,
  onSnapshot,
  QueryConstraint,
  type Unsubscribe,
} from "firebase/firestore";

import { db } from "../config/firebase";

export async function getCollection<T = any>(
  collectionName: string
): Promise<T[]> {
  const snapshot = await getDocs(collection(db, collectionName));

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as T[];
}

export async function getDocument<T = any>(
  collectionName: string,
  id: string
): Promise<T | null> {
  const ref = doc(db, collectionName, id);
  const snapshot = await getDoc(ref);

  if (!snapshot.exists()) return null;

  return {
    id: snapshot.id,
    ...snapshot.data(),
  } as T;
}

export async function queryCollection<T = any>(
  collectionName: string,
  constraints: QueryConstraint[] = []
): Promise<T[]> {
  const q = query(collection(db, collectionName), ...constraints);
  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as T[];
}

export function getCollectionData<T = any>(
  collectionName: string,
  callback: (data: T[]) => void,
  constraints: QueryConstraint[] = [],
  onError?: (error: Error) => void
): Unsubscribe {
  const collectionRef = collection(db, collectionName);
  const q = query(collectionRef, ...constraints);

  return onSnapshot(
    q,
    (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as T[];

      callback(data);
    },
    (error) => {
      if (onError) {
        onError(error);
      } else {
        console.error("Firestore listener error:", error);
      }
    }
  );
}