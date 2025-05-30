import React from "react";

interface TagProps {
  label: string;
  className?: string;
}

const Tag: React.FC<TagProps> = ({ label, className }) => {
  return (
    <div
  className={`h-8 sm:h-9 md:h-10 px-4 sm:px-6 md:px-8 py-1.5 sm:py-2 md:py-2.5 
    bg-gradient-to-b from-cyan-400/70 to-black/30 
    rounded-full sm:rounded-[60px] 
    shadow-[inset_0px_4px_3px_0px_rgba(104,104,104,0.57)] sm:shadow-[inset_0px_6px_4.4px_0px_rgba(104,104,104,0.57)] 
    outline outline-offset-[-1px] outline-cyan-400/40 
    inline-flex justify-center items-center gap-1.5 sm:gap-2 md:gap-2.5 overflow-hidden 
    w-auto ${className}`}
>
  <div className="justify-start text-teal-300 text-xs sm:text-sm font-medium whitespace-nowrap">
    {label}
  </div>
</div>
  );
};

export default Tag;
