import type { ReactNode } from "react";
import { Link } from "react-router";

/** A call to action is either an in-app route or a button handled by the page. */
export type EmptyStateAction =
  | { readonly kind: "link"; readonly label: string; readonly to: string; readonly variant?: "primary" | "secondary" }
  | { readonly kind: "button"; readonly label: string; readonly onClick: () => void; readonly variant?: "primary" | "secondary" };

export interface EmptyStateContent {
  readonly eyebrow?: string;
  readonly title: string;
  readonly message: string;
}

type ASEmptyStateProps = EmptyStateContent & {
  /** Decorative artwork; hidden from assistive tech. */
  illustration: ReactNode;
  actions?: readonly EmptyStateAction[];
  className?: string;
};

function ActionControl({ action }: { action: EmptyStateAction }) {
  const className = `as-empty-state-btn is-${action.variant ?? "secondary"}`;
  return action.kind === "link" ? (
    <Link to={action.to} className={className}>{action.label}</Link>
  ) : (
    <button type="button" className={className} onClick={action.onClick}>{action.label}</button>
  );
}

/**
 * A generic "nothing here yet" panel: artwork, a short message and optional
 * calls to action. Pages supply the copy and artwork so the same layout can
 * serve any empty list.
 */
export default function ASEmptyState({ eyebrow, title, message, illustration, actions = [], className }: ASEmptyStateProps) {
  return (
    <section className={`as-empty-state${className ? ` ${className}` : ""}`} aria-labelledby="as-empty-state-title">
      <div className="as-empty-state-art" aria-hidden="true">{illustration}</div>
      <div className="as-empty-state-body">
        {eyebrow && <p className="as-empty-state-eyebrow">{eyebrow}</p>}
        <h2 id="as-empty-state-title" className="as-empty-state-title">{title}</h2>
        <p className="as-empty-state-message">{message}</p>
        {actions.length > 0 && (
          <div className="as-empty-state-actions">
            {actions.map((a) => <ActionControl key={a.label} action={a} />)}
          </div>
        )}
      </div>
    </section>
  );
}
