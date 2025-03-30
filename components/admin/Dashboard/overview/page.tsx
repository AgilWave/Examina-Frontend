"use client";

import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, LineChart, Line } from "recharts";
import Image from 'next/image';
import React from 'react';
import Link from 'next/link';


type ActivityStatus = 'Ongoing' | 'Pending' | 'Completed';

interface Activity {
  id: string;
  icon: 'code' | 'server';
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

const StatCard: React.FC<{ title: string; value: number }> = ({ title, value }) => (
  <div className="bg-black p-4 rounded-xl shadow-md hover:bg-black/80 transition-colors border border-teal-600">
    <h3 className="text-lg font-semibold text-gray-300">{title}</h3>
    <p className="text-3xl font-bold text-cyan-400">{value}</p>
  </div>
);


const CodeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 18 22 12 16 6"></polyline>
    <polyline points="8 6 2 12 8 18"></polyline>
  </svg>
);

const ServerIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect>
    <rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect>
    <line x1="6" y1="6" x2="6.01" y2="6"></line>
    <line x1="6" y1="18" x2="6.01" y2="18"></line>
  </svg>
);


const renderStatus = (status: ActivityStatus) => {
  switch (status) {
    case 'Ongoing':
      return <span className="text-blue-400">Ongoing</span>;
    case 'Pending':
      return <span className="text-cyan-400">Pending</span>;
    case 'Completed':
      return <span className="text-green-400">Completed</span>;
    default:
      return <span className="text-gray-400">{status}</span>;
  }
};

const renderIcon = (iconType: 'code' | 'server') => {
  return (
    <div className="w-12 h-12 rounded-full flex items-center justify-center bg-cyan-200/20">
      {iconType === 'code' ? (
        <div className="text-cyan-300">
          <CodeIcon />
        </div>
      ) : (
        <div className="text-cyan-300">
          <ServerIcon />
        </div>
      )}
    </div>
  );
};


const UpcomingActivities: React.FC<{ activities?: Activity[] }> = ({ 
  activities = sampleActivities 
}) => {
  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div 
          key={activity.id} 
          className="flex items-center justify-between bg-black rounded-xl p-4 border border-teal-600 hover:bg-black/80 transition-colors"
        >
          <div className="flex items-center gap-4">
            {renderIcon(activity.icon)}
            <div>
              <p className="font-medium">{activity.course}</p>
              <p className="text-sm text-gray-400">{activity.type}</p>
            </div>
          </div>

          <div className="text-center">
            <p className="text-gray-400 text-sm">{activity.date}</p>
          </div>

          <div className="text-right">
            {renderStatus(activity.status)}
          </div>
        </div>
      ))}
    </div>
  );
};

const RecentAccessList: React.FC<{ accesses: RecentAccess[] }> = ({ accesses }) => {
  return (
    <ul className="space-y-3 max-h-[700px] overflow-y-auto pr-2 scrollbar-custom">

      {accesses.map((user, index) => (
        <li key={index} className="flex items-center justify-between p-3 hover:bg-black/80 rounded-lg transition-colors border border-teal-600">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10">
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
          <button className="px-3 py-1 text-xs border border-cyan-400 rounded-full text-cyan-400 hover:bg-cyan-400 hover:text-black transition">
            View
          </button>
        </li>
      ))}
    </ul>
  );
};


const sampleActivities: Activity[] = [
  {
    id: '1',
    icon: 'code',
    course: 'Data Management',
    date: '12/03/2025',
    type: 'Online Exam',
    status: 'Ongoing',
  },
  {
    id: '2',
    icon: 'server',
    course: 'Network Security',
    date: '15/03/2025',
    type: 'Practical Lab',
    status: 'Pending',
  },
  {
    id: '3',
    icon: 'code',
    course: 'Web Development',
    date: '18/03/2025',
    type: 'Assignment',
    status: 'Completed',
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
  { id: "KUDE524F-042", time: "11:45 AM", avatar: "/avatar1.png" },
  { id: "KUDE524F-021", time: "11:32 AM", avatar: "/avatar2.png" },
  { id: "KUDE524F-056", time: "10:15 AM", avatar: "/avatar3.png" },
  { id: "KUDE524F-071", time: "09:45 AM", avatar: "/avatar4.png" },
  { id: "KUDE524F-069", time: "Yesterday", avatar: "/avatar5.png" },
  { id: "KUDE524F-042", time: "11:45 AM", avatar: "/avatar1.png" },
  { id: "KUDE524F-021", time: "11:32 AM", avatar: "/avatar2.png" },
  { id: "KUDE524F-056", time: "10:15 AM", avatar: "/avatar3.png" },
  { id: "KUDE524F-071", time: "09:45 AM", avatar: "/avatar4.png" },
  { id: "KUDE524F-069", time: "Yesterday", avatar: "/avatar5.png" },
  { id: "KUDE524F-021", time: "11:32 AM", avatar: "/avatar2.png" },
  { id: "KUDE524F-056", time: "10:15 AM", avatar: "/avatar3.png" },
  { id: "KUDE524F-071", time: "09:45 AM", avatar: "/avatar4.png" },
  { id: "KUDE524F-069", time: "Yesterday", avatar: "/avatar5.png" },
];


export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-[#000000] text-white p-4 md:p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Stats Cards */}
        <div className="col-span-2 grid grid-cols-2 gap-4">
          <StatCard title="Total Exams" value={4} />
          <StatCard title="Total Students" value={210} />
          <StatCard title="Total Lecturers" value={5} />
          <StatCard title="Total Hours" value={12} />
        </div>

        {/* Examination Summary Chart */}
        <div className="col-span-2 bg-black p-4 rounded-xl shadow-md border border-teal-600">
          <h3 className="text-lg font-semibold mb-2">Examination Summary</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={examinationSummary}>
              <XAxis dataKey="name" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#000000', borderColor: '#0d9488' }}
                itemStyle={{ color: '#f8fafc' }}
              />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#4ADE80" 
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Student Participation Chart */}
        <div className="col-span-3 bg-black p-4 rounded-xl shadow-md border border-teal-600">
          <h3 className="text-lg font-semibold mb-2">Student Participation</h3>
          <ResponsiveContainer width="100%" height={270}>
            <BarChart data={studentParticipation}>
              <XAxis dataKey="name" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#000000', borderColor: '#0d9488' }}
                itemStyle={{ color: '#f8fafc' }}
              />
              <Bar 
                dataKey="value" 
                fill="#4ADE80" 
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Access */}
        <div className="bg-black p-4 rounded-xl shadow-md text-white row-span-2 overflow-y-hidden border border-teal-600">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Recent Access</h3>
            <Link 
              href="/access" 
              className="text-sm px-3 py-1 border border-cyan-400/30 rounded-full text-cyan-300 hover:bg-cyan-900/30 transition-colors"
            >
              View all
            </Link>
          </div>
          <RecentAccessList accesses={recentAccess} />
        </div>

        {/* Upcoming Activities */}
        <div className="col-span-3 bg-black rounded-xl border border-teal-600 p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-medium">Upcoming Activities</h2>
            <Link 
              href="/activities" 
              className="text-sm px-4 py-2 border border-cyan-400/30 rounded-full text-cyan-300 hover:bg-cyan-900/30 transition-colors"
            >
              View all
            </Link>
          </div>
          <UpcomingActivities />
        </div>
      </div>
    </div>
  );
}