/**
 * FAQ structured data for the homepage.
 *
 * This lived in the site-wide graph in root.tsx, which emitted it on every
 * page — including the privacy policy, the terms page and every project page,
 * none of which present these questions. Structured data is meant to describe
 * the page it sits on, so it is scoped to the homepage here.
 */

export const FAQ_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "@id": "https://azari.solar/#faq",
  mainEntity: [
        {
          "@type": "Question",
          name: "Does Azari Solar offer installation across the Philippines?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Azari Solar is based in Tagbilaran City, Bohol, and primarily serves Bohol and the Visayas region. We also take on projects nationwide across the Philippines.",
          },
        },
        {
          "@type": "Question",
          name: "What types of solar systems does Azari Solar install?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "We install hybrid solar systems, grid-tied (on-grid) solar systems, and off-grid solar systems for both residential and commercial customers.",
          },
        },
        {
          "@type": "Question",
          name: "How do I get a quote for solar installation in Bohol?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Use our free Solar Savings Calculator at azari.solar/solar-calculator or browse our packages at azari.solar/packages. You can submit an inquiry directly from any package page.",
          },
        },
        {
          "@type": "Question",
          name: "How long does solar installation take?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "A typical residential solar installation takes 1–3 days depending on system size and site conditions. Our team handles everything from design to commissioning.",
          },
        },
        {
          "@type": "Question",
          name: "Do your solar packages include installation?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. All Azari Solar packages are supply-and-install — the quoted price covers the solar equipment and professional installation by our certified technicians.",
          },
        },
  ],
};
