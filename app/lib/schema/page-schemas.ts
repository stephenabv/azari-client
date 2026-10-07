import type { FaqItem } from "../../../src/models/faq";
import { projectPath } from "../../../src/lib/projectPaths";
import type { ApiProject } from "../../../src/services/ASContent";
import { ProjectSeo } from "../project-seo";
import { SITE_PREVIEW_IMAGE, socialImageUrl } from "../seo";
import { SchemaBuilder, SchemaContext, type JsonLdNode } from "./json-ld";

/** Structured data that describes one page rather than the whole site. */

export class FaqPageSchema extends SchemaBuilder {
  private readonly items: readonly FaqItem[];
  private readonly path: string;

  constructor(items: readonly FaqItem[], path = "/", context?: SchemaContext) {
    super(context);
    this.items = items;
    this.path = path;
  }

  build(): JsonLdNode {
    return {
      "@type": "FAQPage",
      "@id": this.context.nodeId("faq", this.path),
      mainEntity: this.items.map(({ question, answer }) => ({
        "@type": "Question",
        name: question,
        acceptedAnswer: { "@type": "Answer", text: answer },
      })),
    };
  }
}

export interface Crumb {
  readonly name: string;
  /** Site path, e.g. "/projects". */
  readonly path: string;
}

export class BreadcrumbListSchema extends SchemaBuilder {
  private readonly trail: readonly Crumb[];

  constructor(trail: readonly Crumb[], context?: SchemaContext) {
    super(context);
    if (trail.length === 0) throw new Error("BreadcrumbListSchema: the trail is empty");
    this.trail = trail;
  }

  build(): JsonLdNode {
    const page = this.trail[this.trail.length - 1];
    return {
      "@type": "BreadcrumbList",
      "@id": this.context.nodeId("breadcrumb", page?.path),
      itemListElement: this.trail.map((crumb, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: crumb.name,
        item: this.context.url(crumb.path),
      })),
    };
  }
}

export type ProjectSchemaSource = Pick<
  ApiProject,
  | "id"
  | "slug"
  | "title"
  | "subtitle"
  | "category"
  | "system"
  | "savings"
  | "productionKwp"
  | "imageUrl"
  | "createdAt"
  | "updatedAt"
>;

/** A completed installation, published as a CreativeWork by the business. */
export class ProjectSchema extends SchemaBuilder {
  private readonly project: ProjectSchemaSource;

  constructor(project: ProjectSchemaSource, context?: SchemaContext) {
    super(context);
    this.project = project;
  }

  get breadcrumbTrail(): readonly Crumb[] {
    return [
      { name: "Home", path: "/" },
      { name: "Projects", path: "/projects" },
      { name: this.project.title.trim(), path: projectPath(this.project) },
    ];
  }

  build(): JsonLdNode {
    const { title, createdAt, updatedAt, imageUrl } = this.project;
    const path = projectPath(this.project);
    const url = this.context.url(path);
    const image = socialImageUrl(imageUrl);

    return {
      "@type": "CreativeWork",
      "@id": this.context.nodeId("project", path),
      name: title.trim(),
      description: new ProjectSeo(this.project).description(),
      url,
      mainEntityOfPage: url,
      // The site-wide preview card is not a picture of this project.
      image: image === SITE_PREVIEW_IMAGE ? undefined : image,
      dateCreated: createdAt,
      dateModified: updatedAt,
      creator: this.context.businessRef,
      publisher: this.context.businessRef,
      isPartOf: this.context.websiteRef,
      breadcrumb: { "@id": this.context.nodeId("breadcrumb", path) },
    };
  }
}
