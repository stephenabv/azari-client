/**
 * Crawlability audit for every URL in the sitemap.
 *
 *   node scripts/audit-sitemap.ts                       # production
 *   node scripts/audit-sitemap.ts --base http://127.0.0.1:8080
 *
 * For each sitemap URL it asserts: 200 with no redirect, a self-referencing
 * canonical, exactly one <h1>, and a title and meta description that no other
 * sitemap page uses. For every URL except the root it also asserts that the
 * trailing-slash variant answers 301 with a Location of the slash-free URL.
 *
 * --base points the requests somewhere else (e.g. a local nginx in front of a
 * production build) while the sitemap and canonicals keep naming the real
 * origin, set with --origin. Exits 1 if any check fails.
 *
 * Runs on Node 22.18+ with built-in TypeScript type stripping; no dependencies.
 */

type Options = { base: string; origin: string; concurrency: number };

type PageSnapshot = {
  url: string;
  status: number;
  location: string | null;
  canonical: string | null;
  h1Count: number;
  title: string | null;
  description: string | null;
};

type Failure = { url: string; check: string; detail: string };

interface PageCheck {
  readonly name: string;
  /** Returns a failure detail, or null when the page passes. */
  run(page: PageSnapshot): string | null;
}

class StatusOkCheck implements PageCheck {
  readonly name = "200 without redirect";
  run(page: PageSnapshot): string | null {
    if (page.status === 200) return null;
    return `status ${page.status}${page.location ? ` → ${page.location}` : ""}`;
  }
}

class SelfCanonicalCheck implements PageCheck {
  readonly name = "self-referencing canonical";
  run(page: PageSnapshot): string | null {
    if (page.canonical === page.url) return null;
    return `canonical is ${page.canonical ?? "missing"}`;
  }
}

class SingleH1Check implements PageCheck {
  readonly name = "exactly one <h1>";
  run(page: PageSnapshot): string | null {
    return page.h1Count === 1 ? null : `found ${page.h1Count}`;
  }
}

class PresentCheck implements PageCheck {
  readonly name: string;
  private readonly field: "title" | "description";
  constructor(field: "title" | "description") {
    this.field = field;
    this.name = `has ${field}`;
  }
  run(page: PageSnapshot): string | null {
    return page[this.field] ? null : "missing";
  }
}

/** Checks that compare pages with each other rather than one at a time. */
class UniqueFieldCheck {
  readonly name: string;
  private readonly field: "title" | "description";
  constructor(field: "title" | "description") {
    this.field = field;
    this.name = `unique ${field}`;
  }
  run(pages: readonly PageSnapshot[]): Failure[] {
    const byValue = new Map<string, string[]>();
    for (const page of pages) {
      const value = page[this.field];
      if (!value) continue;
      byValue.set(value, [...(byValue.get(value) ?? []), page.url]);
    }
    return [...byValue.values()]
      .filter((urls) => urls.length > 1)
      .flatMap((urls) =>
        urls.map((url) => ({ url, check: this.name, detail: `shared with ${urls.filter((u) => u !== url).join(", ")}` })),
      );
  }
}

class HtmlInspector {
  private readonly html: string;
  constructor(html: string) {
    this.html = html;
  }

  private static decode(text: string): string {
    return text
      .replace(/&quot;/g, '"')
      .replace(/&#x27;|&#39;/g, "'")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&amp;/g, "&")
      .trim();
  }

  private attr(tag: string, name: string): string | null {
    const match = new RegExp(`\\s${name}="([^"]*)"`, "i").exec(tag);
    return match?.[1] != null ? HtmlInspector.decode(match[1]) : null;
  }

  private tags(name: string): string[] {
    return this.html.match(new RegExp(`<${name}\\b[^>]*>`, "gi")) ?? [];
  }

  canonical(): string | null {
    const tag = this.tags("link").find((t) => /\srel="canonical"/i.test(t));
    return tag ? this.attr(tag, "href") : null;
  }

  description(): string | null {
    const tag = this.tags("meta").find((t) => /\sname="description"/i.test(t));
    return tag ? this.attr(tag, "content") : null;
  }

  title(): string | null {
    const match = /<title[^>]*>([\s\S]*?)<\/title>/i.exec(this.html);
    return match?.[1] != null ? HtmlInspector.decode(match[1]) : null;
  }

  h1Count(): number {
    return this.tags("h1").length;
  }
}

class SiteAuditor {
  private readonly options: Options;
  private readonly pageChecks: readonly PageCheck[] = [
    new StatusOkCheck(),
    new SelfCanonicalCheck(),
    new SingleH1Check(),
    new PresentCheck("title"),
    new PresentCheck("description"),
  ];
  private readonly crossChecks = [new UniqueFieldCheck("title"), new UniqueFieldCheck("description")];

  constructor(options: Options) {
    this.options = options;
  }

  /** Where to send a request for a canonical URL. */
  private requestUrl(canonicalUrl: string): string {
    return canonicalUrl.startsWith(this.options.origin)
      ? `${this.options.base}${canonicalUrl.slice(this.options.origin.length)}`
      : canonicalUrl;
  }

  private async fetchManual(url: string): Promise<Response> {
    return fetch(url, { redirect: "manual", headers: { "User-Agent": "azari-sitemap-audit/1.0" } });
  }

  async sitemapUrls(): Promise<string[]> {
    const res = await this.fetchManual(`${this.options.base}/sitemap.xml`);
    if (res.status !== 200) throw new Error(`sitemap.xml answered ${res.status}`);
    const xml = await res.text();
    return [...xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)].map((m) => (m[1] ?? "").replace(/&amp;/g, "&"));
  }

  async snapshot(url: string): Promise<PageSnapshot> {
    const res = await this.fetchManual(this.requestUrl(url));
    const html = res.status === 200 ? await res.text() : "";
    const doc = new HtmlInspector(html);
    return {
      url,
      status: res.status,
      location: res.headers.get("location"),
      canonical: doc.canonical(),
      h1Count: doc.h1Count(),
      title: doc.title(),
      description: doc.description(),
    };
  }

  /** The trailing-slash form must 301 to the canonical, slash-free URL. */
  async checkSlashVariant(url: string): Promise<Failure | null> {
    if (new URL(url).pathname === "/") return null;
    const res = await this.fetchManual(this.requestUrl(`${url}/`));
    const location = res.headers.get("location");
    const target = location ? new URL(location, this.options.origin).href : null;
    if (res.status === 301 && target === url) return null;
    return {
      url: `${url}/`,
      check: "slash variant 301s to canonical",
      detail: `status ${res.status}, location ${location ?? "none"}`,
    };
  }

  private async inBatches<T, R>(items: readonly T[], fn: (item: T) => Promise<R>): Promise<R[]> {
    const results: R[] = [];
    for (let i = 0; i < items.length; i += this.options.concurrency) {
      results.push(...(await Promise.all(items.slice(i, i + this.options.concurrency).map(fn))));
    }
    return results;
  }

  async run(): Promise<{ urls: string[]; failures: Failure[] }> {
    const urls = await this.sitemapUrls();
    const failures: Failure[] = [];

    const pages = await this.inBatches(urls, (url) => this.snapshot(url));
    for (const page of pages) {
      for (const check of this.pageChecks) {
        const detail = check.run(page);
        if (detail) failures.push({ url: page.url, check: check.name, detail });
      }
    }
    for (const check of this.crossChecks) failures.push(...check.run(pages));

    const slashFailures = await this.inBatches(urls, (url) => this.checkSlashVariant(url));
    failures.push(...slashFailures.filter((f): f is Failure => f !== null));

    return { urls, failures };
  }
}

function parseOptions(argv: readonly string[]): Options {
  const value = (flag: string): string | undefined => {
    const i = argv.indexOf(flag);
    return i >= 0 ? argv[i + 1] : undefined;
  };
  const origin = (value("--origin") ?? "https://azari.solar").replace(/\/+$/, "");
  const base = (value("--base") ?? origin).replace(/\/+$/, "");
  const concurrency = Number(value("--concurrency") ?? 4);
  for (const url of [origin, base]) {
    if (!/^https?:\/\/[^/]+$/.test(url)) throw new Error(`Not an origin: ${url}`);
  }
  if (!Number.isInteger(concurrency) || concurrency < 1 || concurrency > 16) {
    throw new Error("--concurrency must be an integer from 1 to 16");
  }
  return { base, origin, concurrency };
}

async function main(): Promise<void> {
  const options = parseOptions(process.argv.slice(2));
  const { urls, failures } = await new SiteAuditor(options).run();

  console.log(`Audited ${urls.length} sitemap URLs (requests to ${options.base}).`);
  if (failures.length === 0) {
    console.log("All checks passed.");
    return;
  }
  console.log(`${failures.length} failure(s):`);
  for (const f of failures) console.log(`  ✗ ${f.url}  [${f.check}]  ${f.detail}`);
  process.exitCode = 1;
}

main().catch((err: unknown) => {
  console.error(err instanceof Error ? err.message : err);
  process.exitCode = 1;
});
