import { Clock, Calendar, BookCheck, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import Cookies from 'js-cookie';
import { decrypt } from '@/lib/encryption';

// Types
interface ExamSession {
  id: string;
  examName: string;
  examDate: string;  // ISO date string
  startTime: string; // ISO date string
  endTime: string;   // ISO date string
  examCode: number;
  examMode: string;
  status: string;
  createdBy: string;
}

// Helper function to format date
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

// Helper function to format time
const formatTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
};

// Helper function to calculate duration
const calculateDuration = (startTime: string, endTime: string): string => {
  const start = new Date(startTime);
  const end = new Date(endTime);
  const diff = end.getTime() - start.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  return `${hours}h ${minutes}m`;
};

// Helper function to get status style
const getStatusStyle = (status: string) => {
  switch (status.toLowerCase()) {
    case 'active':
      return {
        bgColor: 'bg-[#47b8812f]',
        textColor: 'text-[#47B881]',
        dotColor: 'bg-[#47B881]',
        borderColor: 'border-[#47B881]'
      };
    case 'ongoing':
      return {
        bgColor: 'bg-[#47b8812f]',
        textColor: 'text-[#47B881]',
        dotColor: 'bg-[#47B881]',
        borderColor: 'border-[#47B881]'
      };
    case 'pending':
      return {
        bgColor: 'bg-[#E184192f]',
        textColor: 'text-[#E18419]',
        dotColor: 'bg-[#e18419ce]',
        borderColor: 'border-[#E18419]'
      };
    default:
      return {
        bgColor: 'bg-gray-200',
        textColor: 'text-gray-600',
        dotColor: 'bg-gray-600',
        borderColor: 'border-gray-600'
      };
  }
};

// ExamCard Component
const ExamCard = ({ session, router }: { session: ExamSession, router: AppRouterInstance }) => {
  const userData = Cookies.get("userDetails");
  let studentId = "";
  if (userData) {
    const decryptedData = decrypt(userData);
    const parsedData = JSON.parse(decryptedData);
    studentId = parsedData.studentDetails.studentId;
  }
  const statusStyle = getStatusStyle(session.status);
  const duration = calculateDuration(session.startTime, session.endTime);
  const formattedDate = formatDate(session.examDate);
  const formattedStartTime = formatTime(session.startTime);

  return (
    <div className="group relative rounded-lg border border-gray-200 shadow-md bg-white dark:bg-[#0A0A0A] dark:border-teal-900 overflow-hidden w-full transition-all duration-300 hover:shadow-lg hover:scale-[1.01] hover:border-primary/30 dark:hover:border-teal-700">
      {/* Gradient overlay for visual appeal */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-primary/5 dark:to-teal-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

      {/* Header with enhanced styling */}
      <div className="relative border-b border-primary/20 dark:border-teal-900/50 px-4 py-3 bg-gradient-to-r from-primary/5 to-transparent dark:from-teal-900/10">
        <div className="flex justify-between items-start">
          <div className="flex items-start space-x-3">
            <div className="relative">
              <div className="rounded-lg bg-gradient-to-br from-primary to-primary/80 dark:from-teal-900 dark:to-teal-800 p-2 shadow-md">
                <BookCheck className="text-white" size={16} />
              </div>
              <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-white dark:bg-gray-800 rounded-full border border-primary dark:border-teal-700"></div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm text-gray-900 dark:text-white leading-tight mb-1 group-hover:text-primary dark:group-hover:text-teal-400 transition-colors">
                {session.examName}
              </h3>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-medium text-primary dark:text-teal-400 bg-primary/10 dark:bg-teal-900/20 px-1.5 py-0.5 rounded">
                  #{session.examCode}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {session.examMode}
                </span>
              </div>
            </div>
          </div>

          {/* Enhanced status badge */}
          <div className="flex-shrink-0">
            <span className={`inline-flex items-center font-medium px-2 py-1 rounded-full text-xs shadow-sm border ${statusStyle.bgColor} ${statusStyle.textColor} ${statusStyle.borderColor}`}>
              <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${statusStyle.dotColor} animate-pulse`}></span>
              {session.status}
            </span>
          </div>
        </div>
      </div>

      {/* Content with improved layout */}
      <div className="relative p-4 space-y-3">
        <div className="grid grid-cols-1 gap-2">
          <div className="flex items-center p-2 rounded-md bg-gray-50 dark:bg-gray-900/50 hover:bg-gray-100 dark:hover:bg-gray-900/70 transition-colors">
            <Calendar className="text-teal-600 dark:text-teal-400 mr-2 flex-shrink-0" size={14} />
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Date</p>
              <p className="text-xs font-semibold dark:text-white/90 text-black/90">{formattedDate}</p>
            </div>
          </div>

          <div className="flex items-center p-2 rounded-md bg-gray-50 dark:bg-gray-900/50 hover:bg-gray-100 dark:hover:bg-gray-900/70 transition-colors">
            <Clock className="text-teal-600 dark:text-teal-400 mr-2 flex-shrink-0" size={14} />
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Duration</p>
              <p className="text-xs font-semibold dark:text-white/90 text-black/90">{duration}</p>
            </div>
          </div>

          <div className="flex items-center p-2 rounded-md bg-gray-50 dark:bg-gray-900/50 hover:bg-gray-100 dark:hover:bg-gray-900/70 transition-colors">
            <BookCheck className="text-teal-600 dark:text-teal-400 mr-2 flex-shrink-0" size={14} />
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Start Time</p>
              <p className="text-xs font-semibold dark:text-white/90 text-black/90">{formattedStartTime}</p>
            </div>
          </div>
        </div>

        {/* Footer with enhanced styling */}
        <div className="pt-3 border-t border-gray-100 dark:border-gray-800">
          <div className="flex justify-between items-center">
            <div className="text-xs text-gray-500 dark:text-gray-400">
              <span className="font-medium">Created by:</span> {session.createdBy}
            </div>
            <Button
              variant="outline"
              size="sm"
              className="group/btn relative overflow-hidden text-xs font-semibold hover:bg-primary hover:text-white dark:border-teal-900 dark:text-teal-500 dark:hover:bg-teal-900 dark:hover:text-white transition-all duration-300 hover:scale-105"
              onClick={() => {
                router.push(`/entry?examId=${session.id}&studentId=${studentId}`);
              }}
            >
              <span className="relative z-10 flex items-center">
                <Play className="mr-1" size={12} />
                Enter
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80 dark:from-teal-900 dark:to-teal-800 transform scale-x-0 group-hover/btn:scale-x-100 transition-transform origin-left"></div>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ExamGrid Component to display multiple cards in a responsive grid
const ExamGrid = ({ sessions, router }: { sessions: ExamSession[], router: AppRouterInstance }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {sessions.map((session) => (
        <ExamCard key={session.id} session={session} router={router} />
      ))}
    </div>
  );
};

// Main component that accepts data as a prop
interface ExamCardsProps {
  data: ExamSession[];
  router: AppRouterInstance;
}

const ExamCards = ({ data, router }: ExamCardsProps) => {
  return (
    <div className="h-[500px] p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-black/50 dark:to-gray-900/20 max-h-screen overflow-auto scrollbar-custom">
      {/* <SectionHeader title="All Exams" count={allSessions.length} /> */}
      <ExamGrid sessions={data} router={router} />
    </div>
  );
};

export default ExamCards;