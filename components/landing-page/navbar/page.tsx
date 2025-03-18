"use client";

import Button from "@/components/common/button";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Logo from "@/public/imgs/logo.png";

function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
      
      const sections = document.querySelectorAll("section[id], main[id]");
      const scrollPosition = window.scrollY + 100; 
      
      sections.forEach((section) => {
        const sectionTop = (section as HTMLElement).offsetTop;
        const sectionHeight = (section as HTMLElement).offsetHeight;
        const sectionId = section.getAttribute("id") || "";
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
          setActiveSection(sectionId);
        }
      });
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

  // Handle smooth scrolling
  const scrollToSection = (sectionId: string) => {
    const sectionElement = document.getElementById(sectionId.toLowerCase());
    
    if (sectionElement) {
      if (isMenuOpen) {
        closeMenu();
      }
      
      window.scrollTo({
        top: sectionElement.offsetTop - 80, // Adjust offset to account for navbar height
        behavior: "smooth"
      });
      
      history.pushState(null, "", `#${sectionId.toLowerCase()}`);
    }
  };

  const navItems = ["Home", "Features", "Process", "Benefits", "FAQ"];

  return (
    <>
      <div
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          scrolled
            ? "bg-black/80 backdrop-blur-md shadow-lg py-2"
            : "bg-transparent py-4"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-32 2xl:px-8">
          <div className="flex justify-between items-center">
            <div className="flex-shrink-0">
              <Image
                src={Logo}
                className="w-[130px] md:w-[160px] sm:w-[120px]"
                alt="examinaLogo"
                priority
              />
            </div>

            <div className="hidden md:flex items-center space-x-6 lg:space-x-12">
              {navItems.map((item) => (
                <div
                  key={item}
                  className={`relative text-white font-medium group cursor-pointer ${
                    activeSection === item.toLowerCase() ? "text-white" : "text-white/80"
                  }`}
                  onClick={() => scrollToSection(item)}
                >
                  <span className="transition-colors duration-300 group-hover:text-gray-300">
                    {item}
                  </span>
                  <span 
                    className={`absolute bottom-0 left-0 h-0.5 bg-white transition-all duration-300 ${
                      activeSection === item.toLowerCase() ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  ></span>
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
      </div>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 bg-black h-[80%] rounded-b-4xl z-50 md:hidden transition-transform duration-500 ease-in-out ${
          isMenuOpen ? "translate-y-0" : "-translate-y-full"
        }`}
        ref={menuRef}
      >
        <div className=" flex flex-col items pt-4 justify-between h-full">
          <div className="flex justify-between items-center px-4 sm:px-6">
            <div className="flex-shrink-0">
              <Image
                src={Logo}
                className="w-[130px]"
                alt="examinaLogo"
                priority
              />
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

          <div className="flex-1 flex flex-col items-center justify-center space-y-8">
            {navItems.map((item, index) => (
              <div
                key={item}
                className={`text-white font-medium text-2xl transition-all duration-300 ease-in-out transform ${
                  isMenuOpen
                    ? "translate-y-0 opacity-100"
                    : "translate-y-4 opacity-0"
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
                onClick={() => scrollToSection(item)}
              >
                <span className={`hover:text-gray-300 text-lg transition-colors duration-300 ${
                  activeSection === item.toLowerCase() ? "text-white" : "text-white/80"
                }`}>
                  {item}
                </span>
              </div>
            ))}
          </div>

          <div
            className={`flex justify-center pb-12 transition-all duration-300 ease-in-out transform ${
              isMenuOpen
                ? "translate-y-0 opacity-100"
                : "translate-y-4 opacity-0"
            }`}
            style={{ transitionDelay: `${navItems.length * 100}ms` }}
          >
            <Button className="text-base" label="Portal" onClick={closeMenu} />
          </div>
        </div>
      </div>
    </>
  );
}

export default NavBar;