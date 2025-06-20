import React from 'react'
import StudentExam from '@/components/student/Dashboard/testExam'

const page = () => {
  return (
    <div className='flex flex-col items-center justify-center h-screen'>
      <StudentExam examId="123" />
    </div>
  )
}

export default page