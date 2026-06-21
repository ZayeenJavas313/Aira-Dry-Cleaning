import { Hero } from '../components/landing/Hero';
import { CustomerLogos } from '../components/landing/CustomerLogos';
import { ControlPanelFeatures } from '../components/landing/ControlPanelFeatures';
import { ScalabilitySection } from '../components/landing/ScalabilitySection';
import { EcosystemSection } from '../components/landing/EcosystemSection';
import { ShowcaseCarousel } from '../components/landing/ShowcaseCarousel';
import { Testimonial } from '../components/landing/Testimonial';
import { FinalCTA } from '../components/landing/FinalCTA';
import { Footer } from '../components/landing/Footer';

export function LandingPage() {
  return (
    <div className="landing-page flex flex-col min-h-screen">
      <Hero />
      <CustomerLogos />
      <ControlPanelFeatures />
      <ScalabilitySection />
      <EcosystemSection />
      <ShowcaseCarousel />
      <Testimonial />
      <FinalCTA />
      <Footer />
    </div>
  );
}
