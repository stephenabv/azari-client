import { useContent } from "../hooks/useContent";
import ASBenefitsBanner from "../components/ASBenefits";
import ASImpactCalculator from "../components/ASCalculator";
import ASCallToAction from "../components/ASCallToAction";
import ASClientJourney from "../components/ASClientJourney";
import ASEngineeredExcellence from "../components/ASEngineeredExcellence";
import ASHero from "../components/ASHero";
import ASMetrics from "../components/ASMetrics";
import ASProcessSection from "../components/ASProcess";
import ASTropicsSection from "../components/ASTropics";

type SectionVisibility = {
  hero: boolean;
  metrics: boolean;
  benefits: boolean;
  excellence: boolean;
  tropics: boolean;
  process: boolean;
  clientJourney: boolean;
  calculator: boolean;
  callToAction: boolean;
};

const DEFAULT_VISIBILITY: SectionVisibility = {
  hero: true,
  metrics: true,
  benefits: true,
  excellence: true,
  tropics: true,
  process: true,
  clientJourney: true,
  calculator: true,
  callToAction: true,
};

export default function ASDashboard() {
  const vis = useContent<SectionVisibility>('section-visibility', DEFAULT_VISIBILITY);

  return (
    <>
      {vis.hero && (
        <section className="_asHero">
          <ASHero />
        </section>
      )}

      {vis.metrics && (
        <section className="_asMetrics">
          <ASMetrics />
        </section>
      )}

      {vis.benefits && (
        <section className="_asBenefitsBanner">
          <ASBenefitsBanner />
        </section>
      )}

      {vis.excellence && (
        <section className="_asEngineeredExcellence">
          <ASEngineeredExcellence />
        </section>
      )}

      {vis.tropics && (
        <section className="_asTropicsSection">
          <ASTropicsSection />
        </section>
      )}

      {vis.process && (
        <section className="_asProcessSection">
          <ASProcessSection />
        </section>
      )}

      {vis.clientJourney && (
        <section className="_asClientJourney">
          <ASClientJourney />
        </section>
      )}

      {vis.calculator && (
        <section className="_asImpactCalculator" id="calculator">
          <ASImpactCalculator />
        </section>
      )}

      {vis.callToAction && (
        <section className="_asCallToAction">
          <ASCallToAction />
        </section>
      )}
    </>
  );
}
