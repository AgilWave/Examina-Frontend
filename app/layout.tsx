import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/styles/globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Examina - New Era of Examination",
  description: "Examina is a cutting-edge online examination platform designed to provide a seamless and secure testing experience for educational institutions and organizations. Our system ensures fair assessments with advanced AI-powered proctoring, real-time monitoring, and strict exam integrity measures.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <meta name="apple-mobile-web-app-title" content="Examina" />
      <body
        className={`${geistSans.variable} ${geistMono.variable} select-none antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
