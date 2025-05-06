"use client";
import Image from "next/image";
import miniLogo from "@/public/imgs/loginlogo.png";
import University from "@/public/imgs/university.png";
import { signIn, useSession, SessionProvider } from "next-auth/react";
import { useState, useEffect, useRef } from "react";
import { loginActionMS } from "@/services/actions/auth";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

function LoginPageContent() {
  const [loadingStudent, setLoadingStudent] = useState(false);
  const [loadingLecturer, setLoadingLecturer] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();
  const loginProcessed = useRef(false);

  useEffect(() => {
    // Check if session is loading or the token is missing
    if (!session?.idToken || loginProcessed.current) return;

    loginProcessed.current = true;

    const handleMicrosoftAuth = async () => {
      try {
        console.log("Session ID Token:", session.idToken); // Log to check if the token exists

        if (!session.idToken) {
          toast.error("Authentication token is missing");
          return;
        }

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
    };

    handleMicrosoftAuth();
  }, [session, router]);

  const handleLogin = async (role: string) => {
    if (role === "student") {
      setLoadingStudent(true);
    } else {
      setLoadingLecturer(true);
    }

    try {
      await signIn("microsoft-entra-id");
    } catch (error) {
      console.error("Login error:", error);
      setLoadingStudent(false);
      setLoadingLecturer(false);
      toast.error("Failed to initiate login");
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-teal-900 relative overflow-hidden p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute w-64 h-64 md:w-96 md:h-96 lg:w-[500px] lg:h-[500px] 
          bg-cyan-400/60 rounded-full blur-[150px] md:blur-[250px] 
          -top-1/4 -left-1/4 transform -translate-x-1/2 -translate-y-1/2"
        />

        <div
          className="absolute w-64 h-64 md:w-96 md:h-96 lg:w-[500px] lg:h-[500px] 
          bg-teal-300/40 rounded-full blur-[150px] md:blur-[250px] 
          -bottom-1/4 -right-1/4 transform translate-x-1/2 translate-y-1/2"
        />
      </div>

      <div className="relative z-10 w-full max-w-4xl">
        <div
          className="bg-white/90 rounded-[40px] shadow-2xl overflow-hidden 
          grid grid-cols-1 md:grid-cols-2 gap-6 p-6 md:p-10 lg:p-12"
        >
          <div className="flex flex-col items-center justify-center text-center space-y-4 md:space-y-6">
            <div className="w-full max-w-[150px] md:max-w-[200px] lg:max-w-[250px] mb-4">
              <Image
                src={University}
                alt="NIBM Logo"
                width={300}
                height={75}
                className="w-full h-auto object-contain"
              />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800">
                Examination Portal
              </h2>
              <p className="text-sm md:text-base text-gray-600 max-w-md px-4">
                Prepare. Practice. Excel. Choose your role to access a seamless
                online examination experience!
              </p>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center space-y-6">
            <div className="w-full space-y-4">
              <h3 className="text-xl font-semibold text-center text-gray-700">
                Select Your Role
              </h3>

              <div className="flex flex-col space-y-4">
                <button
                  onClick={() => handleLogin("student")}
                  className="w-full py-3 rounded-full 
                  bg-gradient-to-tl from-teal-600 to-black
                  text-white font-semibold 
                  hover:from-teal-900 hover:to-cyan-900 
                  transition-all duration-300 
                  transform hover:scale-105 
                  shadow-lg hover:shadow-xl"
                >
                  {loadingStudent ? (
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
                          fill="none"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 1 1 16 0A8 8 0 0 1 4 12z"
                        />
                      </svg>
                      <span>Loading...</span>
                    </div>
                  ) : (
                    "Student"
                  )}
                </button>

                <button
                  onClick={() => handleLogin("lecturer")}
                  className="w-full py-3 rounded-full 
                  bg-gradient-to-tl from-teal-600 to-black
                  text-white font-semibold 
            hover:from-teal-900 hover:to-cyan-900                   
            transition-all duration-300 
                  transform hover:scale-105 
                  shadow-lg hover:shadow-xl"
                >
                  {loadingLecturer ? (
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
                          fill="none"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 1 1 16 0A8 8 0 0 1 4 12z"
                        />
                      </svg>
                      <span>Loading...</span>
                    </div>
                  ) : (
                    "Lecturer"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute top-4 right-4 md:top-8 md:right-8 z-30">
        <Image
          src={miniLogo}
          className="w-10 md:w-16 lg:w-20 opacity-80 hover:opacity-100 transition-opacity"
          alt="Examina Logo"
          priority
        />
      </div>

      <div className="absolute bottom-4 w-full text-center text-white/75 text-xs md:text-sm font-light z-30">
        © {new Date().getFullYear()} Examina. All rights reserved.
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <SessionProvider session={null} refetchInterval={0}>
      <LoginPageContent />
    </SessionProvider>
  );
}
