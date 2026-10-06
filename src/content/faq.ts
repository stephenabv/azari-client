/**
 * Frequently asked questions on the home page.
 *
 * One list feeds both the visible FAQ section and its FAQPage structured
 * data, so the two cannot drift apart (search engines require structured
 * data to match what the page shows). Add, edit or reorder entries here.
 */

export interface FaqItem {
  /** Stable, URL-safe id; also the anchor of the entry on the page. */
  readonly id: string;
  readonly question: string;
  readonly answer: string;
}

export const FAQ_ITEMS: readonly FaqItem[] = Object.freeze([
  {
    id: "service-area",
    question: "Does Azari Solar offer installation across the Philippines?",
    answer:
      "Azari Solar is based in Tagbilaran City, Bohol, and primarily serves Bohol and the Visayas region. We also take on projects nationwide across the Philippines.",
  },
  {
    id: "system-types",
    question: "What types of solar systems does Azari Solar install?",
    answer:
      "We install hybrid solar systems, grid-tied (on-grid) solar systems, and off-grid solar systems for both residential and commercial customers.",
  },
  {
    id: "get-a-quote",
    question: "How do I get a quote for solar installation in Bohol?",
    answer:
      "Use our free Solar Savings Calculator at azari.solar/solar-calculator or browse our packages at azari.solar/packages. You can submit an inquiry directly from any package page.",
  },
  {
    id: "installation-time",
    question: "How long does solar installation take?",
    answer:
      "A typical residential solar installation takes 1–3 days depending on system size and site conditions. Our team handles everything from design to commissioning.",
  },
  {
    id: "installation-included",
    question: "Do your solar packages include installation?",
    answer:
      "Yes. All Azari Solar packages are supply-and-install — the quoted price covers the solar equipment and professional installation by our certified technicians.",
  },
]);
