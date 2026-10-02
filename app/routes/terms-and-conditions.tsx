import type { MetaFunction } from "react-router";
import "../../src/assets/styles/contents/as_legal_page.less";
import ASLegalPage from "../../src/pages/ASLegalPage";

export const meta: MetaFunction = () => [
  { title: "Terms and Conditions — Azari Solar" },
  {
    name: "description",
    content:
      "The terms and conditions governing your use of azari.solar and Azari Solar's quotation, consultation, and installation services.",
  },
  { name: "robots", content: "index, follow" },
  { tagName: "link", rel: "canonical", href: "https://azari.solar/terms-and-conditions" },
  { property: "og:type", content: "website" },
  { property: "og:url", content: "https://azari.solar/terms-and-conditions" },
  { property: "og:title", content: "Terms and Conditions — Azari Solar" },
  {
    property: "og:description",
    content: "The terms and conditions governing your use of azari.solar.",
  },
];

export default function TermsAndConditions() {
  return <ASLegalPage contentKey="termsConditions" />;
}
