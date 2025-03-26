"use client";

import React from "react";
import Image from "next/image";
import Marquee from "react-fast-marquee";
import AzureIMG from "@/public/imgs/landing-page/Azure.png";
import MicrosoftIMG from "@/public/imgs/landing-page/MS Logo.png";
import AzureAIIMG from "@/public/imgs/landing-page/Azure AI.png";

const LogoTicker = () => {
  const logoItems = [
    { src: AzureAIIMG, alt: "Azure AI" },
    { src: MicrosoftIMG, alt: "Microsoft" },
    { src: AzureIMG, alt: "Azure" },
    { src: AzureAIIMG, alt: "Azure AI" },
    { src: MicrosoftIMG, alt: "Microsoft" },
    { src: AzureIMG, alt: "Azure" },
    { src: AzureAIIMG, alt: "Azure AI" },
    { src: MicrosoftIMG, alt: "Microsoft" },
    { src: AzureIMG, alt: "Azure" },
  ];

  return (
    <div className="w-full md:max-w-11/12 flex flex-col items-center bg-black pt-4">
      <div className="w-full text-center text-white font-medium text-base mb-6">
        Powered by Microsoft Technologies
      </div>

      <Marquee
        speed={40}
        gradient={false}
        pauseOnHover={true}
        className="w-full"
      >
        {logoItems.map((logo, index) => (
          <div
            key={index}
            className="flex items-center justify-center mx-6 md:mx-12 px-4"
          >
            <Image
              className="h-8 md:h-12 w-auto"
              src={logo.src}
              alt={logo.alt}
              width={120}
              height={48}
              priority={index === 0}
            />
          </div>
        ))}
      </Marquee>
    </div>
  );
};

export default LogoTicker;
