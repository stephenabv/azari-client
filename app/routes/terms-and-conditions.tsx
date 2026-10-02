import { localizedMeta } from "../lib/i18n-meta";
import "../../src/assets/styles/contents/as_legal_page.less";
import ASLegalPage from "../../src/pages/ASLegalPage";

export const meta = localizedMeta((_args, t) => [
  { title: t("system.meta.termsConditions.title") },
  {
    name: "description",
    content: t("system.meta.termsConditions.description"),
  },
  { name: "robots", content: "index, follow" },
  { tagName: "link", rel: "canonical", href: "https://azari.solar/terms-and-conditions" },
  { property: "og:type", content: "website" },
  { property: "og:url", content: "https://azari.solar/terms-and-conditions" },
  { property: "og:title", content: t("system.meta.termsConditions.title") },
  {
    property: "og:description",
    content: t("system.meta.termsConditions.shareDescription"),
  },
]);

export default function TermsAndConditions() {
  return <ASLegalPage contentKey="termsConditions" />;
}
