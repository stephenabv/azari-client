import type { MetaFunction } from "react-router";
import "../../src/assets/styles/contents/as_legal_page.less";
import ASLegalPage from "../../src/pages/ASLegalPage";

export const meta: MetaFunction = () => [
  { title: "Privacy Policy — Azari Solar" },
  {
    name: "description",
    content:
      "How Azari Solar collects, uses, and protects your personal data, in accordance with the Philippine Data Privacy Act of 2012.",
  },
  { name: "robots", content: "index, follow" },
  { tagName: "link", rel: "canonical", href: "https://azari.solar/privacy-policy" },
  { property: "og:type", content: "website" },
  { property: "og:url", content: "https://azari.solar/privacy-policy" },
  { property: "og:title", content: "Privacy Policy — Azari Solar" },
  {
    property: "og:description",
    content: "How Azari Solar collects, uses, and protects your personal data.",
  },
];

export default function PrivacyPolicy() {
  return <ASLegalPage contentKey="privacyPolicy" />;
}
