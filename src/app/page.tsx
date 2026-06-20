import { FeaturesSection } from "@/components/landing/features-section";
import { FutureScopeSection } from "@/components/landing/future-scope-section";
import { HeroSection } from "@/components/landing/hero-section";
import { ImpactSection } from "@/components/landing/impact-section";

export default function Home() {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <ImpactSection />
      <FutureScopeSection />
    </>
  );
}
