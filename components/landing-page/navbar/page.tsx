import Button from "@/components/common/button";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Logo from "@/public/imgs/logo.png";

function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef(null);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMenuOpen && menuRef.current && !menuRef.current.contains(event.target)) {
        closeMenu();
      }
    };

    // Close menu on escape key press
    const handleEscKey = (event) => {
      if (isMenuOpen && event.key === "Escape") {
        closeMenu();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscKey);
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscKey);
    };
  }, [isMenuOpen]);

  const toggleMenu = () => {
    if (isMenuOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  };

  const openMenu = () => {
    setIsMenuOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
    document.body.style.overflow = "auto";
  };

  const navItems = ["Home", "Features", "Process", "Benefits", "FAQ"];

  return (
    <div 
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled ? "bg-black/80 backdrop-blur-md shadow-lg py-2" : "bg-transparent py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex-shrink-0">
            <Image src={Logo}   className="w-[130px] md:w-[160px] sm:w-[120px]" 
 alt={"examinaLogo"} />
          </div>
          
          <div className="hidden md:flex items-center space-x-6 lg:space-x-12">
            {navItems.map((item) => (
              <div 
                key={item}
                className="relative text-white font-medium group cursor-pointer"
              >
                <span className="transition-colors duration-300 group-hover:text-gray-300">{item}</span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
              </div>
            ))}
          </div>
          
          <div className="hidden md:block">
            <Button label="Portal" />
          </div>
          
          <div className="md:hidden">
            <button
              type="button"
              className="text-white inline-flex items-center justify-center p-2 rounded-md focus:outline-none"
              onClick={toggleMenu}
              aria-expanded={isMenuOpen}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              <div className="w-6 h-6 relative">
                <span 
                  className={`absolute h-0.5 w-full bg-white transform transition-all duration-300 ${
                    isMenuOpen ? "rotate-45 top-3" : "rotate-0 top-1"
                  }`}
                ></span>
                <span 
                  className={`absolute h-0.5 bg-white transform transition-all duration-300 ${
                    isMenuOpen ? "w-0 opacity-0 left-1/2 top-3" : "w-full opacity-100 top-3"
                  }`}
                ></span>
                <span 
                  className={`absolute h-0.5 w-full bg-white transform transition-all duration-300 ${
                    isMenuOpen ? "-rotate-45 top-3" : "rotate-0 top-5"
                  }`}
                ></span>
              </div>
            </button>
          </div>
        </div>
      </div>
      
      <div 
        className={`fixed inset-0 bg-black/95 z-40 transition-all duration-500 ease-in-out transform ${
          isMenuOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0 pointer-events-none"
        } md:hidden`}
        ref={menuRef}
      >
        <button
          className="absolute top-4 right-4 text-white p-2 hover:text-gray-300"
          onClick={closeMenu}
          aria-label="Close menu"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <div className="flex flex-col items-center justify-center h-full space-y-8 p-4 text-xl">
          {navItems.map((item) => (
            <div 
              key={item} 
              className="text-white font-medium relative overflow-hidden group cursor-pointer"
              onClick={closeMenu}
            >
              <span className="transition-transform duration-300 inline-block group-hover:translate-y-[-100%]">{item}</span>
              <span className="absolute top-[100%] left-0 transition-transform duration-300 inline-block group-hover:translate-y-[-100%]">{item}</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-500 group-hover:w-full"></span>
            </div>
          ))}
          <div className="pt-6">
            <Button label="Portal" onClick={closeMenu} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default NavBar;