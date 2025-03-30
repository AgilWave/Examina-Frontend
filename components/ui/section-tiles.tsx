import React from "react";
import Link from "next/link";

interface SectionTilesProps {
  link: string;
  icon: React.ReactNode;
  title: string;
}

const SectionTiles: React.FC<SectionTilesProps> = ({ link, icon, title }) => {
  return (
    <Link href={link} className="w-full md:w-50 ">
      <div className="w-full aspect-square flex flex-col items-center justify-center border-2 border-teal-400 rounded-3xl md:rounded-4xl shadow-md p-4 text-center transition-all transform hover:scale-105 hover:shadow-xl hover:bg-gradient-to-tl hover:from-cyan-500/15 hover:to-black/20 cursor-pointer">
        <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 flex items-center justify-center bg-[#158584] rounded-full text-teal-500 mb-2">
          {icon}
        </div>
        <p className="text-sm  md:text-base font-regular text-gray-900 dark:text-white mt-2 sm:mt-4 md:mt-6">
          {title}
        </p>
      </div>
    </Link>
  );
};

export default SectionTiles;