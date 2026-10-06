import { socialProfileUrls } from "../../../src/config/business";
import { JsonLdGraph, SchemaBuilder, SchemaContext, type JsonLdNode } from "./json-ld";

/**
 * Site-wide structured data, emitted on every page by the root layout. All
 * business facts come from src/config/business.ts, so the JSON-LD always
 * matches the footer and the `tel:` links.
 */

export class WebSiteSchema extends SchemaBuilder {
  build(): JsonLdNode {
    const { origin, business } = this.context;
    return {
      "@type": "WebSite",
      "@id": this.context.websiteRef["@id"],
      name: business.name,
      alternateName: new URL(origin).host,
      url: this.context.url("/"),
      publisher: this.context.businessRef,
    };
  }
}

export class LocalBusinessSchema extends SchemaBuilder {
  build(): JsonLdNode {
    const { origin, business } = this.context;
    const { name, phone, email, address, geo, openingHours, socials } = business;

    return {
      "@type": ["LocalBusiness", "Electrician"],
      "@id": this.context.businessRef["@id"],
      name,
      url: origin,
      logo: {
        "@type": "ImageObject",
        url: this.context.url("/favicon-96x96.png"),
        width: 96,
        height: 96,
      },
      image: this.context.url("/preview.jpg"),
      description:
        "Azari Solar installs affordable solar panel systems for residential and commercial properties in Bohol and across the Philippines.",
      telephone: phone.e164,
      email: email.address,
      address: {
        "@type": "PostalAddress",
        addressLocality: address.locality,
        addressRegion: address.region,
        addressCountry: address.country,
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: geo.latitude,
        longitude: geo.longitude,
      },
      areaServed: [
        { "@type": "City", name: address.locality },
        { "@type": "AdministrativeArea", name: address.region },
        { "@type": "AdministrativeArea", name: "Visayas" },
        { "@type": "Country", name: "Philippines" },
      ],
      openingHoursSpecification: openingHours.map((hours) => ({
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [...hours.days],
        opens: hours.opens,
        closes: hours.closes,
      })),
      priceRange: "₱₱",
      currenciesAccepted: "PHP",
      paymentAccepted: "Cash, Bank Transfer, GCash",
      // Only real profile URLs, never a network's home page.
      sameAs: socialProfileUrls(socials),
    };
  }
}

export interface ServiceDefinition {
  /** `@id` fragment, e.g. "solar-installation". */
  readonly fragment: string;
  readonly name: string;
  readonly serviceType: string;
  readonly description: string;
  /** Site path of the page that offers the service. */
  readonly path: string;
}

export class ServiceSchema extends SchemaBuilder {
  private readonly service: ServiceDefinition;

  constructor(service: ServiceDefinition, context?: SchemaContext) {
    super(context);
    this.service = service;
  }

  build(): JsonLdNode {
    const { fragment, name, serviceType, description, path } = this.service;
    return {
      "@type": "Service",
      "@id": this.context.nodeId(fragment),
      name,
      serviceType,
      provider: this.context.businessRef,
      areaServed: [
        { "@type": "AdministrativeArea", name: this.context.business.address.region },
        { "@type": "Country", name: "Philippines" },
      ],
      description,
      url: this.context.url(path),
    };
  }
}

/** The services the business offers. Add an entry to publish another one. */
export const SITE_SERVICES: readonly ServiceDefinition[] = Object.freeze([
  {
    fragment: "solar-installation",
    name: "Solar Panel Installation",
    serviceType: "Solar Panel Installation",
    description:
      "Professional solar panel installation for residential and commercial properties. We offer hybrid, grid-tie, and off-grid solar systems with full after-sales support.",
    path: "/packages",
  },
]);

/** The graph the root layout embeds on every page. */
export function siteSchemaGraph(context: SchemaContext = SchemaContext.default): JsonLdGraph {
  return new JsonLdGraph([
    new WebSiteSchema(context),
    new LocalBusinessSchema(context),
    ...SITE_SERVICES.map((service) => new ServiceSchema(service, context)),
  ]);
}
