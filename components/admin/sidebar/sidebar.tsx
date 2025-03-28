'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import university from '@/public/imgs/unidashboard.png';
import PowerdBy from '@/public/imgs/bottomlogo.png';
import { usePathname } from 'next/navigation';
import { LayoutGrid, Settings, BookCopy, GraduationCap } from 'lucide-react';

const Sidebar = () => {
  const pathname = usePathname();
  const [hovered, setHovered] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const menuItems = [
    { name: 'Overview', icon: LayoutGrid, href: '/' },
    { name: 'Exams', icon: GraduationCap, href: '/exams' },
    { name: 'Reports', icon: BookCopy, href: '/reports' },
  ];

  return (
    <aside
      className={`h-screen bg-black text-white flex flex-col justify-between border-r border-[#26FEFD36]
        ${isMobile ? 'w-20' : 'w-64'}`}
    >
      {/* Logo - Responsive */}
      <div className="flex justify-center w-full">
        <div 
          className={`relative ${
            isMobile 
              ? 'w-12 h-10 mt-2' 
              : 'w-40 h-20 md:w-48 md:h-24'
          }`}
        >
          <Image
            src={university}
            alt="Logo"
            fill
            className="object-contain"
            priority
          />
        </div>
      </div>

      {/* Menu Items */}
      <nav className="flex flex-col gap-4 mt-6 p-5">
        {!isMobile && <h3>Menu</h3>}
        {menuItems.map(({ name, icon: Icon, href }) => (
          <Link key={name} href={href}>
            <div
              className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-300
                ${pathname === href ? 'bg-gradient-to-r from-[#00928F] to-[#0BA5A4] text-white shadow-inner'
                  : 'text-gray-300 hover:bg-gradient-to-r hover:from-[#00928F] hover:to-[#0BA5A4]'}`}
              onMouseEnter={() => setHovered(name)}
              onMouseLeave={() => setHovered(null)}
              title={isMobile ? name : undefined}
            >
              <Icon size={20} />
              {!isMobile && (
                <>
                  <span className="flex-grow">{name}</span>
                </>
              )}
            </div>
          </Link>
        ))}
      </nav>

      {/* Footer - Responsive */}
      <div 
        className={`flex flex-col items-center w-full mt-auto pb-4 ${
          isMobile ? 'text-center' : ''
        }`}
      >
        {!isMobile ? (
          <div className="relative w-24 h-12">
            <div className="text-center text-gray-500 text-xs -mt-3 relative">
              <p>Powered By</p>
            </div>
            <Image
              src={PowerdBy}
              alt="Powered By Logo"
              fill
              className="w-16 h-8 object-contain"
            />
          </div>
        ) : (
          <div 
            className="relative w-12 h-6"
          >
            <Image
              src={PowerdBy}
              alt="Powered By Logo"
              fill
              className="object-contain"
            />
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;