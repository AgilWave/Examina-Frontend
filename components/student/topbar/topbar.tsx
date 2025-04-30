"use client";

import Image from "next/image";
import defaultUserAvatar from "@/public/imgs/useraccount.png";
import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import {
  Search,
  Bell,
  ChevronDown,
  User,
  Settings,
  LogOut,
  X,
  Moon,
  Sun,
} from "lucide-react";
import Cookies from "js-cookie";
import { decrypt } from "@/lib/encryption";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { signOut } from "next-auth/react";

const Topbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [userName, setUserName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const userAvatar = defaultUserAvatar;

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = async () => {
    setIsAlertOpen(false);
    setIsDropdownOpen(false);
    try {
      await signOut({ redirect: false });
      Cookies.remove("userDetails");
      Cookies.remove("jwt");
      toast.success("Logged out successfully!");
      router.push("/login");
    } catch (error) {
      console.error(error)
      toast.error("Failed to log out. Please try again.");
    }
  };
  useEffect(() => {
    const userData = Cookies.get("userDetails");
    if (userData) {
      const decryptedData = decrypt(userData);
      const parsedData = JSON.parse(decryptedData);
      setUserName(parsedData.name || "");
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node) &&
        isSearchExpanded
      ) {
        setIsSearchExpanded(false);
        setSearchQuery("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isSearchExpanded]);

  const toggleSearch = () => {
    setIsSearchExpanded(!isSearchExpanded);
    if (!isSearchExpanded) {
      setSearchQuery("");
    }
  };

  if (!mounted) {
    return (
      <div className="w-full h-16 bg-white dark:bg-black text-gray-800 dark:text-gray-100 flex items-center justify-between px-4 md:px-6 shadow-sm border-b border-gray-200 dark:border-teal-600/50 relative"></div>
    );
  }

  return (
    <div className="w-full h-16 bg-white dark:bg-black text-gray-800 dark:text-gray-100 flex items-center justify-between px-4 md:px-6 shadow-sm border-b border-gray-200 dark:border-teal-600/50 relative">
      <div className="flex-1 flex items-center">
        {!isSearchExpanded && (
          <button
            onClick={toggleSearch}
            className="md:hidden p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 focus:outline-none"
          >
            <Search className="h-5 w-5" />
          </button>
        )}

        <div
          ref={searchRef}
          className={`${
            isSearchExpanded
              ? "absolute -left-60 right-40 md:justify-items-start md:relative md:left-0 md:right-0"
              : "hidden md:block"
          } ml-[260px]`}
        >
          <div className="relative flex items-center">
            {isSearchExpanded && (
              <button
                onClick={toggleSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white md:hidden"
              >
                <X className="h-5 w-5" />
              </button>
            )}
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`
                 w-full pl-10 pr-4 py-2
      bg-gray-100 dark:bg-[#0A0A0A] border-gray-300 dark:border-gray-600 rounded-3xl
      text-gray-700 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400
      focus:outline-none focus:ring-2
      focus:ring-teal-500 focus:border-transparent
              `}
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-4 md:space-x-6">
        <div suppressHydrationWarning className="flex items-center space-x-2">
          <Switch
            checked={theme === "dark"}
            onCheckedChange={() =>
              setTheme(theme === "dark" ? "light" : "dark")
            }
            className="bg-gray-600 cursor-pointer"
          />
          {theme === "light" ? (
            <Sun className="h-5 w-5 text-yellow-500" />
          ) : (
            <Moon className="h-5 w-5 text-gray-400" />
          )}
        </div>

        <div className="relative">
          <Bell className="h-5 w-5 md:h-6 md:w-6 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 cursor-pointer" />
          <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full h-4 w-4 flex items-center justify-center text-xs">
            3
          </span>
        </div>

        <div className="relative" ref={dropdownRef}>
          <div
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center space-x-2 cursor-pointer"
          >
            <div className="hidden md:flex flex-col items-end">
              <span className="text-sm font-medium">{userName}</span>
              <span className="text-xs text-gray-600 dark:text-gray-400 ">
                Student
              </span>
            </div>
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full overflow-hidden border border-teal-500">
              <Image
                src={userAvatar}
                alt="User Avatar"
                width={40}
                height={40}
                className="w-full h-full object-cover"
              />
            </div>
            <ChevronDown
              className={`h-4 w-4 dark:text-white text-black transition-transform ${
                isDropdownOpen ? "rotate-180" : ""
              }`}
            />
          </div>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 overflow-hidden">
              <ul className="py-1">
                <li className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-950 flex items-center cursor-pointer transition-colors text-gray-800 dark:text-gray-200">
                  <User className="mr-2 h-4 w-4 text-gray-500 dark:text-gray-400" />{" "}
                  Profile
                </li>
                <li className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center cursor-pointer transition-colors text-gray-800 dark:text-gray-200">
                  <Settings className="mr-2 h-4 w-4 text-gray-500 dark:text-gray-400" />{" "}
                  Settings
                </li>
                <li className="border-t border-teal-800 dark:border-teal-600">
                  <div
                    className="px-4 py-2 hover:bg-red-100 dark:hover:bg-red-900/50 flex items-center cursor-pointer transition-colors text-red-600 dark:text-red-400"
                    onClick={() => {
                      setIsAlertOpen(true);
                      setIsDropdownOpen(false);
                    }}
                  >
                    <LogOut className="mr-2 h-4 w-4" /> Logout
                  </div>
                </li>
              </ul>
            </div>
          )}
        </div>

        <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Are you sure you want to log out?
              </AlertDialogTitle>
              <AlertDialogDescription>
                You&apos;ll need to log in again to access your account.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter className="flex gap-3 mt-4">
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors cursor-pointer"
              >
                Yes, log me out
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default Topbar;
