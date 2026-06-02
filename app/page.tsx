import LandingNavbar from "@/components/landingpage/LandingNavbar";
import HeroSection from "@/components/landingpage/HeroSection";
import StatsSection from "@/components/landingpage/StatsSection";
import ServiceSection from "@/components/landingpage/ServiceSection";
import KeunggulanSection from "@/components/landingpage/KeunggulanSection";
import CtaBanner from "@/components/landingpage/CtaBanner";
import Footer from "@/components/landingpage/Footer";

export default function LandingPage() {
  return (
    <>
      <LandingNavbar />

      <main className="bg-[#F0FEF1] pt-24">
        <HeroSection />
        <StatsSection />
        <ServiceSection />
        <KeunggulanSection />
        <CtaBanner />
      </main>

      <Footer />
    </>
  );
}