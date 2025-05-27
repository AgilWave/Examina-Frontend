
// ExamSummary.tsx
import { ExamSummaryData } from "./type"
import { CheckCircle, XCircle,BookCheck   } from "lucide-react"

export default function ExamSummary({ data }: { data: ExamSummaryData }) {
  return (
    
    <main className="p-4 md:p-6 border rounded-xl md:rounded-2xl shadow-md bg-white dark:bg-card dark:border-black/20 w-full space-y-4 md:space-y-6">
      <div className="w-full space-y-6">
        {/* Heading */}
        <div className="flex items-center gap-2 md:gap-3">
          <BookCheck  
            className="text-teal-600 bg-teal-500/20 p-1.5 md:p-2 rounded-full"
            size={40}
          />
          <div>
            <h2 className="text-lg md:text-xl font-semibold text-black dark:text-white">
              Exam summary
            </h2>
            <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
              Review all information before submission
            </p>
          </div>
        </div>

        <div className="bg-teal-50  dark:bg-card border border-teal-200 dark:border-teal-700 rounded-lg p-4">
          <p className="text-teal-700 dark:text-teal-300 font-medium">
            Ready to Create Exam
          </p>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            Please review all the information below before creating the exam.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 ">
          {/* ... rest of the existing content ... */}
          <Section title="Exam Details">
            <Field label="Exam Name" value={data.examDetails.name} />
            <Field label="Exam Code" value={data.examDetails.code} />
            <Field label="Faculty" value={data.examDetails.faculty} />
            <Field label="Course" value={data.examDetails.course} />
            <Field label="Batch" value={data.examDetails.batch} />
            <Field label="Module" value={data.examDetails.module} />
            <Field label="Examiner" value={data.examDetails.examiner} />
          </Section>

          <Section title="Security Settings">
            <BooleanField label="Webcam Required" value={data.securitySettings.webcam} />
            <BooleanField label="Mic Required" value={data.securitySettings.mic} />
            <BooleanField label="Network Test" value={data.securitySettings.networkTest} />
            <BooleanField label="Lock Browser" value={data.securitySettings.lockBrowser} />
            <BooleanField label="Surroundings Photo" value={data.securitySettings.surroundingsPhoto} />
          </Section>

          <Section title="Scheduling">
            <Field label="Date" value={data.scheduling.date} />
            <Field label="Time" value={data.scheduling.time} />
          </Section>

          <Section title="Exam Format">
            <Field label="Mode" value={data.format.mode} />
            <BooleanField label="Randomize Questions" value={data.format.randomizeQuestions} />
            <BooleanField label="Randomize Answers" value={data.format.randomizeAnswers} />
            <BooleanField label="Allow Backtracking" value={data.format.allowBacktracking} />
            <Field label="Late Entry" value={data.format.lateEntry} />
          </Section>

          <Section title="Questions">
            <Field label="Question Source" value={data.questions.source} />
            <Field label="Questions Count" value={data.questions.count?.toString()} />
          </Section>

          <Section title="Notifications">
            <BooleanField label="Send Email" value={data.notifications.sendEmail} />
            <Field label="Send Reminder" value={data.notifications.reminder} />
          </Section>
        </div>
      </div>
    </main>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-md border border-gray-200 p-4 bg-white dark:bg-muted/30 dark:border-gray-700 shadow-sm  ">
      <h3 className="text-md font-semibold text-gray-800 dark:text-gray-100 mb-3">
        {title}
      </h3>
      <div className="space-y-2">{children}</div>
    </div>
  )
}

function Field({ label, value }: { label: string; value?: string }) {
  return (
    <p className="text-sm text-gray-700 dark:text-gray-200">
      <span className="font-medium">{label}: </span>
      <span className="italic">{value || "(Not specified)"}</span>
    </p>
  )
}

function BooleanField({ label, value }: { label: string; value?: boolean }) {
  const Icon = value ? CheckCircle : XCircle
  const iconColor = value ? "text-green-500" : "text-red-500"

  return (
    <p className="text-sm text-gray-700 dark:text-gray-200 flex items-center gap-2">
      <span className="font-medium">{label}:</span>
      <Icon size={16} className={iconColor} />
    </p>
  )
}
