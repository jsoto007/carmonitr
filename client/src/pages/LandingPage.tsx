import { HeroSection } from './landing/HeroSection';
import { FeatureHighlights } from './landing/FeatureHighlights';
import { WorkflowSection } from './landing/WorkflowSection';
import { TestimonialSection } from './landing/TestimonialSection';
import { FooterSpotlight } from './landing/FooterSpotlight';

export const LandingPage = () => (
  <div className="min-h-screen bg-white text-slate-900 dark:bg-slate-950 dark:text-white">
    <HeroSection />
    <FeatureHighlights />
    <WorkflowSection />
    <TestimonialSection />
    <FooterSpotlight />
  </div>
);
