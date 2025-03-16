import React from "react";

function HeroSection() {
  return (
    <div className="flex flex-col items-center justify-between w-full py-14 md:py-8 lg:py-16 px-4 md:px-8">
      <div className="relative bg-white rounded-3xl md:rounded-[50px] overflow-hidden w-full max-w-6xl mx-auto h-[500px] sm:h-[650px] md:h-[750px] lg:h-[933px]">
        <div className=" flex flex-col justify-center items-center gap-3 md:gap-4 lg:gap-6">
          <div className="self-stretch mt-5 md:mt-12 text-center text-black text-xl sm:text-3xl md:text-4xl lg:text-6xl font-bold  capitalize leading-tight md:leading-snug lg:leading-[74.67px]">
            Secure & Scalable <br />
            Online Examination Platform
          </div>
          <div className="w-[85%] md:w-[80%] lg:w-[792px] text-center text-zinc-950/80 text-xs sm:text-sm md:text-base font-normal  capitalize">
            Streamline exam creation, enhance security with AI-driven
            proctoring, and manage student assessments effortlessly
          </div>
          <div className="h-10 px-8 md:h-12 md:px-12 py-3 bg-black rounded-[60px] shadow-[inset_0px_4px_4px_0px_rgba(255,255,255,0.30)] outline outline-offset-[-1px] outline-black inline-flex justify-center items-center gap-2.5 overflow-hidden transition-all duration-300 ease-in-out hover:scale-102 hover:shadow:md md:hover:scale-105 md:hover:shadow-lg">
            <div className="text-center justify-start text-white text-sm md:text-base font-semibold capitalize">
              Learn More
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HeroSection;
