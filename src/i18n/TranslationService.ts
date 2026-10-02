import type { DeepPartial, MessageKey, Messages } from "./messages/types";

type Params = Readonly<Record<string, string | number>>;

/**
 * Resolves message keys for one locale, falling back to English for any
 * key the locale has not translated yet, so a partial translation never
 * shows blanks.
 */
export class TranslationService {
  constructor(
    private readonly messages: DeepPartial<Messages>,
    private readonly fallback: Messages,
  ) {}

  t(key: MessageKey, params?: Params): string {
    const template = lookup(this.messages, key) ?? lookup(this.fallback, key) ?? key;
    return params ? interpolate(template, params) : template;
  }
}

function lookup(source: unknown, key: string): string | undefined {
  let node: unknown = source;
  for (const part of key.split(".")) {
    if (node === null || typeof node !== "object") return undefined;
    node = (node as Record<string, unknown>)[part];
  }
  return typeof node === "string" && node.length > 0 ? node : undefined;
}

/** Replaces {name} placeholders; unknown placeholders are left as-is. */
function interpolate(template: string, params: Params): string {
  return template.replace(/\{(\w+)\}/g, (match, name: string) =>
    Object.prototype.hasOwnProperty.call(params, name) ? String(params[name]) : match,
  );
}
