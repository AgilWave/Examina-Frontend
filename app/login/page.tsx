"use client";
import Image from 'next/image';
import miniLogo from '@/public/imgs/loginlogo.png';
import University from '@/public/imgs/university.png';

export default function LoginPage() {
  return (
    <div className="h-screen w-screen flex items-center justify-center bg-black relative overflow-hidden px-2">
      {/* Background Circles */}
      <div className="w-[800px] h-[800px] sm:w-[1021.98px] sm:h-[1021.98px] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="w-64 h-64 sm:w-96 sm:h-96 left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 absolute bg-cyan-400 rounded-full blur-[200px] sm:blur-[400px]" />
        <div className="w-[300px] h-[300px] sm:w-[494.35px] sm:h-[494.35px] left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 absolute bg-zinc-300/0 rounded-full border-2 border-white/0" />
        <div className="w-[500px] h-[500px] sm:w-[775.64px] sm:h-[775.64px] left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 absolute bg-zinc-300/0 rounded-full border-2 border-white/0" />
        <div className="w-[800px] h-[800px] sm:w-[1021.98px] sm:h-[1021.98px] left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 absolute bg-zinc-300/0 rounded-full border-2 border-white/0" />
      </div>

      {/* Main Content */}
      <div className="w-[95%] sm:w-[92%] md:w-[85%] max-w-5xl h-[30vh] sm:h-[60vh] bg-white p-2 sm:p-6 md:p-8 rounded-3xl shadow-lg text-center z-10 flex flex-col items-center justify-between">
        <div className="flex-1 flex flex-col items-center justify-center gap-1.5 sm:gap-6 md:gap-8 w-full">
          {/* University Logo */}
          <div className="w-full max-w-[60px] sm:max-w-[200px] md:max-w-[200px] lg:max-w-[250px]">
            <Image
              src={University}
              alt="NIBM Logo"
              width={300}
              height={75}
              className="w-full h-auto"
            />
          </div>

          {/* Heading */}
          <h2 className="text-base sm:text-2xl md:text-3xl lg:text-4xl font-bold text-black leading-tight">
            Welcome to Examination Portal
          </h2>

          {/* Subheading */}
          <p className="text-[#00000058] text-[11px] sm:text-sm md:text-base lg:text-lg text-center max-w-2xl px-1">
            Prepare. Practice. Excel. Choose your role to access a seamless online
            <span className="hidden sm:inline"><br /></span>
            examination experience!
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-row justify-center gap-2 sm:gap-4 md:gap-6 w-full max-w-xl my-2 sm:my-4">
          <button className="w-[120px] sm:w-[160px] md:w-[180px] px-3 sm:px-4 py-2 sm:py-3 rounded-[60px] outline outline-[1.5px] outline-offset-[-1.5px] outline-zinc-800 text-neutral-800 text-xs sm:text-base font-semibold hover:bg-gradient-to-b from-black to-teal-700 hover:text-cyan-300 hover:outline-teal-600 transition-colors duration-300">
            Student
          </button>

          <button className="w-[120px] sm:w-[160px] md:w-[180px] px-3 sm:px-4 py-2 sm:py-3 rounded-[60px] outline outline-[1.5px] outline-offset-[-1.5px] outline-zinc-800 text-neutral-800 text-xs sm:text-base font-semibold hover:bg-gradient-to-b from-black to-teal-700 hover:text-cyan-300 hover:outline-teal-600 transition-colors duration-300">
            Instructor
          </button>
        </div>
      </div>

      {/* Logo and Footer */}
      <div className="absolute top-4 right-4 md:top-8 md:right-8 z-30">
        <Image
          src={miniLogo}
          className="w-[35px] sm:w-[45px] md:w-[60px]"
          alt="examinaLogo"
          priority
        />
      </div>

      <div className="absolute bottom-4 w-full text-center text-white/75 text-xs sm:text-sm font-normal z-30">
        © examina
      </div>
    </div>
  );
}