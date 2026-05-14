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
import type { FirestoreDocument } from "../models/firestore";

export async function getCollection<T extends object = Record<string, unknown>>(
  collectionName: string
): Promise<Array<FirestoreDocument<T>>> {
  const snapshot = await getDocs(collection(db, collectionName));

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Array<FirestoreDocument<T>>;
}

export async function getDocument<T extends object = Record<string, unknown>>(
  collectionName: string,
  id: string
): Promise<FirestoreDocument<T> | null> {
  const ref = doc(db, collectionName, id);
  const snapshot = await getDoc(ref);

  if (!snapshot.exists()) return null;

  return {
    id: snapshot.id,
    ...snapshot.data(),
  } as FirestoreDocument<T>;
}

export async function queryCollection<T extends object = Record<string, unknown>>(
  collectionName: string,
  constraints: QueryConstraint[] = []
): Promise<Array<FirestoreDocument<T>>> {
  const q = query(collection(db, collectionName), ...constraints);
  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Array<FirestoreDocument<T>>;
}

export function getCollectionData<T extends object = Record<string, unknown>>(
  collectionName: string,
  callback: (data: Array<FirestoreDocument<T>>) => void,
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
      })) as Array<FirestoreDocument<T>>;

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