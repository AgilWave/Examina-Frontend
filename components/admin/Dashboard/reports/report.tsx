import { FC } from "react";
import SectionTiles from "@/components/ui/section-tiles";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {FileText  } from "lucide-react";

const ReportContent: FC = () => {
  const items = [
    { icon: <FileText   size={30} color="#FFFFFF" />, title: "Report 1", link: "/admin/dashboard/reports/report1" },
    { icon: <FileText    size={30} color="#FFFFFF" />, title: "Report 2", link: "/admin/dashboard/reports/report1" },
    { icon: <FileText    size={30} color="#FFFFFF" />, title: "Reoport 3", link: "/admin/dashboard/reports/report1" },
  ];

  return (
    <div className="h-fit bg-gradient-to-br text- dark:text-white p-1 md:p-8">
      <div className="max-w-8xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div className="flex flex-col gap-2">
            <Breadcrumb className="text-gray-400" aria-label="Breadcrumb">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink
                    href="/admin/dashboard/overview"
                    className="text-black/80 dark:text-gray-400"
                  >
                    Dashboard
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator>/</BreadcrumbSeparator>
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-black/50 dark:text-gray-400">
                    Reports
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <h1 className="text-3xl font-bold text-black/90 dark:text-gray-100">
              Reports Section
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              Manage all reports and analysis here.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 md:w-fit gap-4 md:gap-8">
          {items.map((item, index) => (
            <SectionTiles
              key={index}
              link={item.link}
              icon={item.icon}
              title={item.title}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReportContent;
