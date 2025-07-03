import { Clock, Calendar, BookCheck, FileType2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

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
        dotColor: 'bg-[#47B881]'
      };
    case 'ongoing':
      return {
        bgColor: 'bg-[#47b8812f]',
        textColor: 'text-[#47B881]',
        dotColor: 'bg-[#47B881]'
      };
    case 'pending':
      return {
        bgColor: 'bg-[#E184192f]',
        textColor: 'text-[#E18419]',
        dotColor: 'bg-[#e18419ce]'
      };
    default:
      return {
        bgColor: 'bg-gray-200',
        textColor: 'text-gray-600',
        dotColor: 'bg-gray-600'
      };
  }
};

// ExamCard Component
const ExamCard = ({ session }: { session: ExamSession }) => {
  const router = useRouter();
  const statusStyle = getStatusStyle(session.status);
  const duration = calculateDuration(session.startTime, session.endTime);
  const formattedDate = formatDate(session.examDate);
  const formattedStartTime = formatTime(session.startTime);

  return (
    <div className="rounded-lg border border-gray-200 shadow-sm bg-white dark:bg-[#0A0A0A] dark:border-teal-900 overflow-hidden w-full hover:scale-105 transition-all duration-300 hover:shadow-lg hover:border-primary/30 dark:hover:border-teal-700">
      <div className="border-b-4 border-primary/50 dark:border-teal-900 px-4 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <div className="rounded-full bg-primary dark:bg-teal-900 p-2 mr-3">
          </div>
          <div>
            <h3 className="font-medium text-base text-gray-900 dark:text-white">{session.examName}</h3>
            <p className="text-xs text-gray-600">Code: {session.examCode}</p>
          </div>
        </div>
        <div>
          <span className={`inline-flex items-center font-medium px-2 py-1 rounded-full text-xs ${statusStyle.bgColor} ${statusStyle.textColor}`}>
            <span className={`w-2 h-2 rounded-full mr-1 ${statusStyle.dotColor}`}></span>
            {session.status}
          </span>
        </div>
      </div>
      
      <div className="p-4 space-y-3">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center text-sm">
            <Calendar className="text-teal-600 mr-2" size={16} />
            <span className="dark:text-white/60 text-black/80">{formattedDate}</span>
          </div>
          <div className="flex items-center text-sm">
            <Clock className="text-teal-600 mr-2" size={16} />
            <span className="dark:text-white/60 text-black/80">Duration: {duration}</span>
          </div>
          <div className="flex items-center text-sm">
            <BookCheck className="text-teal-600 mr-2" size={16} />
            <span className="dark:text-white/60 text-black/80">Time: {formattedStartTime}</span>
          </div>
          <div className="flex items-center text-sm">
            <FileType2 className="text-teal-600 mr-2" size={16} />
            <span className="dark:text-white/60 text-black/80">Mode: {session.examMode}</span>
          </div>
        </div>
        
        <div className="flex justify-between items-center pt-2">
          <div className="text-xs text-gray-500">Created by: {session.createdBy}</div>
          <Button
            variant="outline"
            size="sm"
            className="text-xs hover:bg-primary cursor-pointer hover:text-white dark:border-teal-900 dark:text-teal-500 dark:hover:bg-teal-900 dark:hover:text-white"
            onClick={() => {
              router.push(`/admin/dashboard/exams/test?examCode=${session.examCode}`);
            }}
          >
            Proctor Exam
          </Button>
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

// Main component that accepts data as a prop
interface ExamCardsProps {
  data: ExamSession[];
}

const ExamCards = ({ data }: ExamCardsProps) => {
  return (
    <div className="h-[500px] p-6 bg-gray-50 dark:bg-black/50 max-h-screen overflow-auto scrollbar-custom">
      {/* <SectionHeader title="All Exams" count={allSessions.length} /> */}
      <ExamGrid sessions={data} />
    </div>
  );
};

export default ExamCards;