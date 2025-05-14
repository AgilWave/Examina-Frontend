"use client";

import React from "react";
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
  BookCopy,
  BookOpen,
  Users,
  Hourglass,
  MoveUp,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";


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
          highlight ? "text-white" : "text-gray-700 dark:text-white"
        }`}
      >
        <MoveUp className="w-4 h-4" />
        This week
      </div>
    </div>
  );
};



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
              Welcome back! Here&apos;s what&apos;s happening with your reports
              and exams.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white dark:bg-black p-2.5 rounded-3xl">
          <StatCard
            title="Total Courses Handling"
            value={4}
            icon={<BookCopy className="w-6 h-6" />}
            highlight
          />
          <StatCard
            title="Pending Grading Tasks"
            value={8}
            icon={<BookOpen className="w-5 h-5" />}
          />
          <StatCard
            title="Total Students"
            value={5}
            icon={<Users className="w-6 h-6" />}
          />
          <StatCard
            title="Lecturing Hours"
            value={15}
            icon={<Hourglass className="w-5 h-5" />}
          />
        </div>

        {/* Tools Section */}
        <div className="space-y-4 mt-5">
          {/* <h2 className="text-xl font-semibold text-gray-700">
            Let's get started with these useful tools
          </h2>
          <p className="text-sm text-gray-500">
            Explore our tools that you can use to generate exam, analyze result
            and more
          </p> */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Start Exam Card */}
            <Card className="space-y-4 bg-white dark:bg-black p-2.5 border border-teal-600/50 rounded-3xl">
              <CardContent className="space-y-4 py-6">
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-black dark:text-gray-300">
                    Start a new Exam
                  </h3>
                  {/* <p className="text-sm text-gray-500">
                    Create exam so easily with AI, only enter a prompt and
                    voila!
                  </p> */}
                </div>
                <div className="w-full h-50 bg-gradient-to-l from-teal-600/60 to-teal-500/60 rounded-lg flex items-center justify-center">
                  <div className="dark:bg-card bg-white shadow-md px-4 py-2 rounded-full text-teal-600 font-medium border border-teal-300">
                    ✨ Get Started - Generate
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="w-full flex items-center justify-center gap-2"
                >
                  <span>Start Create Exam</span>
                  <span>↗</span>
                </Button>
              </CardContent>
            </Card>

            {/* Analyze Exam Result Card */}
            {/* <Card className="relative space-y-4 bg-white dark:bg-[#0A0A0A] p-2.5 border border-teal-600/50 rounded-3xl">
            <CardContent className="space-y-4 py-6">
              <span className="absolute top-4 right-4 bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">New Feature</span>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-gray-700">Analysist Exam Result</h3>
                <p className="text-sm text-gray-500">Analyze exam result to get more data and stats answer</p>
              </div>
              <Button variant="outline" className="w-full">Start Analyze Result</Button>
            </CardContent>
          </Card> */}
            <Card className="relative space-y-4 bg-white dark:bg-black p-2.5 border border-teal-600/50 rounded-3xl shadow-sm">
              <CardContent className="space-y-6 py-6">
                {/* <span className="absolute top-4 right-4 bg-teal-200 text-teal-700 text-xs px-2 py-1 rounded-full">
                  New Feature
                </span> */}

                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                    Analysist Exam Result
                  </h3>
                  {/* <p className="text-sm text-gray-500 dark:text-gray-400">
                    Analyze exam result to get more data and stats answer
                  </p> */}
                </div>

                {/* 🖼️ Illustrated Area */}
                <div className="grid grid-cols-2  gap-6 bg-white dark:bg-gradient-to-br dark:from-black dark:to-black p-4 rounded-xl shadow-inner border border-gray-100 dark:border-black">
                  {/* Scanning Block */}
                  <div className=" bg-gradient-to-br from-teal-50 to-teal-100 dark:from-[#0A0A0A] dark:to-[#0A0A0A] p-4 rounded-xl flex flex-col items-center justify-center border border-teal-200 dark:border-teal-800 shadow-sm">
                    <div className="bg-teal-100 dark:bg-teal-900 px-3 py-1 rounded-full text-xs font-medium text-teal-700 dark:text-teal-200 mb-2 shadow">
                      📄 Scanning
                    </div>
                    <div className="h-20 w-full bg-gradient-to-t from-teal-200 dark:from-teal-800 to-transparent rounded-md"></div>
                  </div>

                  {/* Result Block */}
                  <div className="bg-gradient-to-br from-teal-50 to-teal-100 dark:from-[#0A0A0A] dark:to-[#0A0A0A] p-4 rounded-xl flex flex-col items-center justify-center border border-teal-200 dark:border-teal-800 shadow-sm">
                    <div className="bg-teal-100 dark:bg-teal-900 px-3 py-1 rounded-full text-xs font-medium text-teal-700 dark:text-teal-200 mb-2 shadow">
                      📊 Result
                    </div>
                    <div className="h-20 w-full bg-gradient-to-t from-teal-200 dark:from-teal-800 to-transparent rounded-md"></div>
                  </div>
                </div>

                <Button variant="outline" className="w-full mt-1">
                  Start Analyze Result
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Exam History */}
        <div className="space-y-4 mt-5">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold text-black dark:text-white">
                Exam History
              </h2>
              {/* <p className="text-sm text-gray-500">
                Explore our tools that you can use to generate blog posts,
                analyze SERP and more
              </p> */}
            </div>
            {/* <Button variant="link">See All →</Button> */}
          </div>

          <Card>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="rounded-tl-md">Title</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead>Code</TableHead>
                    <TableHead>Participants</TableHead>
                    <TableHead>Submit</TableHead>
                    <TableHead>Schedule</TableHead>
                    <TableHead className="rounded-tr-md">Status</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  <TableRow>
                    <TableCell>Basic Programming</TableCell>
                    <TableCell>TECH-3A</TableCell>
                    <TableCell>zhP8xTdVu</TableCell>
                    <TableCell>34</TableCell>
                    <TableCell className="text-blue-600">23/34</TableCell>
                    <TableCell>
                      <div className="flex flex-col text-sm">
                        <span>14 March 2024</span>
                        <span>17 March 2024</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-teal-600 bg-teal-200 px-2 py-1 rounded-full text-xs">
                        Running
                      </span>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"> */}
      {/* <div className="col-span-1 md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6 bg-white dark:bg-black p-2.5 rounded-3xl">
            <StatCard
              title="Total Courses Handling"
              value={4}
              icon={<BookCopy  className="w-6 h-6" />}
              highlight
            />
            <StatCard
              title="Pending Grading Tasks"
              value={8}
              icon={<BookOpen className="w-5 h-5" />}
            />
            <StatCard
              title="Total Students"
              value={5}
              icon={<Users className="w-6 h-6" />}
            />
            <StatCard
              title="Lecturing Hours"
              value={15}
              icon={<Hourglass className="w-5 h-5" />}
            />
          </div> */}

      {/* <div className="col-span-1 md:col-span-2 bg-white dark:bg-black/80 p-6 rounded-2xl dark:shadow-lg dark:border dark:border-teal-600/50 backdrop-blur-sm">
            <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
              Result Analytics
            </h3>
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
          </div> */}

      {/* <div className="col-span-1 md:col-span-3 bg-white dark:bg-black/80 p-6 rounded-2xl dark:shadow-lg dark:border dark:border-teal-600/50 backdrop-blur-sm">
            <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
              Weekly Activity
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
          </div> */}

      {/* <div className="bg-white dark:bg-black/80 p-6 rounded-2xl dark:shadow-lg text-gray-800 dark:text-white overflow-y-hidden dark:border dark:border-teal-600/50 backdrop-blur-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Lecturer Activities
              </h3>
              <Link
                href="/access"
                className="text-sm px-4 py-1.5 border border-cyan-700/50 dark:border-cyan-400/30 rounded-lg text-cyan-700/80 dark:text-cyan-300 hover:bg-gray-100  dark:hover:bg-cyan-900/30 transition-all duration-300"
              >
                View all
              </Link>
            </div>
            <div className="h-[300px] overflow-y-auto scrollbar-custom pr-2 custom-scrollbar">
              <UpcomingActivityList accesses={upcomingActivity} />
            </div>
          </div> */}
      {/* </div> */}
    </div>
  );
}
