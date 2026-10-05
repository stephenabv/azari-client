import type { ApiProject } from "../services/ASContent";

/** The canonical, slug-based path of a project page. */
export function projectPath(project: Pick<ApiProject, "id" | "slug">): string {
  return `/projects/${encodeURIComponent(project.slug || project.id)}`;
}
