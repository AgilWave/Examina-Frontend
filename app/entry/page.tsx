import ExamEntryFlow from '@/components/student/Dashboard/exam/ExamEntry/ExamEntry';
import { Suspense } from 'react';

const ExamEntryTab = () => {
    return (
      <div>
        <Suspense fallback={<div>Loading...</div>}>
          <ExamEntryFlow />
        </Suspense>
      </div>
    );
  };
  
  export default ExamEntryTab