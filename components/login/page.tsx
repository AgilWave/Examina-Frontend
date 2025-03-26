"use client";
import Image from "next/image";
import miniLogo from "@/public/imgs/loginlogo.png";
import University from "@/public/imgs/university.png";

export default function LoginPage() {
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
                  className="w-full py-3 rounded-full 
                  bg-gradient-to-tl from-teal-600 to-black
                  text-white font-semibold 
                  hover:from-teal-900 hover:to-cyan-900 
                  transition-all duration-300 
                  transform hover:scale-105 
                  shadow-lg hover:shadow-xl"
                >
                  Student
                </button>

                <button
                  className="w-full py-3 rounded-full 
                  bg-gradient-to-tl from-teal-600 to-black
                  text-white font-semibold 
            hover:from-teal-900 hover:to-cyan-900                   
            transition-all duration-300 
                  transform hover:scale-105 
                  shadow-lg hover:shadow-xl"
                >
                  Instructor
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
