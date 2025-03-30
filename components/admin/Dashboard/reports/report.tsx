import { FC } from "react";
import Link from "next/link";
import {FileText  } from "lucide-react";

const ReportContent: FC = () => {
  const items = [
    { icon: <FileText   size={30} color="#FFFFFF" />, title: "Report 1", link: "/admin/dashboard/reports/report1" },
    { icon: <FileText    size={30} color="#FFFFFF" />, title: "Report 2", link: "/admin/dashboard/reports/report1" },
    { icon: <FileText    size={30} color="#FFFFFF" />, title: "Reoport 3", link: "/admin/dashboard/reports/report1" },
  ];

  return (
    <div className="flex flex-wrap gap-6 justify-start p-10 md:p-20 lg:p-24">
      {items.map((item, index) => (
        <Link key={index} href={item.link}>
          <div
            className="w-40 h-40 flex flex-col items-center justify-center border-2 border-teal-400 rounded-4xl shadow-md p-4 text-center transition-all transform hover:scale-105 hover:shadow-xl hover:bg-gradient-to-tl hover:from-cyan-500/15 hover:to-black/20 sm:w-48 sm:h-48 md:w-56 md:h-56 cursor-pointer"
          >
            <div className="w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center bg-[#158584] rounded-full text-teal-500 mb-2">
              {item.icon}
            </div>
            <p className="text-sm font-regular text-white mt-4 sm:mt-6 md:text-base md:mt-10">{item.title}</p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default ReportContent;
