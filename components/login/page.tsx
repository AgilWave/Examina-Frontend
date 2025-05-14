"use client";
import Image from "next/image";
import miniLogo from "@/public/imgs/loginlogo.png";
import University from "@/public/imgs/university.png";
import microsoftLogo from "@/public/imgs/microsoft-logo-icon.png";
import { signIn, useSession, SessionProvider } from "next-auth/react";
import { useState, useEffect, useRef } from "react";
import { loginActionMS } from "@/services/actions/auth";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

function LoginPageContent() {
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();
  const loginProcessed = useRef(false);

  useEffect(() => {
    const handleMicrosoftAuth = async () => {
      if (session?.idToken && !loginProcessed.current) {
        loginProcessed.current = true;
        try {
          const response = await loginActionMS({
            idToken: session.idToken,
          });
    
          if (response && response.success && response.redirect) {
            router.push(response.redirect);
            toast.success("Login successful");
          } else if (response && !response.success) {
            toast.error(response.message || "Login failed");
          }
        } catch (error) {
          console.error("Authentication error:", error);
          toast.error("An error occurred during authentication");
        }
      }
    };
    
    handleMicrosoftAuth();
  }, [session, router]);

  const handleMicrosoftLogin = async () => {
    setLoading(true);
    try {
      await signIn("microsoft-entra-id");
    } catch (error) {
      console.error("Login error:", error);
      setLoading(false);
      toast.error("Failed to initiate login");
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-teal-900 relative overflow-hidden p-4">
      {/* Enhanced geometric background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute w-96 h-96 md:w-[600px] md:h-[600px] lg:w-[800px] lg:h-[800px] 
          bg-cyan-400/40 rounded-full blur-[180px] md:blur-[300px] 
          -top-1/3 -left-1/3 animate-pulse-slow"
        />
        <div
          className="absolute w-96 h-96 md:w-[600px] md:h-[600px] lg:w-[800px] lg:h-[800px] 
          bg-teal-300/30 rounded-full blur-[180px] md:blur-[300px] 
          -bottom-1/3 -right-1/3 animate-pulse-slow-delayed"
        />
        <div
          className="absolute w-64 h-64 md:w-[400px] md:h-[400px] lg:w-[500px] lg:h-[500px] 
          bg-emerald-400/20 rounded-full blur-[150px] md:blur-[250px] 
          top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse-slow-alt"
        />
      </div>

      {/* Main card container */}
      <div className="relative z-10 w-full max-w-md">
        <div
          className="bg-teal-500/20 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden 
          flex flex-col items-center justify-center p-10 border border-white/20"
        >
          <div className="w-full max-w-[180px] mb-8">
            <Image
              src={University}
              alt="NIBM Logo"
              width={300}
              height={75}
              className="w-full brightness-100 h-auto object-contain drop-shadow-lg"
            />
          </div>

          <div className="text-center space-y-4 mb-10">
            <h2 className="text-3xl font-bold text-white">
              Examination Portal
            </h2>
            <p className="text-base text-cyan-50/80 max-w-md">
              Access your online examination experience with a single click
            </p>
          </div>

          <button
            onClick={handleMicrosoftLogin}
            className="group w-full max-w-sm flex items-center justify-center space-x-3
            bg-white/15 hover:bg-white/25 text-white font-medium py-4 px-8
            border border-white/30 rounded-xl shadow-lg backdrop-blur-sm
            transition-all duration-300 transform hover:scale-102 hover:shadow-xl"
          >
            {loading ? (
              <div className="flex items-center justify-center space-x-2">
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 0 1 4 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <span>Authenticating...</span>
              </div>
            ) : (
              <>
                <div className="w-6 h-6 relative">
                  <Image
                    src={microsoftLogo}
                    alt="Microsoft Logo"
                    layout="fill"
                    objectFit="contain"
                    className="filter brightness-0 invert group-hover:scale-110 transition-transform"
                  />
                </div>
                <span>Sign in with Microsoft</span>
              </>
            )}
          </button>

          <div className="mt-8 w-full max-w-xs flex items-center gap-4">
            <div className="flex-1 h-px bg-white/10"></div>
            <span className="text-white/60 text-xs">Secure Login</span>
            <div className="flex-1 h-px bg-white/10"></div>
          </div>
        </div>
      </div>

      {/* Logo in corner */}
      <div className="absolute top-6 right-6 md:top-8 md:right-8 z-30">
        <div className="relative group">
          <div className="absolute inset-0 bg-cyan-400/30 rounded-full blur-md group-hover:blur-lg transition-all duration-300 scale-125 group-hover:scale-150 opacity-70"></div>
          <Image
            src={miniLogo}
            className="w-12 md:w-12 relative z-10 opacity-90 hover:opacity-100 transition-all duration-300 drop-shadow-lg"
            alt="Examina Logo"
            priority
          />
        </div>
      </div>

      {/* Footer copyright */}
      <div className="absolute bottom-6 w-full text-center text-white/60 text-xs md:text-sm font-light z-30">
        © {new Date().getFullYear()} Examina. All rights reserved.
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <SessionProvider>
      <LoginPageContent />
    </SessionProvider>
  );
}

