import { localizedMeta } from "../lib/i18n-meta";
import "../../src/assets/styles/contents/as_legal_page.less";
import ASLegalPage from "../../src/pages/ASLegalPage";

export const meta = localizedMeta((_args, t) => [
  { title: t("system.meta.privacyPolicy.title") },
  {
    name: "description",
    content: t("system.meta.privacyPolicy.description"),
  },
  { name: "robots", content: "index, follow" },
  { tagName: "link", rel: "canonical", href: "https://azari.solar/privacy-policy" },
  { property: "og:type", content: "website" },
  { property: "og:url", content: "https://azari.solar/privacy-policy" },
  { property: "og:title", content: t("system.meta.privacyPolicy.title") },
  {
    property: "og:description",
    content: t("system.meta.privacyPolicy.shareDescription"),
  },
]);

export default function PrivacyPolicy() {
  return <ASLegalPage contentKey="privacyPolicy" />;
}
