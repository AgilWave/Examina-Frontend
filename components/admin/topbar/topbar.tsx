"use client";

import Image from 'next/image';
import defaultUserAvatar from '@/public/imgs/useraccount.png';
import React, { useState, useRef, useEffect } from 'react';
import { Search, Bell, ChevronDown, User, Settings, LogOut, X } from 'lucide-react';

interface TopbarProps {
  userName?: string;
  userAvatar?: string;
}

const Topbar: React.FC<TopbarProps> = ({ 
  userName = "Shehal Herath", 
  userAvatar = defaultUserAvatar
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node) && isSearchExpanded) {
        setIsSearchExpanded(false);
        setSearchQuery('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isSearchExpanded]);

  const toggleSearch = () => {
    setIsSearchExpanded(!isSearchExpanded);
    if (!isSearchExpanded) {
      setSearchQuery('');
    }
  };

  return (
    <div className="w-full h-16 bg-black text-white flex items-center justify-between px-4 md:px-6 shadow-sm border-b border-[#26FEFD36] relative">
      {/* Left side - Search Bar */}
      <div className="flex-1 flex items-center">
        {/* Mobile Search Button (hidden on desktop and when search is expanded) */}
        {!isSearchExpanded && (
          <button 
            onClick={toggleSearch}
            className="md:hidden p-2 text-gray-400 hover:text-white focus:outline-none"
          >
            <Search className="h-5 w-5" />
          </button>
        )}

        {/* Search Container */}
        <div 
          ref={searchRef}
          className={`${isSearchExpanded ? 'absolute -left-60 right-40 md:justify-items-start md:relative md:left-0 md:right-0' : 'hidden md:block'} ml-[260px]`}
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
                bg-[#D9D9D933] border-gray-700 rounded-3xl
                text-[#D9D9D9] focus:outline-none focus:ring-2
                focus:ring-teal-600 focus:border-transparent
              `}
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Right Side Icons */}
      <div className="flex items-center space-x-4 md:space-x-6">
        {/* Notification Icon */}
        <div className="relative">
          <Bell className="h-5 w-5 md:h-6 md:w-6 text-white hover:text-gray-300 cursor-pointer" />
          <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full h-4 w-4 flex items-center justify-center text-xs">
            3
          </span>
        </div>

        {/* User Profile */}
        <div className="relative" ref={dropdownRef}>
          <div 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center space-x-2 cursor-pointer"
          >
            <div className="hidden md:flex flex-col items-end">
              <span className="text-sm font-medium">{userName}</span>
              <span className="text-xs text-gray-400">Admin</span>
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
            <ChevronDown className={`h-4 w-4 text-white transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </div>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-black border border-teal-600 rounded-lg shadow-lg z-50 overflow-hidden">
              <ul className="py-1">
                <li className="px-4 py-2 hover:bg-teal-600/50 flex items-center cursor-pointer transition-colors">
                  <User className="mr-2 h-4 w-4" /> Profile
                </li>
                <li className="px-4 py-2 hover:bg-teal-600/50 flex items-center cursor-pointer transition-colors">
                  <Settings className="mr-2 h-4 w-4" /> Settings
                </li>
                <li className="border-t border-teal-600">
                  <div className="px-4 py-2 hover:bg-red-600/50 flex items-center cursor-pointer transition-colors text-white">
                    <LogOut className="mr-2 h-4 w-4" /> Logout
                  </div>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Topbar;