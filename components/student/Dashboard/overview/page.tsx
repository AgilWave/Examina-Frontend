"use client";

import React, { JSX } from "react";
import Link from "next/link";
import { ReactNode } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  GraduationCap,
  BookOpen,
  Users,
  Hourglass,
  MoveUp,
  FileText,
  ClipboardList,
  Database,
  User,
  Laptop,
} from "lucide-react";

// Import custom shadcn chart components
import { BarChart } from "@/components/ui/charts/bar-chart";
import { AreaChart } from "@/components/ui/charts/area-chart";

interface upcomingActivity {
  id: string;
  time: string;
}

interface StatCardProps {
  title: string;
  value: number;
  icon: ReactNode;
  highlight?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  highlight,
}) => {
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
        <p className="text-4xl font-bold">{value}</p>
      </div>

      <div
        className={`flex items-center text-sm ${
          highlight
            ? "text-white"
            : "text-gray-700 dark:text-white"
        }`}
      >
        <MoveUp className="w-4 h-4" />
        Next 24 Hours
      </div>
    </div>
  );
};

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "participated":
      return "text-blue-600 bg-blue-500/20";
    case "upcoming":
      return "text-teal-400 bg-teal-500/20";
    default:
      return "text-gray-400 bg-gray-500/20";
  }
};

const renderIcon = (icon: string) => {
  return (
    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-teal-600 text-white">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
        <polyline points="14 2 14 8 20 8"></polyline>
        <line x1="16" y1="13" x2="8" y2="13"></line>
        <line x1="16" y1="17" x2="8" y2="17"></line>
        <polyline points="10 9 9 9 8 9"></polyline>
      </svg>
    </div>
  );
};

const ExamHistory = ({ activities = sampleActivities }) => {
  return (
    <div className="space-y-4 max-h-[300px] overflow-y-auto scrollbar-custom pr-2 custom-scrollbar">
      {activities.map((activity) => (
        <div
          key={activity.id}
          className="flex flex-col sm:flex-row sm:justify-between gap-4 bg-[#F6F6F6] dark:bg-black/80 rounded-xl p-4 dark:border border-teal-600/50 hover:border-teal-500 hover:bg-gray-200 dark:hover:bg-black/90 transition-all duration-300 backdrop-blur-sm"
        >
          {/* Left Section: Icon + Course + Date */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
            <div className="flex items-center gap-2">
              {renderIcon(activity.icon)}
              <span className="font-medium text-gray-800 dark:text-white">
                {activity.course}
              </span>
            </div>
            <div className="text-left sm:text-center mt-2 sm:mt-0">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {activity.date}
            </span>
            </div>
          </div>

          {/* Right Section: Badges */}
          <div className="flex flex-row flex-wrap items-center gap-2 sm:gap-3">
            <span className="text-sm text-green-600 bg-green-500/20 rounded-full px-3 py-1 font-medium w-fit">
              {activity.type}
            </span>
            <span
              className={`text-sm rounded-full px-3 py-1 font-medium w-fit ${getStatusColor(
                activity.status
              )}`}
            >
              {activity.status}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

const iconMap: { [key: string]: JSX.Element } = {
  "Upload Course work": <FileText className="w-5 h-5 text-white" />,
  "View Results": <ClipboardList className="w-5 h-5 text-white" />,
  "Course Work Details": <BookOpen className="w-5 h-5 text-white" />,
  "Data Management Exam": <Database className="w-5 h-5 text-white" />,
  "View profile": <User className="w-5 h-5 text-white" />,
  "Online Exam": <Laptop className="w-5 h-5 text-white" />,
};

const UpcomingActivityList: React.FC<{ accesses: upcomingActivity[] }> = ({
  accesses,
}) => {
  return (
    <ul className="space-y-3">
      {accesses.map((access, index) => (
        <li
          key={index}
          className="flex items-start gap-4 p-4 hover:bg-gray-100 dark:hover:bg-black/90 rounded-xl transition-all duration-300 border-b dark:border dark:border-teal-600/50 hover:border-teal-500 backdrop-blur-sm"
        >
          <div className="bg-cyan-600/80 dark:bg-teal-600 p-2 rounded-full">
            {iconMap[access.id] ?? <FileText className="w-5 h-5 text-white" />}
          </div>
          <div className="flex flex-col">
            <p className="font-medium text-sm">{access.id}</p>
            <p className="text-xs text-gray-400">{access.time}</p>
          </div>
        </li>
      ))}
    </ul>
  );
};

const sampleActivities = [
  {
    id: 1,
    course: "Data Management",
    date: "12/03/2025",
    type: "Online Exam",
    status: "Participated",
    icon: "document",
  },
  {
    id: 2,
    course: "Data Management",
    date: "12/03/2025",
    type: "Course Work",
    status: "Upcoming",
    icon: "document",
  },
  {
    id: 3,
    course: "Software Engineering",
    date: "12/03/2025",
    type: "Online Exam",
    status: "Participated",
    icon: "document",
  },
  {
    id: 4,
    course: "EAD2",
    date: "12/03/2025",
    type: "Online Exam",
    status: "Participated",
    icon: "document",
  },
  {
    id: 5,
    course: "Data Management",
    date: "12/03/2025",
    type: "Online Exam",
    status: "Participated",
    icon: "document",
  },
  {
    id: 6,
    course: "Data Management",
    date: "12/03/2025",
    type: "Course Work",
    status: "Upcoming",
    icon: "document",
  },
];

const weeklyActivityData = [
  { day: "Mon", hours: 2 },
  { day: "Tue", hours: 3 },
  { day: "Wed", hours: 1 },
  { day: "Thu", hours: 4 },
  { day: "Fri", hours: 2 },
  { day: "Sat", hours: 5 },
  { day: "Sun", hours: 0 },
];

const examinationSummary = [
  { name: "Jan", value: 30 },
  { name: "Feb", value: 50 },
  { name: "Mar", value: 45 },
  { name: "Apr", value: 70 },
  { name: "May", value: 60 },
  { name: "Jun", value: 90 },
];

const upcomingActivity = [
  { id: "Upload Course work", time: "11.45 A.M" },
  { id: "View Results", time: "11.45 A.M" },
  { id: "Course Work Details", time: "11.45 A.M" },
  { id: "Data Management Exam", time: "11.45 A.M" },
  { id: "View profile", time: "11.45 A.M" },
  { id: "Online Exam", time: "11.45 A.M" },
  { id: "Upload Course work", time: "11.45 A.M" },
  { id: "View Results", time: "11.45 A.M" },
  { id: "Course Work Details", time: "11.45 A.M" },
  { id: "Data Management Exam", time: "11.45 A.M" },
  { id: "View profile", time: "11.45 A.M" },
  { id: "Online Exam", time: "11.45 A.M" },
  { id: "Upload Course work", time: "11.45 A.M" },
  { id: "View Results", time: "11.45 A.M" },
  { id: "Course Work Details", time: "11.45 A.M" },
  { id: "Data Management Exam", time: "11.45 A.M" },
  { id: "View profile", time: "11.45 A.M" },
  { id: "Online Exam", time: "11.45 A.M" },
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
              Welcome back! Here's what's happening with your reports and exams.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="col-span-1 md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6 bg-white dark:bg-black p-2.5 rounded-3xl">
            <StatCard
              title="Total Completed Exams"
              value={1}
              icon={<GraduationCap className="w-6 h-6" />}
              highlight
            />
            <StatCard
              title="Total Completed CWs"
              value={2}
              icon={<BookOpen className="w-5 h-5" />}
            />
            <StatCard
              title="Total Lecturers"
              value={5}
              icon={<Users className="w-6 h-6" />}
            />
            <StatCard
              title="Total Hours"
              value={12}
              icon={<Hourglass className="w-5 h-5" />}
            />
          </div>

          <div className="col-span-1 md:col-span-2 bg-white dark:bg-black/80 p-6 rounded-2xl dark:shadow-lg dark:border dark:border-teal-600/50 backdrop-blur-sm">
            <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
              Result Summary
            </h3>
            {/* Increased chart height for better visibility */}
            <div className="h-80">
              <AreaChart
                data={examinationSummary}
                categories={["value"]}
                index="name"
                colors={["#1EBFBF"]}
                className="h-full w-full"
                showLegend={false}
                yAxisWidth={40}
                tooltip={true}
              />
            </div>
          </div>

          <div className="col-span-1 md:col-span-3 bg-white dark:bg-black/80 p-6 rounded-2xl dark:shadow-lg dark:border dark:border-teal-600/50 backdrop-blur-sm">
            <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
              Weekly Exam Activity
            </h3>
            <div className="h-80">
              <BarChart
                data={weeklyActivityData}
                categories={["hours"]}
                index="day"
                colors={["#1EBFBF"]}
                className="h-full w-full"
                showLegend={false}
                yAxisWidth={40}
                tooltip={true}
              />
            </div>
          </div>

          <div className="bg-white dark:bg-black/80 p-6 rounded-2xl dark:shadow-lg text-gray-800 dark:text-white overflow-y-hidden dark:border dark:border-teal-600/50 backdrop-blur-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Upcoming Activities
              </h3>
              <Link
                href="/access"
                className="text-sm px-4 py-1.5 border border-cyan-700/50 dark:border-cyan-400/30 rounded-lg text-cyan-700/80 dark:text-cyan-300 hover:bg-gray-100  dark:hover:bg-cyan-900/30 transition-all duration-300"
              >
                View all
              </Link>
            </div>
            {/* Made container taller to match other content heights */}
            <div className="h-[300px] overflow-y-auto scrollbar-custom pr-2 custom-scrollbar">
              <UpcomingActivityList accesses={upcomingActivity} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}