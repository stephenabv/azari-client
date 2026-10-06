import { lazy, Suspense } from "react";
import { useContent } from "../hooks/useContent";
import ASBenefitsBanner from "../components/ASBenefits";
import ASCallToAction from "../components/ASCallToAction";
import ASEngineeredExcellence from "../components/ASEngineeredExcellence";
import ASFaq from "../components/ASFaq";
import ASHero from "../components/ASHero";
import ASMetrics from "../components/ASMetrics";
import ASPartners from "../components/ASPartners";
import ASProcessSection from "../components/ASProcess";
import ASTropicsSection from "../components/ASTropics";

// Below the fold and the heaviest sections on the page: the testimonial
// carousel (with its map) and the savings calculator ship as their own
// chunks. The server still renders their HTML; the browser hydrates them
// once their code arrives instead of evaluating it with the entry bundle.
const ASClientJourney = lazy(() => import("../components/ASClientJourney"));
const ASImpactCalculator = lazy(() => import("../components/ASCalculator"));

type SectionVisibility = {
  hero: boolean;
  metrics: boolean;
  partners: boolean;
  benefits: boolean;
  excellence: boolean;
  tropics: boolean;
  process: boolean;
  clientJourney: boolean;
  calculator: boolean;
  faq: boolean;
  callToAction: boolean;
  packages: boolean;
};

const DEFAULT_VISIBILITY: SectionVisibility = {
  hero: true,
  metrics: true,
  partners: true,
  benefits: true,
  excellence: true,
  tropics: true,
  process: true,
  clientJourney: true,
  calculator: true,
  faq: true,
  callToAction: true,
  packages: true,
};

export default function ASDashboard() {
  const vis = useContent<SectionVisibility>('section-visibility', DEFAULT_VISIBILITY);

  return (
    <>
      {vis.hero && (
        <section className="_asHero" id="hero">
          <ASHero />
        </section>
      )}

      {vis.metrics && (
        <section className="_asMetrics" id="metrics">
          <ASMetrics />
        </section>
      )}

      {vis.partners && (
        <section className="_asPartners" id="partners">
          <ASPartners />
        </section>
      )}

      {vis.benefits && (
        <section className="_asBenefitsBanner" id="benefits">
          <ASBenefitsBanner />
        </section>
      )}

      {vis.excellence && (
        <section className="_asEngineeredExcellence" id="excellence">
          <ASEngineeredExcellence />
        </section>
      )}

      {vis.tropics && (
        <section className="_asTropicsSection" id="tropics">
          <ASTropicsSection />
        </section>
      )}

      {vis.process && (
        <section className="_asProcessSection" id="process">
          <ASProcessSection />
        </section>
      )}

      {vis.clientJourney && (
        <section className="_asClientJourney" id="client-journey">
          <Suspense fallback={null}>
            <ASClientJourney />
          </Suspense>
        </section>
      )}

      {vis.calculator && (
        <section className="_asImpactCalculator" id="calculator">
          <Suspense fallback={null}>
            <ASImpactCalculator />
          </Suspense>
        </section>
      )}

      {/* Visibility saved before the FAQ existed has no "faq" key: show it. */}
      {vis.faq !== false && (
        <section className="_asFaq" id="faq" aria-labelledby="faq-title">
          <ASFaq headingId="faq-title" />
        </section>
      )}

      {vis.callToAction && (
        <section className="_asCallToAction" id="call-to-action">
          <ASCallToAction />
        </section>
      )}
    </>
  );
}
