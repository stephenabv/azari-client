import type { MetaFunction } from "react-router";
import ASAdmin from "../../src/pages/ASAdmin";

export const meta: MetaFunction = () => [
  { title: "Admin — Azari Solar" },
  { name: "robots", content: "noindex, nofollow" },
];

export default function Admin() {
  return <ASAdmin />;
}
