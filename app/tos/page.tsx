import TermsOfService from "@/components/landing-page/tos";
import Navbar from "@/components/landing-page/navbar/page";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Examina is a cutting-edge online examination platform designed to provide a seamless and secure testing experience for educational institutions and organizations. Our system ensures fair assessments with advanced AI-powered proctoring, real-time monitoring, and strict exam integrity measures.",
};

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen flex flex-col w-full">
      <header className="w-full px-4 sm:px-6 md:px-8 lg:px-16 xl:px-32">
        <Navbar />
      </header>
      <main className="flex-1 flex w-full px-4 sm:px-6 md:px-8 lg:px-16 xl:px-32 mt-6 md:mt-10">
        <TermsOfService />
      </main>
    </div>
  );
}
