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
import React from "react";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import avatar1 from '@/public/imgs/dashboard/common/overview/avatar1.png';
import avatar2 from '@/public/imgs/dashboard/common/overview/avatar2.png';
import avatar3 from '@/public/imgs/dashboard/common/overview/avatar3.png';
import avatar4 from '@/public/imgs/dashboard/common/overview/avatar4.png';
import avatar5 from '@/public/imgs/dashboard/common/overview/avatar5.png';
import avatar6 from '@/public/imgs/dashboard/common/overview/avatar6.png';

type ActivityStatus = "Ongoing" | "Pending" | "Completed";

interface Activity {
  id: string;
  icon: "code" | "server";
  course: string;
  date: string;
  type: string;
  status: ActivityStatus;
}

interface RecentAccess {
  id: string;
  time: string;
  avatar: string;
}

const StatCard: React.FC<{ title: string; value: number }> = ({
  title,
  value,
}) => (
  <div className="bg-[#F6F6F6] dark:bg-[#0A0A0A] p-6 rounded-2xl dark:shadow-lg hover:bg-gray-100 dark:hover:bg-black/90 transition-all duration-300 dark:border dark:border-teal-600/50 hover:border-teal-500 backdrop-blur-sm transform hover:scale-105">
    <h3 className="text-lg font-medium text-gray-800 dark:text-gray-300 mb-2">
      {title}
    </h3>
    <p className="text-4xl font-bold text-black dark:text-cyan-400 tracking-tight">
      {value}
    </p>
  </div>
);

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
  const baseStyles = "px-3 py-1.5 rounded-full text-sm font-medium";

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

const UpcomingActivities: React.FC<{ activities?: Activity[] }> = ({
  activities = sampleActivities,
}) => {
  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div
          key={activity.id}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-[#F6F6F6]  dark:bg-black/80 rounded-2xl p-5 dark:border border-teal-600/50 hover:border-teal-500 hover:bg-gray-200 dark:hover:bg-black/90 transition-all duration-300 backdrop-blur-sm gap-4"
        >
          <div className="flex items-center gap-4">
            {renderIcon(activity.icon)}
            <div>
              <p className="font-medium text-gray-700 dark:text-white">
                {activity.course}
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
            {renderStatus(activity.status)}
          </div>
        </div>
      ))}
    </div>
  );
};

const RecentAccessList: React.FC<{ accesses: RecentAccess[] }> = ({
  accesses,
}) => {
  return (
    <ul className="space-y-3 max-h-[700px] overflow-y-auto scrollbar-custom pr-2 custom-scrollbar">
      {accesses.map((user, index) => (
        <li
          key={index}
          className="flex items-center justify-between p-4 hover:bg-gray-100
           dark:hover:bg-black/90 rounded-t-2xl dark:rounded-xl transition-all duration-300 border-b dark:border dark:border-teal-600/50 hover:border-teal-500 backdrop-blur-sm"
        >
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 overflow-hidden rounded-full border-2 border-cyan-500/50 dark:border-cyan-500/30">
              <Image
                src={user.avatar}
                alt="User Avatar"
                fill
                className="rounded-full object-cover"
              />
            </div>
            <div>
              <p className="font-medium text-sm">{user.id}</p>
              <p className="text-xs text-gray-400">{user.time}</p>
            </div>
          </div>
          <button className="px-4 py-1.5 text-xs border border-cyan-500/50 dark:border-cyan-400/50 rounded-full text-cyan-700/80 dark:text-cyan-400 hover:bg-gray-200 dark:hover:bg-cyan-400/10 transition-all duration-300 cursor-pointer">
            View
          </button>
        </li>
      ))}
    </ul>
  );
};

const sampleActivities: Activity[] = [
  {
    id: "1",
    icon: "code",
    course: "Data Management",
    date: "12/03/2025",
    type: "Online Exam",
    status: "Ongoing",
  },
  {
    id: "2",
    icon: "server",
    course: "Network Security",
    date: "15/03/2025",
    type: "Practical Lab",
    status: "Pending",
  },
  {
    id: "3",
    icon: "code",
    course: "Web Development",
    date: "18/03/2025",
    type: "Assignment",
    status: "Completed",
  },
];

const studentParticipation = [
  { name: "DW", value: 60 },
  { name: "EW", value: 80 },
  { name: "EN", value: 50 },
  { name: "MAO", value: 90 },
  { name: "FAO", value: 70 },
  { name: "FR", value: 85 },
];

const examinationSummary = [
  { name: "Jan", value: 30 },
  { name: "Feb", value: 50 },
  { name: "Mar", value: 45 },
  { name: "Apr", value: 70 },
  { name: "May", value: 60 },
  { name: "Jun", value: 90 },
];

const recentAccess: RecentAccess[] = [
  { id: "KUDE524F-042", time: "11:45 AM", avatar: avatar1.src },
  { id: "KUDE524F-021", time: "11:32 AM", avatar: avatar2.src },
  { id: "KUDE524F-056", time: "10:15 AM", avatar: avatar3.src },
  { id: "KUDE524F-071", time: "09:45 AM", avatar: avatar4.src },
  { id: "KUDE524F-069", time: "Yesterday", avatar: avatar5.src },
  { id: "KUDE524F-069", time: "Yesterday", avatar: avatar6.src },

  { id: "KUDE524F-069", time: "Yesterday", avatar: avatar1.src },
  { id: "KUDE524F-069", time: "Yesterday", avatar: avatar2.src },
  { id: "KUDE524F-069", time: "Yesterday", avatar: avatar3.src },
  { id: "KUDE524F-069", time: "Yesterday", avatar: avatar4.src },
  { id: "KUDE524F-069", time: "Yesterday", avatar: avatar5.src },
  { id: "KUDE524F-069", time: "Yesterday", avatar: avatar6.src },
];

export default function AdminDashboard() {
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
            <button className="px-4 py-2 bg-gray-100 dark:bg-cyan-500/10 dark:hover:bg-cyan-500/40 cursor-pointer hover:bg-cyan-500/20 border border-cyan-500/30 rounded-full text-cyan-600 dark:text-cyan-400 transition-all duration-300 text-sm">
              Export Data
            </button>
            <button className="px-4 py-2 bg-teal-500/80 hover:bg-teal-500 rounded-full cursor-pointer text-white transition-all duration-300 text-sm font-medium">
              New Report
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="col-span-1 md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6 bg-white dark:bg-black p-2.5 rounded-3xl">
            <StatCard title="Total Exams" value={4} />
            <StatCard title="Total Students" value={210} />
            <StatCard title="Total Lecturers" value={5} />
            <StatCard title="Total Hours" value={12} />
          </div>

          <div className="col-span-1 md:col-span-2 bg-white dark:bg-black/80 p-6 rounded-2xl dark:shadow-lg dark:border dark:border-teal-600/50 backdrop-blur-sm">
            <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
              Examination Summary
            </h3>
            <div className="h-70">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={examinationSummary}>
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
                <BarChart data={studentParticipation}>
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

          <div className="bg-white dark:bg-black/80 p-6 rounded-2xl dark:shadow-lg text-gray-800 dark:text-white row-span-2 overflow-y-hidden dark:border dark:border-teal-600/50 backdrop-blur-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Recent Access
              </h3>
              <Link
                href="/access"
                className="text-sm px-4 py-1.5 border border-cyan-700/50 dark:border-cyan-400/30 rounded-full text-cyan-700/80 dark:text-cyan-300 hover:bg-gray-100  dark:hover:bg-cyan-900/30 transition-all duration-300"
              >
                View all
              </Link>
            </div>
            <RecentAccessList accesses={recentAccess} />
          </div>

          <div className="col-span-1 md:col-span-3 bg-white dark:bg-black/80 rounded-2xl dakr:shadow-lg dark:border border-teal-600/50 p-6 backdrop-blur-sm">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                Upcoming Activities
              </h2>
              <Link
                href="/activities"
                className="text-sm px-4 py-1.5 border border-cyan-700/50 dark:border-cyan-400/30 rounded-full text-cyan-700/80 dark:text-cyan-300 hover:bg-gray-100  dark:hover:bg-cyan-900/30 transition-all duration-300"
              >
                View all
              </Link>
            </div>
            <UpcomingActivities />
          </div>
        </div>
      </div>
    </div>
  );
}
