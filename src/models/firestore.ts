export type FirestoreDocument<T extends object = Record<string, unknown>> = T & {
  id: string;
};
