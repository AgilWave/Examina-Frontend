// types.ts
export type ExamSummaryData = {
  examDetails: {
    name?: string
    code?: string
    faculty?: string
    course?: string
    batch?: string
    module?: string
    examiner?: string
  }
  scheduling: {
    date?: string
    time?: string
  }
  securitySettings: {
    webcam: boolean
    mic: boolean
    networkTest: boolean
    lockBrowser: boolean
    surroundingsPhoto: boolean
  }
  format: {
    mode: string
    randomizeQuestions: boolean
    randomizeAnswers: boolean
    allowBacktracking: boolean
    lateEntry?: string
  }
  questions: {
    source: string
    count: number
  }
  notifications: {
    sendEmail: boolean
    reminder: string
  }
}
