import type { MetaFunction } from "react-router";
import ASNotFound from "../../src/components/ASNotFound";

export const meta: MetaFunction = () => [
  { title: "Page Not Found — Azari Solar" },
  { name: "robots", content: "noindex" },
];

export default function CatchAll() {
  return <ASNotFound />;
}
