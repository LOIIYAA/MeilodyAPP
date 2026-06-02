import Footer from "@/components/landingpage/Footer";
import LandingNavbar from "@/components/landingpage/LandingNavbar";
import TeamSection from "@/components/landingpage/team/TeamSection";

export default function TeamPage() {
    return (
         <>
            {/* Navbar sama persis landing page */}
            <LandingNavbar/>
                {/* Konten Team */}
                <main className="bg-[#F0FEF1] min-h-screen mt-20">
                    <TeamSection />
                </main>

                {/* Footer sama persis landing page */}
                <Footer />
            </>
            );
}