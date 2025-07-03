import { useSelector } from "react-redux"
import { RootState } from "@/redux/store"
import { 
  BookOpen, 
  Calendar, 
  Clock, 
  Shield, 
  Settings, 
  FileText, 
  Bell,
  GraduationCap,
  BookMarked,
  Users,
  BookOpenCheck,
  Lock,
  Video,
  Mic,
  Wifi,
  Shuffle,
  ArrowLeftRight,
  CheckCircle,
  XCircle
} from "lucide-react"
import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
}

const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 }
}

export default function ExamSummary() {
  const examState = useSelector((state: RootState) => state.exam.createExam);

  const calculateDuration = (startTime: string, endTime: string) => {
    if (!startTime || !endTime) return "Not set";
    
    const start = new Date(`2000-01-01T${startTime}`);
    const end = new Date(`2000-01-01T${endTime}`);
    
    const diffInMinutes = Math.floor((end.getTime() - start.getTime()) / (1000 * 60));
    const hours = Math.floor(diffInMinutes / 60);
    const minutes = diffInMinutes % 60;
    
    return `${hours}h ${minutes}m`;
  };

  const StatusBadge = ({ value }: { value: boolean }) => (
    <div className={cn(
      "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium",
      value 
        ? "bg-teal-50 text-teal-700 border border-teal-200 dark:bg-teal-900/20 dark:text-teal-400 dark:border-teal-800" 
        : "bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-900/20 dark:text-rose-400 dark:border-rose-800"
    )}>
      {value ? (
        <CheckCircle className="w-3 h-3" />
      ) : (
        <XCircle className="w-3 h-3" />
      )}
      {value ? "Enabled" : "Disabled"}
    </div>
  );

  const InfoRow = ({ icon: Icon, label, value, highlight = false }: { 
    icon: LucideIcon, 
    label: string, 
    value: string | number | boolean,
    highlight?: boolean 
  }) => (
    <motion.div 
      variants={item}
      className={cn(
        "flex items-center justify-between py-2.5 px-3 rounded-lg transition-all duration-200",
        highlight 
          ? "bg-teal-50 dark:bg-teal-950/10 border border-teal-100 dark:border-teal-900" 
          : "hover:bg-gray-50 dark:hover:bg-gray-800/30"
      )}
    >
      <div className="flex items-center gap-3">
        <div className={cn(
          "p-1.5 rounded-lg",
          highlight 
            ? "bg-teal-100 dark:bg-teal-900/30" 
            : "bg-gray-100 dark:bg-gray-800"
        )}>
          <Icon className={cn(
            "w-3.5 h-3.5",
            highlight 
              ? "text-teal-600 dark:text-teal-400" 
              : "text-gray-600 dark:text-gray-400"
          )} />
        </div>
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </span>
      </div>
      <div className="text-sm">
        {typeof value === 'boolean' ? (
          <StatusBadge value={value} />
        ) : (
          <span className={cn(
            "font-medium px-2.5 py-1 rounded-md",
            value && value !== "Not set"
              ? "text-gray-900 dark:text-gray-100 bg-gray-100 dark:bg-gray-800"
              : "text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50"
          )}>
            {value || "Not set"}
          </span>
        )}
      </div>
    </motion.div>
  );

  const SectionCard = ({ 
    title, 
    icon: Icon, 
    children, 
    priority = 'normal' 
  }: { 
    title: string, 
    icon: LucideIcon, 
    children: React.ReactNode,
    priority?: 'high' | 'normal' | 'low'
  }) => {
    const priorityStyles = {
      high: "bg-white dark:bg-black/80 border-teal-200 dark:border-teal-800",
      normal: "bg-white dark:bg-black/80 border-gray-200 dark:border-gray-800",
      low: "bg-gray-50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-700"
    };

    return (
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className={cn(
          "rounded-xl border shadow-sm transition-all duration-300 hover:shadow-md",
          priorityStyles[priority]
        )}
      >
        <div className="p-4">
          <motion.div 
            variants={item}
            className="flex items-center gap-3 mb-4"
          >
            <div className={cn(
              "p-2 rounded-lg",
              priority === 'high' 
                ? "bg-teal-100 dark:bg-teal-900/40" 
                : "bg-gray-100 dark:bg-gray-800"
            )}>
              <Icon className={cn(
                "w-4 h-4",
                priority === 'high' 
                  ? "text-teal-600 dark:text-teal-400" 
                  : "text-gray-600 dark:text-gray-400"
              )} />
            </div>
            <h3 className={cn(
              "font-semibold",
              priority === 'high' 
                ? "text-teal-900 dark:text-teal-100 text-base" 
                : "text-gray-800 dark:text-gray-200 text-sm"
            )}>
              {title}
            </h3>
          </motion.div>
          <div className="space-y-1">
            {children}
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="text-center pb-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Exam Summary
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Review your exam configuration before publishing
        </p>
      </div>

      {/* High Priority Sections */}
      <div className="grid gap-6">
        <SectionCard title="Exam Overview" icon={BookOpen} priority="high" >
          <InfoRow icon={BookMarked} label="Exam Name" value={examState.examName} highlight />
          <InfoRow icon={FileText} label="Exam Code" value={examState.examCode} highlight />
          <InfoRow icon={Calendar} label="Exam Date" value={examState.examDate} highlight />
          <InfoRow 
            icon={Clock} 
            label="Duration" 
            value={calculateDuration(examState.startTime, examState.endTime)} 
            highlight 
          />
          <InfoRow 
            icon={Clock} 
            label="Time Slot" 
            value={examState.startTime && examState.endTime 
              ? `${examState.startTime} - ${examState.endTime}`
              : "Not set"
            } 
            highlight 
          />
        </SectionCard>
      </div>

      {/* Normal Priority Sections - 2 Column Layout */}
      <div className="grid lg:grid-cols-2 gap-6">
        <SectionCard title="Academic Details" icon={GraduationCap}>
          <InfoRow icon={GraduationCap} label="Faculty" value={examState.facultyId} />
          <InfoRow icon={BookOpenCheck} label="Course" value={examState.courseId} />
          <InfoRow icon={Users} label="Batch" value={examState.batchId} />
          <InfoRow icon={BookOpen} label="Module" value={examState.moduleId} />
        </SectionCard>

        <SectionCard title="Exam Format" icon={Settings}>
          <InfoRow icon={BookOpen} label="Mode" value={examState.examMode} />
          <InfoRow icon={FileText} label="Total Questions" value={examState.examQuestions.length} />
          <InfoRow icon={Shuffle} label="Randomize Questions" value={examState.randomizeQuestions} />
          <InfoRow icon={ArrowLeftRight} label="Randomize Answers" value={examState.randomizeAnswers} />
          <InfoRow icon={CheckCircle} label="Allow Backtracking" value={examState.allowBackTracking} />
        </SectionCard>

        <SectionCard title="Security & Monitoring" icon={Shield}>
          <InfoRow icon={Video} label="Webcam Required" value={examState.webcamRequired} />
          <InfoRow icon={Mic} label="Microphone Required" value={examState.micRequired} />
          <InfoRow icon={Wifi} label="Network Test" value={examState.networkStrengthTest} />
          <InfoRow icon={Lock} label="Lockdown Browser" value={examState.lockdownBrowser} />
        </SectionCard>

        <SectionCard title="Notifications" icon={Bell}>
          <InfoRow icon={Bell} label="Notify Students" value={examState.notifyStudents} />
          <InfoRow icon={Bell} label="Send Reminders" value={examState.sendReminders} />
          {examState.sendReminders && (
            <InfoRow 
              icon={Clock} 
              label="Reminder Time" 
              value={`${examState.reminderTime} minutes before`} 
            />
          )}
        </SectionCard>
      </div>
    </motion.div>
  )
}