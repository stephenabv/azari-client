import { BUSINESS, type BusinessIdentity } from "../../../src/config/business";

/**
 * Core types and base class for schema.org structured data. Each kind of
 * entity (the business, the website, a service, a project, a breadcrumb
 * trail) is a SchemaBuilder subclass that turns typed input into one JSON-LD
 * node; a JsonLdGraph combines nodes into the document a page embeds.
 *
 * This module is imported by route `meta` functions, which also run in the
 * browser, so it must stay free of server-only APIs.
 */

export type JsonLdPrimitive = string | number | boolean;
export type JsonLdValue = JsonLdPrimitive | JsonLdObject | readonly JsonLdValue[];

export interface JsonLdObject {
  readonly [key: string]: JsonLdValue | undefined;
}

export interface JsonLdNode extends JsonLdObject {
  readonly "@type": string | readonly string[];
  readonly "@id"?: string;
}

/** A pointer to a node defined elsewhere in the graph. */
export type JsonLdReference = { readonly "@id": string };

/**
 * Site facts every builder needs: the canonical origin, the business
 * identity, and the `@id`s of the shared nodes, so pages can reference the
 * business and website instead of repeating them.
 */
export class SchemaContext {
  static readonly default = new SchemaContext();

  readonly business: BusinessIdentity;
  readonly origin: string;

  constructor(business: BusinessIdentity = BUSINESS) {
    this.business = business;
    this.origin = business.siteUrl.replace(/\/+$/, "");
  }

  /** Absolute URL of a site path, slash-free except for the root. */
  url(path: string): string {
    const clean = path === "/" ? "/" : `/${path.replace(/^\/+|\/+$/g, "")}`;
    return `${this.origin}${clean}`;
  }

  /** `@id` of a node that lives on a given page. */
  nodeId(fragment: string, path = "/"): string {
    return `${this.url(path)}#${fragment}`;
  }

  get businessRef(): JsonLdReference {
    return { "@id": this.nodeId("business") };
  }

  get websiteRef(): JsonLdReference {
    return { "@id": this.nodeId("website") };
  }
}

export abstract class SchemaBuilder<TNode extends JsonLdNode = JsonLdNode> {
  protected readonly context: SchemaContext;

  constructor(context: SchemaContext = SchemaContext.default) {
    this.context = context;
  }

  abstract build(): TNode;
}

/** The JSON-LD document a page embeds: one `@graph` of builder nodes. */
export class JsonLdGraph {
  private readonly builders: readonly SchemaBuilder[];

  constructor(builders: readonly SchemaBuilder[]) {
    this.builders = builders;
  }

  toObject(): JsonLdObject {
    return {
      "@context": "https://schema.org",
      "@graph": this.builders.map((builder) => builder.build()),
    };
  }

  /**
   * JSON for an inline `<script type="application/ld+json">`. JSON.stringify
   * does not escape `<`, so a value containing `</script>` would break out of
   * the tag; `<` is the safe JSON-encoded form and parses identically.
   */
  toInlineJson(): string {
    return JSON.stringify(this.toObject()).replace(/</g, "\\u003c");
  }
}
