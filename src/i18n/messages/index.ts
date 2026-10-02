import { ceb } from "./ceb";
import { en } from "./en";
import { fil } from "./fil";
import { ja } from "./ja";
import { ko } from "./ko";
import { ru } from "./ru";
import type { DeepPartial, Messages } from "./types";
import { zh } from "./zh";

export type { DeepPartial, MessageKey, Messages } from "./types";
export { en };

/** Messages by locale code (see ../locales.ts). */
export const MESSAGES: Readonly<Record<string, DeepPartial<Messages>>> = { en, fil, ceb, ko, ja, ru, zh };
