import type { MetaFunction } from "react-router";
import "../../src/assets/styles/contents/as_coming_soon.less";
import "../../src/assets/styles/contents/as_dashboard_page.less";
import "../../src/assets/styles/contents/as_admin.less";
import "../../src/assets/styles/contents/as_project_detail.less";
import ASAdmin from "../../src/pages/ASAdmin";

export const meta: MetaFunction = () => [
  { title: "Admin — Azari Solar" },
  { name: "robots", content: "noindex, nofollow" },
];

export default function Admin() {
  return <ASAdmin />;
}
