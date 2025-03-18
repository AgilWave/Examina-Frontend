import React from "react";

interface ButtonProps {
  label: string;
  onClick?: () => void;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({ label, onClick, className }) => {
  return (
    <button
      onClick={onClick}
      className={`px-12 py-3 cursor-pointer rounded-3xl outline-2 outline-offset-[-2px] outline-primary inline-flex justify-center items-center gap-2.5 overflow-hidden ${className} hover:outline-primary text-primary md:text-base hover:shadow hover:shadow-primary transition-all duration-300 ease-in-out`}
    >
      <div className="text-center justify-start font-semibold transform group-hover:scale-110 group transition-all duration-300 ease-in-out">
        {label}
      </div>
    </button>
  );
};

export default Button;
