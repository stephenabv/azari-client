import ASBenefitsBanner from "../components/ASBenefits";
import ASImpactCalculator from "../components/ASCalculator";
import ASCallToAction from "../components/ASCallToAction";
import ASEngineeredExcellence from "../components/ASEngineeredExcellence";
import ASHero from "../components/ASHero";
import ASMetrics from "../components/ASMetrics";
import ASProcessSection from "../components/ASProcess";
import ASTropicsSection from "../components/ASTropics";

export default function ASDashboard() {
  return (
    <>
      <section className="_asHero">
        <ASHero />
      </section>

      <section className="_asMetrics">
        <ASMetrics />
      </section>

      <section className="_asBenefitsBanner">
        <ASBenefitsBanner />
      </section>

      <section className="_asEngineeredExcellence">
        <ASEngineeredExcellence />
      </section>

      <section className="_asTropicsSection">
        <ASTropicsSection />
      </section>

      <section className="_asProcessSection">
        <ASProcessSection />
      </section>

      <section className="_asImpactCalculator" id="calculator">
        <ASImpactCalculator />
      </section>

      <section className="_asCallToAction">
        <ASCallToAction />
      </section>
    </>
  );
}