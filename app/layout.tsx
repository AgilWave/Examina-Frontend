import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/styles/globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "next-themes";
import { Providers } from "@/redux/provider";
import { NuqsAdapter } from "nuqs/adapters/next/app";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Examina - New Era of Examination",
    template: "%s | Examina"
  },
  description:
    "Examina is a cutting-edge online examination platform designed to provide a seamless and secure testing experience for educational institutions and organizations. Our system ensures fair assessments with advanced AI-powered proctoring, real-time monitoring, and strict exam integrity measures.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning lang="en">
      <meta name="apple-mobile-web-app-title" content="Examina" />
      <body
        className={`${geistSans.variable} ${geistMono.variable} select-none antialiased`}
      >
        <Providers>
          <NuqsAdapter>
            <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              enableSystem={false}
            >
              {children}
              <Toaster />
            </ThemeProvider>
          </NuqsAdapter>
        </Providers>
      </body>
    </html>
  );
}
