"use client";
import Image from 'next/image';
import miniLogo from '@/public/imgs/loginlogo.png'
import University from '@/public/imgs/university.png'
import { useState } from "react";

export default function LoginPage() {
  const [role, setRole] = useState<string | null>(null);


return (
  <div className={`fixed top-0 left-0 w-full z-50 transition-all duration-300`}>

    <div className="text-center justify-start text-white/75 text-sm font-normal top-230 relative">© examina</div>
     <Image
          src={miniLogo}
          className="w-[50px] md:w-[50px] sm:w-[120px] ml-460 mt-7"
          alt="examinaLogo"
          priority
      />


        <div className="w-full max-w-7xl h-[700px] bg-white p-8 rounded-3xl shadow-lg text-center ml-75 mt-20">
                {/* Logo */}
                <div className="mb-6">
                  <Image
                    src={University} // Replace with actual logo path
                    alt="NIBM Logo"
                    width={380}
                    height={95}
                    className="mx-auto mt-25"
                  />
                </div>

                {/* Heading */}
                <h2 className="text-5xl font-bold text-black mt-20 relative">
                  Welcome to Examination Portal
                </h2>
                <p className="text-[#00000058] mt-2 text-2xl">
                  Prepare. Practice. Excel. Choose your role to access a seamless online<br/>
                  examination experience!
                </p>

                {/* Role Selection Buttons */}
                <div className="mt-6 flex justify-center gap-4">
                  <button
                    className={`justify-start text-cyan-300 text-md font-semibold self-stretch self-stretch px-24 py-1.5 bg-gradient-to-b from-black to-teal-700 rounded-[60px] shadow-[0px_0px_3.799999952316284px_0px_rgba(0,14,14,0.82)] shadow-[inset_1px_5px_4px_0px_rgba(255,255,255,0.58)] outline outline-[1.50px] outline-offset-[-1.50px] outline-teal-600 inline-flex justify-center items-center gap-2.5 overflow-hidden ${
                      role === "student"
                    }`}
                    onClick={() => setRole("student")}
                  >
                    Student
                  </button>


                  <button
                    className={`self-stretch self-stretch px-24 py-3 rounded-[60px] outline outline-[1.50px] outline-offset-[-1.50px] outline-zinc-800 inline-flex justify-center items-center gap-2.5 overflow-hidden justify-start text-neutral-800 text-lg font-semibold ${
                      role === "instructor"
                    }`}
                    onClick={() => setRole("instructor")}
                  >
                    Instructor
                  </button>
                </div>
              </div>
      
    <div className="w-[1021.98px] h-[1021.98px] ml-120 -mt-130 relative">
        <div className="w-96 h-96 left-[309.59px] top-[312.92px] absolute bg-cyan-400 rounded-full blur-[400px]" />
        <div className="w-[494.35px] h-[494.35px] left-[261.32px] top-[264.65px] absolute bg-zinc-300/0 rounded-full border-2 border-white/0" />
        <div className="w-[775.64px] h-[775.64px] left-[119.84px] top-[123.17px] absolute bg-zinc-300/0 rounded-full border-2 border-white/0" />
        <div className="w-[1021.98px] h-[1021.98px] left-0 top-0 absolute bg-zinc-300/0 rounded-full border-2 border-white/0" />
    </div>
  </div>
  );
}
