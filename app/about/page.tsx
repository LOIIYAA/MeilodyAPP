import LandingNavbar from "@/components/landingpage/LandingNavbar";
import AboutSection from "@/components/landingpage/About/AboutSection";
import Footer from "@/components/landingpage/Footer";

export default function AboutPage() {
    return (
        <>
            <LandingNavbar />
            <main className="mt-20">
                <AboutSection />
            </main>
            <Footer />
        </>
    );
}