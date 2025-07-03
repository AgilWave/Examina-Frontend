"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import university from "@/public/imgs/unidashboard.png";
import PoweredBy from "@/public/imgs/bottomlogo.png";
import examinaMobile from "@/public/imgs/examinacrop.png";
import NIBMCrop from "@/public/imgs/nibmcrop.png";

import univeristyLight from "@/public/imgs/dashboard/light/nibmdeskcolor.png";
import NIBMCropLight from "@/public/imgs/dashboard/light/NIBMMobileColor.png";
import PoweredByLight from "@/public/imgs/dashboard/light/ExaminaDeskColor.png";
import examinaMobileLight from "@/public/imgs/dashboard/light/examinamobilecolor.png";
import { usePathname } from "next/navigation";
import { LayoutGrid, GraduationCap, Medal  } from "lucide-react";
import { useTheme } from "next-themes";

const Sidebar = () => {
  const pathname = usePathname();
  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const menuItems = [
    { name: "Overview", icon: LayoutGrid, href: "/student/dashboard/overview" },
    { name: "Exams", icon: GraduationCap, href: "/student/dashboard/exams" },
    // {
    //   name: "Course Works",
    //   icon: BookCopy,
    //   href: "/student/dashboard/course-works",
    // },
    {
      name: "Results",
      icon: Medal ,
      href: "/student/dashboard/results",
    },
  ];

  if (!mounted) {
    return <aside className="h-screen w-15 md:w-64 bg-white dark:bg-black" />;
  }

  const currentTheme = theme === "system" ? systemTheme : theme;

  const getImageSource = () => {
    if (!mounted) return null;
    return currentTheme === "light" ? univeristyLight : university;
  };

  const getMobileImageSource = () => {
    if (!mounted) return null;
    return currentTheme === "light" ? NIBMCropLight : NIBMCrop;
  };

  const getPoweredByImage = () => {
    if (!mounted) return null;
    return currentTheme === "light" ? PoweredByLight : PoweredBy;
  };

  const getMobilePoweredByImage = () => {
    if (!mounted) return null;
    return currentTheme === "light" ? examinaMobileLight : examinaMobile;
  };

  return (
    <aside className="h-screen w-15 md:w-64 bg-white dark:bg-black text-black dark:text-white flex flex-col justify-between border-r border-gray-200 dark:border-teal-600/50">
      <div className="flex justify-center w-full">
        <div className="md:hidden relative w-10 h-10 mt-2">
          {mounted && (
            <Image
              src={getMobileImageSource()!}
              alt="Logo"
              fill
              className="object-contain"
              priority
            />
          )}
        </div>

        <div className="hidden md:block relative w-40 h-20 md:w-48 md:h-24">
          {mounted && (
            <Image
              src={getImageSource()!}
              alt="Logo"
              fill
              className="object-contain"
              priority
            />
          )}
        </div>
      </div>

      <nav className="flex flex-col gap-4 mt-6 p-2 md:p-5">
        <h3 className="hidden md:block">Menu</h3>

        {menuItems.map(({ name, icon: Icon, href }) => (
          <Link key={name} href={href}>
            <div
              className={`relative flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-300
                ${
                  pathname === href
                    ? `bg-gradient-to-r from-[#0db0ad] dark:from-[#00928F] to-[#03d9d9] dark:to-[#0BA5A4] 
                       text-[#2D2D2D] dark:text-white shadow-inner 
                       before:absolute before:w-full before:h-6 before:bg-gradient-to-b before:from-white before:to-transparent 
                       before:opacity-40 before:rounded-t-lg before:left-0 before:top-0 dark:before:hidden 
                       after:absolute after:w-full after:h-6 after:bg-gradient-to-t after:from-white after:to-transparent 
                       after:opacity-40 after:rounded-b-lg after:left-0 after:bottom-0 dark:after:hidden`
                    : "text-[#2D2D2D] dark:text-gray-300 hover:bg-gradient-to-r from-[#0db0ad] to-[#03d9d9] dark:hover:from-[#00928F] dark:hover:to-[#0BA5A4]"
                }`}
              title={name}
            >
              <Icon size={20} />
              <span className="hidden md:flex md:flex-grow text-[#2D2D2D] dark:text-gray-100">
                {name}
              </span>
            </div>
          </Link>
        ))}
      </nav>

      <div className="flex flex-col items-center w-full mt-auto pb-4">
        {mounted && (
          <>
            <div className="hidden md:block relative w-24 h-12">
              <div className="text-center text-gray-800 dark:text-gray-500 text-xs -mt-3 relative">
                <p>Powered By</p>
              </div>
              <Image
                src={getPoweredByImage()!}
                alt="Powered By Logo"
                fill
                className="w-16 h-8 object-contain"
              />
            </div>

            <div className="md:hidden relative w-12 h-6">
              <Image
                src={getMobilePoweredByImage()!}
                alt="Powered By Logo"
                fill
                className="object-contain"
              />
            </div>
          </>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
