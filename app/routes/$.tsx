import { localizedMeta } from "../lib/i18n-meta";
import { data } from "react-router";
import ASNotFound from "../../src/components/ASNotFound";

export const meta = localizedMeta((_args, t) => [
  { title: t("system.meta.notFound.title") },
  { name: "robots", content: "noindex" },
]);

export async function loader() {
  return data(null, { status: 404 });
}

export default function CatchAll() {
  return <ASNotFound />;
}
