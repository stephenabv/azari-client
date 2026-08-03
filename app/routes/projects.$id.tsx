import type { LoaderFunctionArgs, MetaFunction } from "react-router";
import "../../src/assets/styles/contents/as_project_detail.less";
import ASProjectDetails from "../../src/pages/ASProjectDetail";

const API_BASE = process.env["API_URL"] ?? "http://localhost:4000";

export async function loader({ params }: LoaderFunctionArgs) {
  try {
    const res = await fetch(`${API_BASE}/api/projects/${params["id"]}`, {
      headers: { Accept: "application/json" },
    });
    if (!res.ok) return null;
    const json = (await res.json()) as { data?: Record<string, unknown> };
    return json.data ?? null;
  } catch {
    return null;
  }
}

export const meta: MetaFunction<typeof loader> = ({ data, params }) => {
  if (!data) {
    return [
      { title: "Project Not Found — Azari Solar" },
      { name: "robots", content: "noindex" },
    ];
  }

  const project = data as {
    title?: string;
    subtitle?: string;
    imageUrl?: string;
    category?: string;
  };

  const title = `${project.title ?? "Solar Project"} — Azari Solar`;
  const description =
    project.subtitle ??
    `${project.title ?? "Solar project"} by Azari Solar in Bohol, Philippines.`;
  const url = `https://azari.solar/projects/${params["id"]}`;
  const image = project.imageUrl ?? "https://azari.solar/preview.jpg";

  return [
    { title },
    { name: "description", content: description },
    { name: "robots", content: "index, follow" },
    { tagName: "link", rel: "canonical", href: url },
    { property: "og:type", content: "article" },
    { property: "og:url", content: url },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:image", content: image },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: image },
  ];
};

export default function ProjectDetail() {
  return <ASProjectDetails />;
}
