import {
  BUSINESS,
  socialProfileUrls,
  type BusinessIdentity,
} from "../../src/config/business";

/**
 * Builds the site-wide schema.org graph from the business identity config, so
 * the structured data search engines read always matches the visible footer.
 */
export class SiteSchemaBuilder {
  private readonly business: BusinessIdentity;
  private readonly origin: string;

  constructor(business: BusinessIdentity = BUSINESS) {
    this.business = business;
    this.origin = business.siteUrl.replace(/\/+$/, "");
  }

  private get businessId(): string {
    return `${this.origin}/#business`;
  }

  website(): Record<string, unknown> {
    return {
      "@type": "WebSite",
      "@id": `${this.origin}/#website`,
      name: this.business.name,
      alternateName: new URL(this.origin).host,
      url: `${this.origin}/`,
    };
  }

  localBusiness(): Record<string, unknown> {
    const { name, phone, email, address, geo, openingHours, socials } =
      this.business;

    return {
      "@type": ["LocalBusiness", "Electrician"],
      "@id": this.businessId,
      name,
      url: this.origin,
      logo: {
        "@type": "ImageObject",
        url: `${this.origin}/favicon-96x96.png`,
        width: 96,
        height: 96,
      },
      image: `${this.origin}/preview.jpg`,
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
      sameAs: socialProfileUrls(socials),
    };
  }

  solarInstallationService(): Record<string, unknown> {
    return {
      "@type": "Service",
      "@id": `${this.origin}/#solar-installation`,
      name: "Solar Panel Installation",
      serviceType: "Solar Panel Installation",
      provider: { "@id": this.businessId },
      areaServed: [
        { "@type": "AdministrativeArea", name: this.business.address.region },
        { "@type": "Country", name: "Philippines" },
      ],
      description:
        "Professional solar panel installation for residential and commercial properties. We offer hybrid, grid-tie, and off-grid solar systems with full after-sales support.",
      url: `${this.origin}/packages`,
    };
  }

  graph(): Record<string, unknown> {
    return {
      "@context": "https://schema.org",
      "@graph": [
        this.website(),
        this.localBusiness(),
        this.solarInstallationService(),
      ],
    };
  }

  /**
   * JSON for an inline `<script type="application/ld+json">`. JSON.stringify
   * does not escape `<`, so a value containing `</script>` would break out of
   * the tag; `<` is the safe JSON-encoded form and parses identically.
   */
  toInlineJson(): string {
    return JSON.stringify(this.graph()).replace(/</g, "\\u003c");
  }
}
