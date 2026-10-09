/** Shape of the `privacyPolicy` and `termsConditions` CMS entries. */
export type LegalSection = { heading: string; body: string };

export type LegalContent = {
  title: string;
  effectiveDate: string;
  lastUpdated: string;
  intro: string;
  sections: LegalSection[];
};

export type LegalDisclaimer = { enabled: boolean; text: string };

export const EMPTY_LEGAL: LegalContent = {
  title: "",
  effectiveDate: "",
  lastUpdated: "",
  intro: "",
  sections: [],
};

export const DEFAULT_DISCLAIMER: LegalDisclaimer = { enabled: false, text: "" };
