"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  Line,
} from "recharts";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { OverView } from "@/services/dashbord/overview";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import {
  BookCopy,
  BookOpen,
  Users,
  Hourglass,
  MoveUp
} from "lucide-react";

type ActivityStatus = "Ongoing" | "Pending" | "Completed";

interface RecentAccess {
  studentName: string;
  studentId: string;
  time: string;
  avatar: string | null;
}

interface StatData {
  count: number;
  last24h: number;
}

interface ExaminationSummaryItem {
  month: string;
  count: number;
}

interface StudentParticipationItem {
  label: string;
  count: number;
}

interface UpcomingActivities {
  title: string;
  type: string;
  date: string;
  status: string;
}

interface OverviewData {
  totalExams: StatData;
  totalStudents: StatData;
  totalLecturers: StatData;
  totalHours: StatData;
  examinationSummary: ExaminationSummaryItem[];
  studentParticipation: StudentParticipationItem[];
  recentAccess: RecentAccess[];
  upcomingActivities?: UpcomingActivities[];
}

const StatCard: React.FC<{
  title: string;
  data: StatData;
  icon?: React.ReactNode;
  highlight?: boolean;
}> = ({ title, data, icon, highlight }) => {
  return (
    <div
      className={`p-6 rounded-2xl transition-all duration-300 transform hover:scale-102
        ${
          highlight
            ? "bg-gradient-to-l from-teal-600/60 to-teal-500/60 text-white"
            : "bg-[#F6F6F6] text-black dark:bg-[#0A0A0A] dark:text-gray-300"
        }
        dark:shadow-lg  hover:bg-gray-100 dark:hover:bg-black/90 dark:border dark:border-teal-600/50 hover:border-teal-500 backdrop-blur-sm
        flex flex-col justify-between h-48`}
    >
      <div className="flex justify-between items-start">
        <h3 className="text-1.5xl font-bold">{title}</h3>
        <div
          className={`p-2 rounded-full ${
            highlight
              ? "bg-white/20 text-white dark:bg-white/10 dark:text-teal-300"
              : "bg-black/10 text-teal-500 dark:bg-white/10 dark:text-teal-300"
          }`}
        >
          {icon}
        </div>
      </div>

      <div className="flex justify-center items-center flex-grow">
        <p className="text-4xl font-bold">{data.count}</p>
      </div>

      <div
        className={`flex items-center text-sm ${
          highlight ? "text-white" : "text-gray-700 dark:text-white"
        }`}
      >
        <MoveUp className="w-4 h-4" />+{data.last24h} Past 24 Hours
      </div>
    </div>
  );
};

const CodeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="stroke-gray-700 dark:stroke-cyan-400"
  >
    <polyline points="16 18 22 12 16 6"></polyline>
    <polyline points="8 6 2 12 8 18"></polyline>
  </svg>
);

const ServerIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="stroke-gray-700 dark:stroke-cyan-400"
  >
    <rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect>
    <rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect>
    <line x1="6" y1="6" x2="6.01" y2="6"></line>
    <line x1="6" y1="18" x2="6.01" y2="18"></line>
  </svg>
);

const renderStatus = (status: ActivityStatus) => {
  const baseStyles = "px-3 py-1.5 rounded-lg text-sm font-medium";

  switch (status) {
    case "Ongoing":
      return (
        <span
          className={`${baseStyles} bg-gradient-to-b from-cyan-400 to-cyan-600 dark:from-blue-500/20 dark:to-blue-400/20  text-gray-100 dark:text-blue-400 dark:border border-blue-500/10 shadow-inner dark:shadow-none`}
        >
          Ongoing
        </span>
      );
    case "Pending":
      return (
        <span
          className={`${baseStyles} bg-gradient-to-b from-yellow-200 to-yellow-400 dark:from-yellow-500/20 dark:to-yellow-500/20  dark:bg-yellow-500/20 text-gray-800 dark:text-yellow-400 dark:border border-yellow-400 dark:border-yellow-500/30 shadow-inner dark:shadow-none`}
        >
          Pending
        </span>
      );
    case "Completed":
      return (
        <span
          className={`${baseStyles} bg-gradient-to-b from-green-300 to-green-500 dark:from-green-500/20 dark:to-green-500/20 text-gray-700 dark:text-green-400 dark:border border-green-300 dark:border-green-500/30 shadow-inner dark:shadow-none`}
        >
          Completed
        </span>
      );
    default:
      return (
        <span
          className={`${baseStyles} bg-gray-500/20 text-gray-400 border border-gray-500/30`}
        >
          {status}
        </span>
      );
  }
};

const renderIcon = (iconType: "code" | "server") => {
  return (
    <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#79CDCD] dark:bg-cyan-900/30 backdrop-blur-sm dark:border border-cyan-700/50">
      {iconType === "code" ? (
        <div className=" stroke-gray-700 dark:stroke-cyan-400">
          <CodeIcon />
        </div>
      ) : (
        <div className="stroke-gray-700 dark:stroke-cyan-400">
          <ServerIcon />
        </div>
      )}
    </div>
  );
};

const UpcomingActivitiesComponent: React.FC<{
  activities?: UpcomingActivities[];
}> = ({ activities = [] }) => {
  const getStatusIcon = (type: string) => {
    if (type.toLowerCase().includes("exam")) return "code";
    return "server";
  };

  return (
    <div className="space-y-4">
      {activities.length > 0 ? (
        activities.map((activity, index) => (
          <div
            key={index}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-[#F6F6F6]  dark:bg-black/80 rounded-2xl p-5 dark:border border-teal-600/50 hover:border-teal-500 hover:bg-gray-200 dark:hover:bg-black/90 transition-all duration-300 backdrop-blur-sm gap-4"
          >
            <div className="flex items-center gap-4">
              {renderIcon(getStatusIcon(activity.type))}
              <div>
                <p className="font-medium text-gray-700 dark:text-white">
                  {activity.title}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {activity.type}
                </p>
              </div>
            </div>

            <div className="text-left sm:text-center mt-2 sm:mt-0">
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                {activity.date}
              </p>
            </div>

            <div className="text-left sm:text-right mt-2 sm:mt-0">
              {renderStatus(activity.status as ActivityStatus)}
            </div>
          </div>
        ))
      ) : (
        <div className="flex items-center justify-center py-8 text-gray-500 dark:text-gray-400">
          <p>No upcoming activities available</p>
        </div>
      )}
    </div>
  );
};

const RecentAccessList: React.FC<{ accesses: RecentAccess[] }> = ({
  accesses,
}) => {
  const formatTime = (timeString: string) => {
    try {
      const date = new Date(timeString);
      return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    } catch {
      return timeString;
    }
  };

  return (
    <ul className="space-y-3 max-h-[700px]">
      {accesses.map((user, index) => (
        <li
          key={index}
          className="flex items-center justify-between p-4 hover:bg-gray-100
           dark:hover:bg-black/90 rounded-t-2xl dark:rounded-xl transition-all duration-300 border-b dark:border dark:border-teal-600/50 hover:border-teal-500 backdrop-blur-sm"
        >
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 overflow-hidden rounded-full border-2 border-cyan-500/50 dark:border-cyan-500/30">
              {user.avatar ? (
                <Image
                  src={user.avatar}
                  alt="User Avatar"
                  fill
                  className="rounded-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-gray-600 dark:text-gray-300 text-xs font-medium">
                  {user.studentName.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div>
              <p className="font-medium text-sm">{user.studentId}</p>
              <p className="text-xs text-gray-400">{user.studentName}</p>
              <p className="text-xs text-gray-400">{formatTime(user.time)}</p>
            </div>
          </div>
          <button className="px-4 py-1.5 text-xs border border-cyan-500/50 dark:border-cyan-400/50 rounded-lg text-cyan-700/80 dark:text-cyan-400 hover:bg-gray-200 dark:hover:bg-cyan-400/10 transition-all duration-300 cursor-pointer">
            View
          </button>
        </li>
      ))}
    </ul>
  );
};

interface UpcomingActivities {
  title: string;
  type: string;
  date: string;
  status: string;
}

// Default data structure
const defaultOverviewData: OverviewData = {
  totalExams: { count: 0, last24h: 0 },
  totalStudents: { count: 0, last24h: 0 },
  totalLecturers: { count: 0, last24h: 0 },
  totalHours: { count: 0, last24h: 0 },
  examinationSummary: [],
  studentParticipation: [],
  recentAccess: [],
};

export default function AdminDashboard() {
  const [overviewData, setOverviewData] =
    useState<OverviewData>(defaultOverviewData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOverviewData = async () => {
      try {
        setLoading(true);
        const response = await OverView();
        if (response) {
          setOverviewData(response);
        } else {
          setError("Failed to fetch overview data");
        }
      } catch (err) {
        console.error("Error fetching overview data:", err);
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchOverviewData();
  }, []);

  // Transform data for charts with safety checks
  const chartExaminationSummary =
    overviewData.examinationSummary?.length > 0
      ? overviewData.examinationSummary.map((item) => ({
          name: item.month,
          value: item.count,
        }))
      : [
          { name: "Jan", value: 0 },
          { name: "Feb", value: 0 },
          { name: "Mar", value: 0 },
          { name: "Apr", value: 0 },
          { name: "May", value: 0 },
          { name: "Jun", value: 0 },
        ];

  const chartStudentParticipation =
    overviewData.studentParticipation?.length > 0
      ? overviewData.studentParticipation.map((item) => ({
          name: item.label.split("-")[1] || item.label, // Extract course code
          value: item.count,
        }))
      : [{ name: "No Data", value: 0 }];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br text- dark:text-white p-1 md:p-8">
        <div className="max-w-8xl mx-auto flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">
              Loading dashboard...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br text- dark:text-white p-1 md:p-8">
        <div className="max-w-8xl mx-auto flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p className="text-red-500 mb-4">Error: {error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Handle empty state for recent access
  const hasRecentAccess =
    overviewData.recentAccess && overviewData.recentAccess.length > 0;
  return (
    <div className="min-h-screen bg-gradient-to-br text- dark:text-white p-1 md:p-8">
      <div className="max-w-8xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div className="flex flex-col gap-2">
            <Breadcrumb className="text-gray-400" aria-label="Breadcrumb">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink
                    href="/admin/dashboard"
                    className="text-black/80 dark:text-gray-400"
                  >
                    Dashboard
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator>/</BreadcrumbSeparator>
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-black/50 dark:text-gray-400">
                    Overview
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <h1 className="text-3xl font-bold text-black/90 dark:text-gray-100">
              Overview
            </h1>
            <p className="text-black/80 dark:text-gray-400 text-sm">
              Welcome back! Here’s what’s happening with your reports and exams.
            </p>
          </div>

          <div className="mt-4 md:mt-0 flex items-center gap-4">
            <button className="px-4 py-2 bg-gray-100 dark:bg-cyan-500/10 dark:hover:bg-cyan-500/40 cursor-pointer hover:bg-cyan-500/20 border border-cyan-500/30 rounded-lg text-cyan-600 dark:text-cyan-400 transition-all duration-300 text-sm">
              Export Data
            </button>
            <button className="px-4 py-2 bg-teal-500/80 hover:bg-teal-500 rounded-lg cursor-pointer text-white transition-all duration-300 text-sm font-medium">
              New Report
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="col-span-1 md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6 bg-white dark:bg-black p-2.5 rounded-3xl">
            <StatCard
              title="Total Exams"
              data={overviewData.totalExams}
              icon={<BookCopy className="w-6 h-6" />}
              highlight
            />
            <StatCard
              title="Total Students"
              data={overviewData.totalStudents}
              icon={<BookOpen className="w-5 h-5" />}
            />
            <StatCard
              title="Total Lecturers"
              data={overviewData.totalLecturers}
              icon={<Users className="w-6 h-6" />}
            />
            <StatCard
              title="Total Hours"
              data={overviewData.totalHours}
              icon={<Hourglass className="w-5 h-5" />}
            />
          </div>

          <div className="col-span-1 md:col-span-2 bg-white dark:bg-black/80 p-6 rounded-2xl dark:shadow-lg dark:border dark:border-teal-600/50 backdrop-blur-sm">
            <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
              Examination Summary
            </h3>
            <div className="h-70">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartExaminationSummary}>
                  <XAxis dataKey="name" stroke="#94a3b8" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(0, 0, 0, 0.85)",
                      borderColor: "#0d9488",
                      borderRadius: "0.75rem",
                      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.3)",
                    }}
                    itemStyle={{ color: "#f8fafc" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#1EBFBF"
                    strokeWidth={3}
                    dot={{ r: 6, fill: "#096F6E", strokeWidth: 3 }}
                    activeDot={{ r: 8, fill: "#096F6E", strokeWidth: 0 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="col-span-1 md:col-span-3 bg-white dark:bg-black/80 p-6 rounded-2xl dark:shadow-lg dark:border dark:border-teal-600/50 backdrop-blur-sm">
            <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
              Student Participation
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartStudentParticipation}>
                  <XAxis dataKey="name" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip
                    cursor={{ fill: "rgba(14, 116, 144, 0.2)" }}
                    contentStyle={{
                      backgroundColor: "rgba(0, 0, 0, 0.85)",
                      borderColor: "#0d9488",
                      borderRadius: "0.75rem",
                      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.3)",
                    }}
                    itemStyle={{ color: "#f8fafc" }}
                  />
                  <Bar
                    dataKey="value"
                    fill="#1EBFBF"
                    radius={[8, 8, 0, 0]}
                    barSize={38}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white dark:bg-black/80 p-6 rounded-2xl dark:shadow-lg text-gray-800 dark:text-white  overflow-y-hidden dark:border dark:border-teal-600/50 backdrop-blur-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Recent Access
              </h3>
              <Link
                href="/access"
                className="text-sm px-4 py-1.5 border border-cyan-700/50 dark:border-cyan-400/30 rounded-lg text-cyan-700/80 dark:text-cyan-300 hover:bg-gray-100  dark:hover:bg-cyan-900/30 transition-all duration-300"
              >
                View all
              </Link>
            </div>
            <div className="h-[300px] overflow-y-auto scrollbar-custom pr-2 custom-scrollbar">
              {hasRecentAccess ? (
                <RecentAccessList accesses={overviewData.recentAccess} />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
                  <p>No recent access data available</p>
                </div>
              )}
            </div>
          </div>

          <div className="col-span-1 md:col-span-4 bg-white dark:bg-black/80 rounded-2xl dakr:shadow-lg dark:border border-teal-600/50 p-6 backdrop-blur-sm">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                Upcoming Activities
              </h2>
              <Link
                href="/activities"
                className="text-sm px-4 py-1.5 border border-cyan-700/50 dark:border-cyan-400/30 rounded-lg text-cyan-700/80 dark:text-cyan-300 hover:bg-gray-100  dark:hover:bg-cyan-900/30 transition-all duration-300"
              >
                View all
              </Link>
            </div>
            <UpcomingActivitiesComponent />
          </div>
        </div>
      </div>
    </div>
  );
}
