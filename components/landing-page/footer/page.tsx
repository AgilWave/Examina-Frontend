import React from "react";
import Image from "next/image";
import Logo from "@/public/imgs/landing-page/Footer/BottomLogo.png";
import LogoIn from "@/public/imgs/landing-page/Footer/instagram.png";
import LogoLn from "@/public/imgs/landing-page/Footer/linkedin.png";
import LogoYT from "@/public/imgs/landing-page/Footer/youtube.png";
import { ArrowRight } from "lucide-react";

function Footer() {
  const currentYear = new Date().getFullYear();
  const socialLinks = [
    { icon: LogoIn, alt: "Instagram" },
    { icon: LogoLn, alt: "LinkedIn" },
    { icon: LogoYT, alt: "YouTube" }
  ];

  const footerLinks = [
    {
      title: "Features",
      links: ["Features", "Contact us", "Benefits"]
    },
    {
      title: "Quick Links",
      links: ["FAQ", "About us"]
    },
    {
      title: "Resources",
      links: ["NIBM World Wide", "NIBM LMS"]
    }
  ];

  return (
    <footer className="bg-white dark:bg-gray-900 w-full rounded-t-3xl md:rounded-t-[50px]">
      <div className="bg-gray-50 py-12 px-4 md:px-8 lg:px-16 rounded-t-3xl md:rounded-t-[50px]">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-5 gap-8">
          <div className="md:col-span-2 space-y-4">
            <div className="w-48 mb-4">
              <Image 
                src={Logo} 
                alt="Examina Logo" 
                className="w-full h-auto"
              />
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">
              AI-powered online examination platform for secure, scalable, 
              and efficient test management with real-time analytics and proctoring.
            </p>
          </div>

          {footerLinks.map((section, index) => (
            <div key={index} className="space-y-4">
              <h4 className="text-gray-800 font-semibold text-lg">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <li 
                    key={linkIndex} 
                    className="text-gray-600 text-sm hover:text-teal-600 
                    transition-colors cursor-pointer"
                  >
                    {link}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="md:col-span-2 space-y-6">
            <div>
              <h4 className="text-gray-800 font-semibold text-lg mb-4">Subscribe</h4>
              <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                <input
                  type="email"
                  placeholder="Get product updates"
                  className="flex-grow px-4 py-3 text-sm text-gray-700 outline-none"
                />
                <button className="bg-[#0C7E7D] text-white px-4 hover:bg-teal-700 transition-colors cursor-pointer">
                <ArrowRight size={24} className="text-white" />
                </button>
              </div>
            </div>

            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <div 
                  key={index} 
                  className="p-2 bg-gray-200 rounded-full hover:bg-teal-100 
                  transition-all cursor-pointer"
                >
                  <Image 
                    src={social.icon} 
                    alt={social.alt} 
                    width={24} 
                    height={24} 
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-300 my-8"></div>

        <div className="text-center text-gray-600 text-sm">
          © {currentYear} Examina. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;