import { Unsubscribe } from "firebase/app-check";
import {
  addDoc,
  collection,
  doc,
  DocumentData,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../firebase";
import { DatabaseTable } from "../state/database-table";

export async function getItems<T>(table: DatabaseTable): Promise<T[]> {
  const snapshot = await getDocs(collection(db, table));
  const items: T[] = [];
  snapshot.forEach((doc: DocumentData) => {
    if (!doc.data().deleted) {
      items.push({ id: doc.id, ...doc.data() });
    }
  });
  return items;
}

export async function getItemById<T>(
  table: DatabaseTable,
  id: string
): Promise<T> {
  const snapshot = await getDoc(doc(db, table, id));
  return { id: snapshot.id, ...snapshot.data() } as T;
}

export async function getItemsByName<T>(
  table: DatabaseTable,
  name: string
): Promise<T[]> {
  const q = query(collection(db, table), where("name", "==", name));
  const snapshot = await getDocs(q);
  const items: T[] = [];
  snapshot.forEach((doc: DocumentData) => {
    if (!doc.data().deleted) {
      items.push({ id: doc.id, ...doc.data() });
    }
  });
  return items;
}

export function onItemByIdSnapshot<T>(
  table: DatabaseTable,
  id: string,
  cb: (items: T) => void
): Unsubscribe {
  return onSnapshot(doc(db, table, id), {}, (snapshot) => {
    cb({ id: snapshot.id, ...snapshot.data() } as T);
  });
}

export async function createItem<T, U>(table: string, item: T): Promise<U> {
  const now = new Date().toISOString();
  const doc = await addDoc(collection(db, table), {
    ...item,
    createdAt: now,
  });
  return {
    id: doc.id,
    ...item,
    createdAt: now,
  } as U;
}

export async function updateItem<T>(
  table: string,
  id: string,
  update: T
): Promise<void> {
  const now = new Date().toISOString();
  await updateDoc(doc(db, table, id), {
    ...update,
    updatedAt: now,
  });
}

export async function deleteItem(table: string, id: string): Promise<void> {
  const now = new Date().toISOString();
  await updateDoc(doc(db, table, id), {
    deleted: true,
    deletedAt: now,
  });
}
