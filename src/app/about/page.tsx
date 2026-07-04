import { AboutUs } from "@/components/deepgreen/about-us";
import { Navbar } from "@/components/deepgreen/navbar";
import { PageTransition } from "@/components/ui/page-transition";

export default function AboutPage() {
  return (
    <PageTransition>
      <div className="min-h-screen bg-[#060a08] overflow-x-hidden">
        <Navbar />
        <AboutUs />
      </div>
    </PageTransition>
  );
}
