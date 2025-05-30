'use client'
import React, { useState, useEffect } from 'react';
import { Home } from 'lucide-react';
import Button from "@/components/common/button";

export default function NotFound() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 sm:p-6 md:p-8">
      <div className={`max-w-2xl w-full text-center transition-all duration-1000 ${
        mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}>
        
        <div className="mb-6 sm:mb-8 relative" style={{ animationDuration: '4s' }}>
          <div className="absolute inset-0 bg-gradient-to-r from-teal-500/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse" />
          <svg width="240" height="180" viewBox="0 0 200 160" className="mx-auto relative w-[240px] h-[180px] sm:w-[280px] sm:h-[210px]">
            <defs>
              <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#14B8A6', stopOpacity: 0.8 }} />
                <stop offset="100%" style={{ stopColor: '#06B6D4', stopOpacity: 0.8 }} />
              </linearGradient>
            </defs>
            
            <ellipse cx="100" cy="40" rx="50" ry="25" fill="url(#grad1)" opacity="0.8" className="animate-float"/>
            <ellipse cx="85" cy="35" rx="35" ry="20" fill="#4B5563" opacity="0.9" className="animate-float-delayed"/>
            <ellipse cx="115" cy="35" rx="35" ry="20" fill="#4B5563" opacity="0.9" className="animate-float-delayed"/>
            
            <circle cx="85" cy="35" r="3" fill="#14B8A6" className="animate-twinkle"/>
            <circle cx="115" cy="35" r="3" fill="#14B8A6" className="animate-twinkle-delayed"/>
            <path d="M 95 42 Q 100 47 105 42" stroke="#14B8A6" strokeWidth="2" fill="none" strokeLinecap="round" className="animate-smile"/>
            
            <text x="60" y="90" fill="#14B8A6" fontSize="24" fontWeight="bold" opacity="0.8" className="animate-slide-in">4</text>
            <text x="90" y="100" fill="#06B6D4" fontSize="28" fontWeight="bold" className="animate-slide-in-delayed">0</text>
            <text x="120" y="85" fill="#14B8A6" fontSize="24" fontWeight="bold" opacity="0.8" className="animate-slide-in">4</text>
            
            <circle cx="40" cy="50" r="2" fill="#14B8A6" opacity="0.6" className="animate-float-slow"/>
            <circle cx="160" cy="45" r="2" fill="#06B6D4" opacity="0.6" className="animate-float-slow-delayed"/>
            <circle cx="170" cy="70" r="1.5" fill="#14B8A6" opacity="0.4" className="animate-float-slow"/>
          </svg>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-400 mb-4 sm:mb-6 animate-fade-in">
          Page Not Found
        </h1>
        <p className="text-gray-300 mb-8 sm:mb-10 text-lg sm:text-xl animate-fade-in-delayed max-w-lg mx-auto">
          Oops! This page seems to be lost in the clouds.
        </p>

        <Button 
          label="Return Home"
          onClick={() => window.location.href = '/'}
          className="group gap-2 text-lg bg-black border-teal-500 text-teal-300 cursor-pointer"
          icon={<Home className="w-5 h-5 group-hover:animate-bounce" />}
        />
      </div>

      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        @keyframes float-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        @keyframes twinkle {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        @keyframes smile {
          0% { transform: scaleY(0.8); }
          50% { transform: scaleY(1.2); }
          100% { transform: scaleY(0.8); }
        }
        @keyframes slide-in {
          0% { transform: translateX(-20px); opacity: 0; }
          100% { transform: translateX(0); opacity: 1; }
        }
        .animate-float { animation: float 3s ease-in-out infinite; }
        .animate-float-delayed { animation: float 3s ease-in-out infinite 0.5s; }
        .animate-float-slow { animation: float-slow 4s ease-in-out infinite; }
        .animate-float-slow-delayed { animation: float-slow 4s ease-in-out infinite 1s; }
        .animate-twinkle { animation: twinkle 2s ease-in-out infinite; }
        .animate-twinkle-delayed { animation: twinkle 2s ease-in-out infinite 1s; }
        .animate-smile { animation: smile 3s ease-in-out infinite; }
        .animate-slide-in { animation: slide-in 0.5s ease-out forwards; }
        .animate-slide-in-delayed { animation: slide-in 0.5s ease-out 0.2s forwards; }
        .animate-fade-in { animation: fadeIn 0.8s ease-out forwards; }
        .animate-fade-in-delayed { animation: fadeIn 0.8s ease-out 0.3s forwards; }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}