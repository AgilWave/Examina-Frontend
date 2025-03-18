import React from "react";
import Ticker from "./ticker/Ticker";

function HeroSection() {
  return (
    <div className="flex flex-col items-center md:justify-center w-full min-h-screen bg-black mt-14 gap-3">
      <div className="relative bg-white rounded-3xl md:rounded-[50px] overflow-hidden w-full h-[75%] md:h-[85%] max-w-6xl mx-auto p-4 md:p-8 shadow-lg">
        <div className="flex flex-col justify-center items-center gap-3 md:gap-4 lg:gap-6">
          <h1 className="self-stretch mt-5 md:mt-6 text-center text-black text-[28px] sm:text-3xl md:text-4xl lg:text-6xl font-bold capitalize leading-tight md:leading-snug lg:leading-[74.67px]">
            Secure & Scalable <br />
            Online Examination Platform
          </h1>
          <p className="w-[85%] md:w-[80%] lg:w-[792px] text-center text-zinc-950/80 text-xs sm:text-sm md:text-base font-normal capitalize">
            Streamline exam creation, enhance security with AI-driven proctoring, and manage student assessments effortlessly.
          </p>
          <button className="h-10 px-8 md:h-12 md:px-12 py-3 bg-black rounded-[60px] shadow-[inset_0px_4px_4px_0px_rgba(255,255,255,0.30)] outline outline-offset-[-1px] outline-black inline-flex justify-center items-center gap-2.5 overflow-hidden transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg">
            <span className="text-center text-white text-sm md:text-base font-semibold capitalize">
              Learn More
            </span>
          </button>
        </div>
      </div>
      <Ticker />
    </div>
  );
}

export default HeroSection;
