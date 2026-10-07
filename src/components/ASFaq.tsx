import type { CSSProperties } from "react";
import { useRevealOnScroll } from "../hooks/useRevealOnScroll";
import type { FaqItem } from "../models/faq";

type ASFaqProps = {
  items: readonly FaqItem[];
  /** id of the heading, for the surrounding section's aria-labelledby. */
  headingId?: string;
};

/** Answers are plain text; blank lines separate paragraphs. */
function paragraphs(answer: string): string[] {
  return answer.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);
}

/**
 * The home page FAQ as native <details>/<summary> disclosures: keyboard and
 * screen-reader accessible without script, and every answer is in the server
 * HTML. The same items feed the page's FAQPage structured data.
 *
 * Entries slide in one after another when the list scrolls into view, and
 * answers expand and collapse smoothly (see as_faq.less). Both are skipped
 * for visitors who prefer reduced motion. Renders nothing when there are no
 * entries.
 */
export default function ASFaq({ items, headingId = "faq-title" }: ASFaqProps) {
  const { ref, state } = useRevealOnScroll<HTMLDivElement>();

  if (items.length === 0) return null;

  return (
    <div className="as-faq" ref={ref} data-reveal={state}>
      <h2 className="as-faq-title" id={headingId}>
        Frequently Asked <span>Questions</span>
      </h2>

      <div className="as-faq-list">
        {items.map((item, index) => (
          <details
            key={item.id}
            id={`faq-${item.id}`}
            className="as-faq-item"
            style={{ "--faq-index": index } as CSSProperties}
          >
            <summary className="as-faq-question">{item.question}</summary>
            <div className="as-faq-answer">
              {paragraphs(item.answer).map((text, i) => (
                <p key={i}>{text}</p>
              ))}
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
