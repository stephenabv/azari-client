/**
 * Single source of truth for Azari Solar's business identity (name, contact,
 * address, geo, hours and social profiles).
 *
 * The footer, the site-wide JSON-LD and every `tel:` / `mailto:` link read from
 * here, so NAP (name, address, phone) data cannot drift between what visitors
 * see and what search engines index. Change a value here and every consumer
 * follows. This module is imported by both the SSR shell (`app/`) and client
 * components (`src/`), so it must stay free of browser- and server-only APIs.
 */

/** Days as named by schema.org `DayOfWeek`. */
export type DayOfWeek =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
  | "Sunday";

export const ALL_DAYS: readonly DayOfWeek[] = Object.freeze([
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
]);

/** 24-hour `HH:MM` local time. */
export type TimeOfDay = `${number}${number}:${number}${number}`;

export interface OpeningHours {
  readonly days: readonly DayOfWeek[];
  readonly opens: TimeOfDay;
  readonly closes: TimeOfDay;
}

export interface PostalAddress {
  readonly locality: string;
  readonly region: string;
  /** ISO 3166-1 alpha-2 country code. */
  readonly country: string;
  /** ISO 3166-2 subdivision code, used for the `geo.region` meta tag. */
  readonly regionCode: string;
}

export interface GeoCoordinates {
  readonly latitude: number;
  readonly longitude: number;
}

export interface SocialProfile {
  /** Stable key, kept identical to the footer CMS keys. */
  readonly key: string;
  readonly name: string;
  readonly url: string;
}

/**
 * A phone number held in E.164 form (for `tel:` hrefs and structured data)
 * alongside its human-readable display form. Construction fails fast if the
 * two forms disagree, so a typo in either one cannot ship.
 */
export class PhoneNumber {
  private static readonly E164 = /^\+[1-9]\d{7,14}$/;

  readonly e164: string;
  readonly display: string;

  constructor(e164: string, display: string) {
    if (!PhoneNumber.E164.test(e164)) {
      throw new Error(`PhoneNumber: "${e164}" is not a valid E.164 number`);
    }
    if (PhoneNumber.digitsOf(display) !== PhoneNumber.digitsOf(e164)) {
      throw new Error(
        `PhoneNumber: display "${display}" does not match E.164 "${e164}"`
      );
    }
    this.e164 = e164;
    this.display = display;
    Object.freeze(this);
  }

  /** RFC 3966 URI for anchor hrefs. */
  get telHref(): string {
    return `tel:${this.e164}`;
  }

  toString(): string {
    return this.display;
  }

  private static digitsOf(value: string): string {
    return value.replace(/\D/g, "");
  }
}

/** A contact email address with its `mailto:` href. */
export class EmailAddress {
  private static readonly PATTERN = /^[^\s@<>"]+@[^\s@<>"]+\.[^\s@<>"]+$/;

  readonly address: string;

  constructor(address: string) {
    if (!EmailAddress.PATTERN.test(address)) {
      throw new Error(`EmailAddress: "${address}" is not a valid address`);
    }
    this.address = address;
    Object.freeze(this);
  }

  get mailtoHref(): string {
    return `mailto:${this.address}`;
  }

  toString(): string {
    return this.address;
  }
}

export interface BusinessIdentity {
  readonly name: string;
  readonly siteUrl: string;
  readonly phone: PhoneNumber;
  readonly email: EmailAddress;
  readonly address: PostalAddress;
  readonly geo: GeoCoordinates;
  readonly openingHours: readonly OpeningHours[];
  readonly socials: readonly SocialProfile[];
}

export const BUSINESS: BusinessIdentity = Object.freeze({
  name: "Azari Solar",
  siteUrl: "https://azari.solar",
  phone: new PhoneNumber("+639616183465", "+63 961 618 3465"),
  email: new EmailAddress("sales@azari.solar"),
  address: Object.freeze({
    locality: "Tagbilaran City",
    region: "Bohol",
    country: "PH",
    regionCode: "PH-BOH",
  }),
  geo: Object.freeze({ latitude: 9.6571, longitude: 123.8543 }),
  // Open 24/7.
  openingHours: Object.freeze([
    Object.freeze({ days: ALL_DAYS, opens: "00:00", closes: "23:59" } as const),
  ]),
  // TODO(owner): replace each url with the real Azari Solar profile page
  // (e.g. https://www.facebook.com/<page>). These are the networks' home pages,
  // so the footer links go nowhere useful and schema.org `sameAs` stays empty
  // (socialProfileUrls() skips any URL without a profile path).
  socials: Object.freeze([
    { key: "facebook", name: "Facebook", url: "https://www.facebook.com" },
    { key: "Instagram", name: "Instagram", url: "https://www.instagram.com" },
    { key: "TikTok", name: "TikTok", url: "https://www.tiktok.com" },
  ]),
});

/**
 * Social URLs that point at an actual profile rather than a network's home
 * page. Only these are safe to publish as schema.org `sameAs`.
 */
export function socialProfileUrls(
  socials: readonly SocialProfile[] = BUSINESS.socials
): string[] {
  return socials
    .map((s) => s.url)
    .filter((url) => {
      try {
        const { protocol, pathname } = new URL(url);
        return protocol === "https:" && pathname.replace(/\/+$/, "") !== "";
      } catch {
        return false;
      }
    });
}
