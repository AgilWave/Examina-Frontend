import React, { ReactNode } from "react";

interface ButtonProps {
  label: string;
  onClick?: () => void;
  className?: string;
  icon?: ReactNode;
  iconPosition?: "left" | "right";
}

const Button: React.FC<ButtonProps> = ({
  label,
  onClick,
  className = "",
  icon,
  iconPosition = "left",
}) => {
  return (
    <button
      onClick={onClick}
      className={`
        px-12 py-3 
        cursor-pointer 
        rounded-3xl 
        outline-2 
        outline-offset-[-2px] 
        outline-primary 
        inline-flex 
        justify-center 
        items-center 
        gap-2.5 
        overflow-hidden 
        ${className} 
        hover:outline-primary 
        text-primary 
        md:text-base 
        hover:shadow 
        hover:shadow-primary 
        transition-all 
        duration-300 
        ease-in-out
        group
      `}
    >
      {icon && iconPosition === "left" && (
        <span className="mr-2 transition-transform duration-300 ease-in-out group-hover:scale-110">
          {icon}
        </span>
      )}

      <div className="text-center justify-start font-semibold transform transition-all duration-300 ease-in-out">
        {label}
      </div>

      {icon && iconPosition === "right" && (
        <span className="ml-2 transition-transform duration-300 ease-in-out group-hover:scale-110">
          {icon}
        </span>
      )}
    </button>
  );
};

export default Button;
