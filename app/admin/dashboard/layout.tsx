"use client";

import Topbar from "@/components/admin/topbar/topbar";
import Sidebar from "@/components/admin/sidebar/sidebar";
import { useState, useEffect } from "react";
import { LoadingScreen } from "@/components/ui/loadingScreen";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const [sidebarWidth, setSidebarWidth] = useState(260);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const updateSidebarWidth = () => {
      const sidebar = document.querySelector("[data-sidebar]");
      if (sidebar) {
        setSidebarWidth(sidebar.getBoundingClientRect().width);
      }
    };

    if (!isLoading) {
      updateSidebarWidth();
      window.addEventListener("resize", updateSidebarWidth);
    }

    return () => window.removeEventListener("resize", updateSidebarWidth);
  }, [isLoading]);

  return (
    <div className="flex h-screen overflow-hidden bg-[#F6F6F6] dark:bg-[#0A0A0A] text-white">
      {isLoading ? (
        <LoadingScreen onLoadingComplete={() => setIsLoading(false)} />
      ) : (
        <>
          <aside className="fixed h-full z-30" data-sidebar>
            <Sidebar />
          </aside>

          <div
            className="flex flex-col w-full transition-all duration-300"
            style={{ marginLeft: `${sidebarWidth}px` }}
          >
            <header className="sticky top-0 z-20">
              <Topbar />
            </header>

            <main className="flex-1 p-6 overflow-y-auto scrollbar-custom">
              {children}
            </main>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminLayout;
