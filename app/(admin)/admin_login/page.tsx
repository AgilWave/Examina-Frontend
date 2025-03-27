"use client";
import Image from "next/image";
import miniLogo from "@/public/imgs/loginlogo.png";
import logo from "@/public/imgs/logo.png"
import { useState } from 'react';

export default function AdminLogin() {
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
  
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
    };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-teal-900 relative overflow-hidden p-4">
      {/* Background gradient circles */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute w-64 h-64 md:w-96 md:h-96 lg:w-[500px] lg:h-[500px] 
          bg-cyan-400/60 rounded-full blur-[150px] md:blur-[250px] 
          -top-1/4 -left-1/4 transform -translate-x-1/2 -translate-y-1/2"
        />
        <div
          className="absolute w-64 h-64 md:w-96 md:h-96 lg:w-[500px] lg:h-[500px] 
          bg-teal-300/40 rounded-full blur-[150px] md:blur-[250px] 
          -bottom-1/4 -right-1/4 transform translate-x-1/2 translate-y-1/2"
        />
      </div>

      {/* Main content container */}
      <div className="relative z-10 w-full flex flex-col items-center justify-center min-h-[calc(100vh-80px)] py-8">
        {/* Login card */}
        <div
          className="bg-white p-6 md:p-8 rounded-2xl shadow-lg w-full max-w-md mx-auto
          transition-all duration-300 hover:shadow-xl"
        >
          {/* Centered Logo Container */}
          <div className="flex justify-center mb-6 w-full">
            <div className="relative ml-10 w-40 h-20 md:w-48 md:h-24"> {/* Fixed container size */}
              <Image 
                src={logo} 
                alt="Logo" 
                fill
                className="object-contain" 
                priority
              />
            </div>
          </div>

          <h1 className="text-2xl md:text-3xl font-bold text-center mb-6 text-gray-800">
            Welcome to Examina
          </h1>
          
          <p className="text-center text-gray-600 mb-8 text-sm md:text-base">
            Please enter your credentials to access the admin dashboard
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full text-black px-4 py-3 border border-gray-300 rounded-xl 
                focus:outline-none focus:ring-2 focus:ring-cyan-700 focus:border-transparent
                transition-all duration-200"
                placeholder="Enter your username"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full text-black  px-4 py-3 border border-gray-300 rounded-xl 
                focus:outline-none focus:ring-2 focus:ring-cyan-700 focus:border-transparent
                transition-all duration-200"
                placeholder="Enter your password"
                required
              />
            </div>
            
            <button
              type="submit"
              className="w-full flex justify-center items-center py-3 px-4 
              bg-gradient-to-tl from-teal-600 to-black
                  text-white font-semibold 
                  hover:from-teal-900 hover:to-cyan-900 
                  transition-all duration-300 
                  transform hover:scale-105 rounded-full 
                  shadow-lg hover:shadow-xl"
            >
              Login
            </button>
          </form>
        </div>
      </div>

      {/* Mini logo in top right */}
      <div className="absolute top-4 right-4 md:top-6 md:right-6 z-30">
        <Image
          src={miniLogo}
          width={40}
          height={40}
          className="w-8 h-8 md:w-10 md:h-10 opacity-80 hover:opacity-100 transition-opacity"
          alt="Attendia Logo"
          priority
        />
      </div>

      {/* Footer */}
      <div className="absolute bottom-4 w-full text-center text-white/75 text-xs md:text-sm font-light z-30">
        © {new Date().getFullYear()} Attendia. All rights reserved.
      </div>
    </div>
  );
}