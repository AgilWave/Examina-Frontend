import { useState } from "react";
import { Clock, Calendar, BookCheck, FileType2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// Types
interface ExamSession {
  id: string;
  examName: string;
  sessionNumber: number;
  fuelType: string;
  date: string;
  time: string;
  duration: string;
  examId: number;
  type: string;
  isActive: boolean;
  openedBy: string;
}

// ExamCard Component
const ExamCard = ({ session }: { session: ExamSession }) => {
  // We're going to use Next.js Link component so we don't need router or mounted state anymore
  
  return (
    <div className="rounded-lg border border-gray-200 shadow-sm bg-white dark:bg-[#0A0A0A] dark:border-teal-900 overflow-hidden w-full">
      <div className="border-b-4 border-primary/50 dark:border-teal-900 px-4 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <div className="rounded-full bg-primary dark:bg-teal-900 p-2 mr-3"></div>
          <div>
            <h3 className="font-medium text-base text-gray-900 dark:text-white">
              {session.examName}
            </h3>
            <p className="text-xs text-gray-600">
              Session #{session.sessionNumber}
            </p>
          </div>
        </div>
        <div>
          <span
            className={`inline-flex items-center font-medium px-2 py-1 rounded-full text-xs ${
              session.isActive
                ? "bg-[#47b8812f] text-[#47B881]"
                : "bg-[#E184192f] text-[#E18419]"
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full mr-1 ${
                session.isActive ? "bg-[#47B881]" : "bg-[#e18419ce]"
              }`}
            ></span>
            {session.isActive ? "Active" : "Upcoming"}
          </span>
        </div>
      </div>

      <div className="p-4 space-y-3">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center text-sm">
            <Calendar className="text-teal-600 mr-2" size={16} />
            <span className="dark:text-white/60  text-black/80">
              {session.date}
            </span>
          </div>
          <div className="flex items-center text-sm">
            <Clock className="text-teal-600 mr-2" size={16} />
            <span className="dark:text-white/60  text-black/80">
              Duration: {session.duration}
            </span>
          </div>
          <div className="flex items-center text-sm">
            <BookCheck className="text-teal-600 mr-2" size={16} />
            <span className="dark:text-white/60  text-black/80">
              Exam ID: {session.examId}
            </span>
          </div>
          <div className="flex items-center text-sm">
            <FileType2 className="text-teal-600 mr-2" size={16} />
            <span className="dark:text-white/60  text-black/80">
              Type: {session.type}
            </span>
          </div>
        </div>        <div className="flex justify-between items-center pt-2">
          <div className="text-xs text-gray-500">
            Opened by: {session.openedBy}
          </div>
          <Link href="/entry">
            <Button >
              Enter
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

// ExamGrid Component to display multiple cards in a responsive grid
const ExamGrid = ({ sessions }: { sessions: ExamSession[] }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {sessions.map((session) => (
        <ExamCard key={session.id} session={session} />
      ))}
    </div>
  );
};

// Main component that brings everything together
const ExamDashboard = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [activeSessions, setActiveSessions] = useState<ExamSession[]>([
    {
      id: "1",
      examName: "Data Management",
      sessionNumber: 11,
      fuelType: "Petrol 95",
      date: "Apr 30, 01:35 AM",
      time: "01:35 AM",
      duration: "10h 18m",
      examId: 10,
      type: "MCQ",
      isActive: true,
      openedBy: "a",
    },
    {
      id: "2",
      examName: "Data Management",
      sessionNumber: 13,
      fuelType: "Petrol 95",
      date: "Apr 29, 10:12 PM",
      time: "10:12 PM",
      duration: "13h 40m",
      examId: 12,
      type: "Structure",
      isActive: true,
      openedBy: "a",
    },
    {
      id: "3",
      examName: "Data Management",
      sessionNumber: 9,
      fuelType: "Petrol 95",
      date: "Apr 29, 08:17 PM",
      time: "08:17 PM",
      duration: "15h 36m",
      examId: 12,
      type: "MCQ",
      isActive: true,
      openedBy: "a",
    },
    {
      id: "4",
      examName: "Data Management",
      sessionNumber: 8,
      fuelType: "Petrol 95",
      date: "Apr 29, 06:05 PM",
      time: "06:05 PM",
      duration: "17h 41m",
      examId: 14,
      type: "MCQ",
      isActive: true,
      openedBy: "a",
    },
  ]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [upcomingSessions, setUpcomingSessions] = useState<ExamSession[]>([
    {
      id: "5",
      examName: "Data Management",
      sessionNumber: 7,
      fuelType: "Petrol 95",
      date: "May 5, 10:00 AM",
      time: "10:00 AM",
      duration: "Scheduled",
      examId: 14,
      type: "MCQ",
      isActive: false,
      openedBy: "System",
    },
    {
      id: "6",
      examName: "Data Management",
      sessionNumber: 5,
      fuelType: "Petrol 92",
      date: "May 6, 02:30 PM",
      time: "02:30 PM",
      duration: "Scheduled",
      examId: 12,
      type: "MCQ",
      isActive: false,
      openedBy: "System",
    },
    {
      id: "7",
      examName: "Data Management",
      sessionNumber: 5,
      fuelType: "Petrol 92",
      date: "May 6, 02:30 PM",
      time: "02:30 PM",
      duration: "Scheduled",
      examId: 12,
      type: "MCQ",
      isActive: false,
      openedBy: "System",
    },
    {
      id: "8",
      examName: "Data Management",
      sessionNumber: 5,
      fuelType: "Petrol 92",
      date: "May 6, 02:30 PM",
      time: "02:30 PM",
      duration: "Scheduled",
      examId: 12,
      type: "MCQ",
      isActive: false,
      openedBy: "System",
    },
    {
      id: "9",
      examName: "Data Management",
      sessionNumber: 5,
      fuelType: "Petrol 92",
      date: "May 6, 02:30 PM",
      time: "02:30 PM",
      duration: "Scheduled",
      examId: 12,
      type: "MCQ",
      isActive: false,
      openedBy: "System",
    },
    {
      id: "10",
      examName: "Data Management",
      sessionNumber: 5,
      fuelType: "Petrol 92",
      date: "May 6, 02:30 PM",
      time: "02:30 PM",
      duration: "Scheduled",
      examId: 12,
      type: "MCQ",
      isActive: false,
      openedBy: "System",
    },
    {
      id: "11",
      examName: "Data Management",
      sessionNumber: 5,
      fuelType: "Petrol 92",
      date: "May 6, 02:30 PM",
      time: "02:30 PM",
      duration: "Scheduled",
      examId: 12,
      type: "MCQ",
      isActive: false,
      openedBy: "System",
    },
  ]);

  const allSessions = [...activeSessions, ...upcomingSessions];

  return (
    <div className="h-[500px] p-6 bg-gray-50 dark:bg-black/50 max-h-screen overflow-auto scrollbar-custom">
      {/* <SectionHeader title="All Exams" count={allSessions.length} /> */}
      <ExamGrid sessions={allSessions} />
    </div>
  );
};

export default ExamDashboard;
