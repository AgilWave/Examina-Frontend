"use client";

import HeroSection from "@/components/landing-page/hero-section/page";
import NaVBar from "@/components/landing-page/navbar/page";
import Features from "@/components/landing-page/Features/page";

export default function LandingPage() {
  return (
    <div className="flex flex-col w-full min-h-screen">
    <div className="w-full px-4 sm:px-6 md:px-8 lg:px-16 xl:px-32">
      <NaVBar />
    </div>
    <div className="flex-1 w-full px-4 sm:px-6 md:px-8 lg:px-16 xl:px-32 mt-6 md:mt-10">
      <HeroSection />
    </div>
    <div className="flex-1 w-full px-4 sm:px-6 md:px-8 lg:px-16 xl:px-32 mt-6 md:mt-10">
      <Features />
    </div>
  </div>
  );
}
