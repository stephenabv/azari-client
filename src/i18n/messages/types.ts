import type { en } from "./en";

type Widen<T> = { readonly [K in keyof T]: T[K] extends string ? string : Widen<T[K]> };

/** Shape every locale follows; English is the source of truth. */
export type Messages = Widen<typeof en>;

export type DeepPartial<T> = { readonly [K in keyof T]?: T[K] extends string ? string : DeepPartial<T[K]> };

type Join<K extends string, P extends string> = `${K}.${P}`;

/** Dotted path to every string in the English messages, e.g. "nav.home". */
export type MessageKey<T = Messages> = {
  [K in keyof T & string]: T[K] extends string ? K : Join<K, MessageKey<T[K]>>;
}[keyof T & string];
