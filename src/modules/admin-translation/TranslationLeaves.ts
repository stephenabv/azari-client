/**
 * Which parts of admin JSON content are prose, and helpers to read, write and
 * merge prose strings by path. The key/value rules mirror the server
 * (azari-backend TextLeaves.ts) so the editor shows exactly the strings the
 * public overlay will replace.
 */

/** Keys whose values are identifiers, links or styling, never prose. */
const NON_TEXT_KEY = /(url|href|link|icon|image|video|color|colour|style|slug|email|phone|unit|code|^id$|Id$|^key$|^type$|^status$|^variant$|^external$|^target$)/i;

/** Values that read the same in every language. */
const NON_TEXT_VALUE: readonly RegExp[] = [
  /^\s*$/,
  /^(https?:|mailto:|tel:|data:|\/|#)/i,
  /^[\w.+-]+@[\w-]+\.[\w.]+$/,
  /^#[0-9a-f]{3,8}$/i,
  /^[\d\s.,:;%₱+\-–—×x/()]*(k?W[hp]?|MW[hp]?|kVA|V|A|h|hrs?|yrs?|mos?)?[\d\s.,%/()-]*$/i,
];

export type LeafPath = ReadonlyArray<string | number>;

export interface ProseLeaf {
  /** Path from the root, e.g. ["blocks", 2, "html"]. */
  readonly path: LeafPath;
  /** Stable string form of `path`, used as a React key and map key. */
  readonly id: string;
  /** The English text. */
  readonly text: string;
  /** Human-readable location, e.g. "blocks › 3 › html". */
  readonly label: string;
  /** True for raw HTML strings (journey paragraph blocks); edited as plain text, never rendered. */
  readonly isHtml: boolean;
  /** Longer or multi-line text gets a textarea. */
  readonly multiline: boolean;
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

export class TranslationLeaves {
  static isTextKey(key: string): boolean {
    return !NON_TEXT_KEY.test(key);
  }

  static isTextValue(value: string): boolean {
    return !NON_TEXT_VALUE.some((re) => re.test(value));
  }

  static pathId(path: LeafPath): string {
    return JSON.stringify(path);
  }

  /** Every prose string in `root`, in document order. */
  static collect(root: unknown): ProseLeaf[] {
    const out: ProseLeaf[] = [];
    const push = (path: LeafPath, text: string) => {
      if (!TranslationLeaves.isTextValue(text)) return;
      const last = [...path].reverse().find((p) => typeof p === 'string');
      out.push({
        path,
        id: TranslationLeaves.pathId(path),
        text,
        label: path.map((p) => (typeof p === 'number' ? String(p + 1) : p)).join(' › '),
        isHtml: last === 'html',
        multiline: text.length > 80 || text.includes('\n') || last === 'html',
      });
    };
    const walk = (node: unknown, path: LeafPath) => {
      if (Array.isArray(node)) {
        node.forEach((item, i) => {
          if (typeof item === 'string') push([...path, i], item);
          else walk(item, [...path, i]);
        });
        return;
      }
      if (isPlainObject(node)) {
        for (const [key, value] of Object.entries(node)) {
          if (!TranslationLeaves.isTextKey(key)) continue;
          if (typeof value === 'string') push([...path, key], value);
          else walk(value, [...path, key]);
        }
      }
    };
    walk(root, []);
    return out;
  }

  static get(root: unknown, path: LeafPath): unknown {
    let node: unknown = root;
    for (const part of path) {
      if (typeof part === 'number') {
        if (!Array.isArray(node)) return undefined;
        node = node[part];
      } else {
        if (!isPlainObject(node)) return undefined;
        node = node[part];
      }
    }
    return node;
  }

  /** Mutates `root` in place; containers along the path must already exist. */
  static set(root: unknown, path: LeafPath, value: string): void {
    if (path.length === 0) return;
    const parent = TranslationLeaves.get(root, path.slice(0, -1));
    const last = path[path.length - 1]!;
    if (Array.isArray(parent) && typeof last === 'number') parent[last] = value;
    else if (isPlainObject(parent) && typeof last === 'string') parent[last] = value;
  }

  /**
   * The `fields` payload for a translation save: for each field, the English
   * structure with every prose leaf set to its translation, or emptied when
   * untranslated so it falls back to English. Fields with nothing translated
   * are omitted entirely.
   */
  static buildFields(source: Record<string, unknown>, values: ReadonlyMap<string, string>): Record<string, unknown> {
    const leaves = TranslationLeaves.collect(source);
    const fields: Record<string, unknown> = {};
    for (const [field, english] of Object.entries(source)) {
      if (english === null || english === undefined) continue;
      const own = leaves.filter((l) => l.path[0] === field);
      if (own.length === 0) continue;
      if (typeof english === 'string') {
        const v = values.get(own[0]!.id)?.trim();
        if (v) fields[field] = v;
        continue;
      }
      const clone: unknown = structuredClone(english);
      let any = false;
      for (const leaf of own) {
        const v = values.get(leaf.id)?.trim() ?? '';
        if (v) any = true;
        TranslationLeaves.set(clone, leaf.path.slice(1), v);
      }
      if (any) fields[field] = clone;
    }
    return fields;
  }

  /**
   * Fills a form with a machine-translated draft without discarding work:
   * a leaf takes the draft only where the current value is empty or still
   * the English text. Returns the merged value and how many leaves changed.
   */
  static mergeDraft<T>(current: T, english: unknown, draft: unknown): { value: T; filled: number } {
    let filled = 0;
    const merge = (cur: unknown, en: unknown, dr: unknown): unknown => {
      if (typeof dr === 'string') {
        if (typeof cur !== 'string') return cur === undefined ? dr : cur;
        const untouched = !cur.trim() || (typeof en === 'string' && cur === en);
        if (untouched && dr !== cur) { filled++; return dr; }
        return cur;
      }
      if (Array.isArray(dr)) {
        if (!Array.isArray(cur) || cur.length !== dr.length) {
          if (cur === undefined || (Array.isArray(cur) && cur.length === 0)) { filled += TranslationLeaves.collect(dr).length; return dr; }
          return cur;
        }
        const enArr = Array.isArray(en) ? en : [];
        return cur.map((c, i) => merge(c, enArr[i], dr[i]));
      }
      if (isPlainObject(dr)) {
        if (!isPlainObject(cur)) return cur === undefined ? dr : cur;
        const enObj = isPlainObject(en) ? en : {};
        const out: Record<string, unknown> = { ...cur };
        for (const [key, value] of Object.entries(dr)) {
          if (!TranslationLeaves.isTextKey(key)) continue;
          out[key] = merge(cur[key], enObj[key], value);
        }
        return out;
      }
      return cur === undefined ? dr : cur;
    };
    const value = merge(current, english, draft) as T;
    return { value, filled };
  }
}
