"use client";

import HeroSection from "@/components/landing-page/hero-section/page";
import Features from "@/components/landing-page/Features/page";
import Footer from "@/components/landing-page/footer/page";
import NavBar from "@/components/landing-page/navbar/page";
import Process from "@/components/landing-page/process/page";
import Benefits from "@/components/landing-page/benefits/page";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col w-full">
      <header className="w-full px-4 sm:px-6 md:px-8 lg:px-16 xl:px-32">
        <NavBar />
      </header>

      <main className="flex-1 flex w-full px-4 sm:px-6 md:px-8 lg:px-16 xl:px-32 mt-6 md:mt-10">
        <HeroSection />
      </main>

      <section className="flex-1 w-full px-4 sm:px-6 md:px-8 lg:px-16 xl:px-32 mt-6 md:mt-10">
        <Features />
      </section>

      <section className="flex-1 w-full px-4 sm:px-6 md:px-8 lg:px-16 xl:px-32 md:mt-10">
        <Process />
      </section>

      <section className="flex-1 w-full px-4 sm:px-6 md:px-8 lg:px-16 xl:px-32 md:mt-10">
        <Benefits />
      </section>

      <footer className="w-full px-4 sm:px-6 md:px-8 lg:px-16 xl:px-32 mt-6 md:mt-10">
        <Footer />
      </footer>
    </div>
  );
}
