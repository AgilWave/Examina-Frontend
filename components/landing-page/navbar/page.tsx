import Button from "@/components/common/button";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Logo from "@/public/imgs/logo.png";

function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isMenuOpen &&
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        closeMenu();
      }
    };

    const handleEscKey = (event: KeyboardEvent) => {
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
      className={`fixed top-0 left-0 w-full z-30 transition-all duration-300 ${
        scrolled
          ? "bg-black/80 backdrop-blur-md shadow-lg py-2"
          : "bg-transparent py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex-shrink-0">
            <Image
              src={Logo}
              className="w-[130px] md:w-[160px] sm:w-[120px]"
              alt={"examinaLogo"}
            />
          </div>

          <div className="hidden md:flex items-center space-x-6 lg:space-x-12">
            {navItems.map((item) => (
              <div
                key={item}
                className="relative text-white font-medium group cursor-pointer"
              >
                <span className="transition-colors duration-300 group-hover:text-gray-300">
                  {item}
                </span>
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
                    isMenuOpen
                      ? "w-0 opacity-0 left-1/2 top-3"
                      : "w-full opacity-100 top-3"
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
        className={`fixed inset-0 bg-black/95 z-50 h-[90%] rounded-b-[50px] w-screen md:hidden transition-all duration-500 ease-in-out ${
          isMenuOpen
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-full pointer-events-none"
        }`}
        ref={menuRef}
      >
        <div className="h-full flex flex-col">
          <div className="flex justify-between items-center p-4">
            <div className="flex-shrink-0">
              <Image src={Logo} className="w-[130px]" alt={"examinaLogo"} />
            </div>
            <button
              className="text-white p-2 hover:text-gray-300"
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
          </div>

          <div className="flex-1 flex flex-col items-center justify-center">
            {navItems.map((item, index) => (
              <div
                key={item}
                className={`text-white font-medium relative cursor-pointer text-xl py-4 transition-all duration-500 ease-in-out ${
                  isMenuOpen
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
                onClick={closeMenu}
              >
                <span className="transition-colors duration-300 hover:text-gray-300">
                  {item}
                </span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-500 group-hover:w-full"></span>
              </div>
            ))}
          </div>
          <div
            className={`flex justify-center pb-10 transition-all duration-500 ease-in-out ${
              isMenuOpen
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
            style={{ transitionDelay: `${navItems.length * 100 + 100}ms` }}
          >
            <Button label="Portal" onClick={closeMenu} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default NavBar;
