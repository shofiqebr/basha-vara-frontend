import ExtraSections from "@/components/ExtraSections";
import HeroSection from "@/components/HeroSection";
import LandingExtraSections from "@/components/LandingExtraSections";


export default function Home() {
  return (
    <div className="min-h-screen">
  <HeroSection/>
  <LandingExtraSections/>
  <ExtraSections/>
    </div>
  );
}
