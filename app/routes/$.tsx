import { localizedMeta } from "../lib/i18n-meta";
import { data } from "react-router";
import ASNotFound from "../../src/components/ASNotFound";

export const meta = localizedMeta(() => [
  { title: "Page Not Found — Azari Solar" },
  { name: "robots", content: "noindex" },
]);

export async function loader() {
  return data(null, { status: 404 });
}

export default function CatchAll() {
  return <ASNotFound />;
}
