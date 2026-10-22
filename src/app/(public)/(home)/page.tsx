import { CollaborateLogo } from "./_components/CollaborateLogo";
import HeroSection from "./_components/Hero";
import { CalToAction } from "./_components/CTA";
import { DonorSection } from "./_components/DonorSection";
import { EmergencyServiceSection } from "./_components/EmergencyServiceSection";
import RequesterSection from "./_components/RequesterSection";
import { FaqSection } from "./_components/FAQ";

const Page = () => {
  return (
    <div>
      <HeroSection />

      <div className="relative mx-auto my-10 grid w-full max-w-7xl px-4 sm:px-6 lg:my-16">
        <h2 className="mb-6 text-center text-primary">
          Our Honourable <span className="text-[#B15A36]">Partners</span>.
        </h2>

        <CollaborateLogo />
      </div>

      <DonorSection />
      <RequesterSection />
      <EmergencyServiceSection />
      
      <FaqSection />

      <CalToAction />
    </div>
  );
};

export default Page;
