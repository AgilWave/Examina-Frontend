
'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import university from '@/public/imgs/unidashboard.png';
import PowerdBy from '@/public/imgs/bottomlogo.png';
import { usePathname } from 'next/navigation';
import { LayoutGrid , CalendarDays , Settings, MessageSquare, Award , BookCopy , GraduationCap  } from 'lucide-react';

const Sidebar = () => {
  const pathname = usePathname();
  const [hovered, setHovered] = useState<string | null>(null);

  const menuItems = [
    { name: 'Overview', icon: LayoutGrid, href: '/' },
    { name: 'Exams', icon: GraduationCap , href: '/exams' },
    { name: 'Results', icon: Award , href: '/results' },
    { name: 'Reports', icon: BookCopy  , href: '/reports' },
    { name: 'Calendar', icon: CalendarDays , href: '/calendar' },
    { name: 'Messages', icon: MessageSquare, href: '/messages', badge: 4 },
  ];

  return (
    <aside className="w-64 h-screen bg-black text-white flex flex-col justify-between border-r border-[#26FEFD36]">
      {/* Logo */}
      <div className="flex justify-center w-full">
            <div className="relative w-40 h-20 md:w-48 md:h-24">
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
        <h3>Menu</h3>
        {menuItems.map(({ name, icon: Icon, href, badge }) => (
          <Link key={name} href={href}>
            <div
              className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-300
                ${pathname === href || hovered === name ? 'bg-gradient-to-r from-[#00928F] to-[#0BA5A4] text-white shadow-inner shadow-[#E7E7E7]'
                  : 'text-gray-300 hover:bg-gradient-to-r hover:from-[#00928F] hover:to-[#0BA5A4] hover:shadow-drop hover:shadow-[#E7E7E7]'}`}
              onMouseEnter={() => setHovered(name)}
              onMouseLeave={() => setHovered(null)}
            >
              <Icon size={20} />
              <span className="flex-grow">{name}</span>
              {badge && (
                <span className="bg-red-500 text-xs text-white px-2 py-1 rounded-full">{badge}</span>
              )}
            </div>
          </Link>
        ))}
      </nav>

      <div className="w-full border-t-1 border-[#26FEFD36] my-4"></div>

      {/* Settings */}
      <div className="mt-2 p-5">
        <Link href="/settings">
        <div className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-300
                ${pathname === '/settings' || hovered === 'Settings' ? 'bg-gradient-to-r from-[#00928F] to-[#0BA5A4] text-white shadow-inner shadow-[#E7E7E7]'
                  : 'text-gray-300 hover:bg-gradient-to-r hover:from-[#00928F] hover:to-[#0BA5A4] hover:shadow-drop hover:shadow-[#E7E7E7]'}`}
              onMouseEnter={() => setHovered('Settings')}
              onMouseLeave={() => setHovered(null)}>
            <Settings size={20} />
            <span>Settings</span>
          </div>
        </Link>
      </div>

      {/* Footer */}
        <div className="flex justify-center w-full mt-auto pb-4">
        <div className="relative w-24 h-12">
          <div className="text-center text-gray-500 text-xs -mt-3 relative">
            <p>Powered By</p>
          </div>
          <Image
            src={PowerdBy}
            alt="Logo"
            fill
            className="w-16 h-8 object-contain"
          />
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
