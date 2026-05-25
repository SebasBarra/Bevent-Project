import { CTASection } from '@/features/landing/components/CtaSection';
import { FeaturesSection } from '@/features/landing/components/FeaturesSection';
import { HeroSection } from '@/features/landing/components/HeroSection';
import { ServicesSection } from '@/features/landing/components/ServicesSection';

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <HeroSection />
      <FeaturesSection />
      <ServicesSection />
      <CTASection />
    </div>
  );
}
