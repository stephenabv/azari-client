import { FAQ_ITEMS, type FaqItem } from "../content/faq";

type ASFaqProps = {
  items?: readonly FaqItem[];
  /** id of the heading, for the surrounding section's aria-labelledby. */
  headingId?: string;
};

/**
 * The home page FAQ as native <details>/<summary> disclosures: keyboard and
 * screen-reader accessible without script, and every answer is in the server
 * HTML. The same items feed the page's FAQPage structured data.
 */
export default function ASFaq({ items = FAQ_ITEMS, headingId = "faq-title" }: ASFaqProps) {
  return (
    <div className="as-faq">
      <h2 className="as-faq-title" id={headingId}>
        Frequently Asked <span>Questions</span>
      </h2>

      <div className="as-faq-list">
        {items.map((item) => (
          <details key={item.id} id={`faq-${item.id}`} className="as-faq-item">
            <summary className="as-faq-question">{item.question}</summary>
            <p className="as-faq-answer">{item.answer}</p>
          </details>
        ))}
      </div>
    </div>
  );
}
