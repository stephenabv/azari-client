import type { ApiProject } from "../../src/services/ASContent";

type ProjectSeoSource = Pick<
  ApiProject,
  "title" | "subtitle" | "category" | "system" | "savings" | "productionKwp"
>;

const DESCRIPTION_MAX = 160;

function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max - 1);
  return `${cut.slice(0, cut.lastIndexOf(" ")).replace(/[\s,.;:–—-]+$/, "")}…`;
}

/**
 * Title and description for a project page, built only from the project's
 * own data. Several projects can share a title ("Primary Homes - Dauis,
 * Bohol"), so the system size and the project facts are part of both strings
 * to keep each page's snippet distinct.
 */
export class ProjectSeo {
  constructor(private readonly project: ProjectSeoSource) {}

  title(): string {
    const { title, productionKwp } = this.project;
    const size = productionKwp ? ` · ${productionKwp} kWp` : "";
    return `${title.trim()}${size} | Azari Solar`;
  }

  description(): string {
    const { subtitle, title, category, system, savings } = this.project;
    const lead = subtitle?.trim() || `${category} solar installation by Azari Solar: ${title.trim()}`;
    const facts = [system?.trim() && `System: ${system.trim()}`, savings?.trim() && `Savings: ${savings.trim()}`]
      .filter(Boolean)
      .join(". ");
    const text = facts ? `${lead.replace(/[.\s]+$/, "")}. ${facts}.` : lead;
    return truncate(text, DESCRIPTION_MAX);
  }
}
