import { AccessPortalSection } from "@/components/landing/access-portal-section";
import { FeaturesSection } from "@/components/landing/features-section";
import { FutureScopeSection } from "@/components/landing/future-scope-section";
import { HeroSection } from "@/components/landing/hero-section";
import { ImpactSection } from "@/components/landing/impact-section";

export default function Home() {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <AccessPortalSection />
      <ImpactSection />
      <FutureScopeSection />
    </>
  );
}

