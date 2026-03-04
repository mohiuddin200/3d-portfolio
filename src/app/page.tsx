import { Navigation } from "@/components/layout/Navigation";
import { ScrollProgress } from "@/components/layout/ScrollProgress";
import HeroSection from "@/components/sections/HeroSection";
import AboutSection from "@/components/sections/AboutSection";
import SkillsSection from "@/components/sections/SkillsSection";
import ExperienceSection from "@/components/sections/ExperienceSection";
import ProjectsSection from "@/components/sections/ProjectsSection";
import ContactSection from "@/components/sections/ContactSection";
import { SectionTransition } from "@/components/transitions/SectionTransition";
import { Footer } from "@/components/layout/Footer";

export default function Home() {
  return (
    <>
      <Navigation />
      <ScrollProgress />
      <main id="main-content">
        <HeroSection />
        <SectionTransition type="parallax-fade" />
        <AboutSection />
        <SectionTransition type="slide-up" />
        <SkillsSection />
        <SectionTransition type="gold-wipe" />
        <ExperienceSection />
        <SectionTransition type="scale-fade" />
        <ProjectsSection />
        <SectionTransition type="parallax-layers" />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
