// Test script to verify exam data mapping
const testExamData = [
  // Test case 1: Nested course and faculty
  {
    id: 1,
    examName: "Data Structures Final",
    examCode: "CS301",
    startTime: "2024-01-15T09:00:00",
    endTime: "2024-01-15T12:00:00",
    duration: 180, // minutes
    module: {
      name: "Advanced Data Structures",
      course: {
        name: "Computer Science Fundamentals",
        faculty: {
          name: "Faculty of Engineering"
        }
      }
    },
    batch: {
      name: "CS-2022-A",
      batchCode: "CS22A"
    }
  },
  
  // Test case 2: Direct string values
  {
    id: 2,
    examName: "Database Final",
    examCode: "DB401",
    startTime: "2024-01-20T14:00:00",
    endTime: "2024-01-20T16:30:00",
    faculty: "Computer Science Faculty",
    course: "Database Management Systems",
    batch: "CS-2021",
    durationInMinutes: 150
  },
  
  // Test case 3: Mixed data structures
  {
    id: 3,
    examName: "Network Security",
    examCode: "NET501",
    startTime: "2024-01-25T10:00:00",
    endTime: "2024-01-25T13:00:00",
    course: {
      name: "Network Security Fundamentals",
      faculty: "Information Technology"
    },
    batch: {
      batchName: "IT-2020-B"
    }
  }
];

// Simulate the mapping logic
function mapFaculty(exam) {
  if (exam.faculty?.name) return exam.faculty.name;
  if (typeof exam.faculty === 'string' && exam.faculty !== '') return exam.faculty;
  if (exam.module?.course?.faculty?.name) return exam.module.course.faculty.name;
  if (exam.module?.course?.faculty && typeof exam.module.course.faculty === 'string') return exam.module.course.faculty;
  if (exam.batch?.course?.faculty?.name) return exam.batch.course.faculty.name;
  if (exam.batch?.course?.faculty && typeof exam.batch.course.faculty === 'string') return exam.batch.course.faculty;
  if (exam.course?.faculty?.name) return exam.course.faculty.name;
  if (exam.course?.faculty && typeof exam.course.faculty === 'string') return exam.course.faculty;
  return 'Unknown Faculty';
}

function mapCourse(exam) {
  if (exam.course?.name) return exam.course.name;
  if (exam.course?.courseName) return exam.course.courseName;
  if (typeof exam.course === 'string' && exam.course !== '') return exam.course;
  if (exam.module?.course?.name) return exam.module.course.name;
  if (exam.module?.course?.courseName) return exam.module.course.courseName;
  if (exam.module?.course && typeof exam.module.course === 'string') return exam.module.course;
  if (exam.batch?.course?.name) return exam.batch.course.name;
  if (exam.batch?.course?.courseName) return exam.batch.course.courseName;
  if (exam.batch?.course && typeof exam.batch.course === 'string') return exam.batch.course;
  if (exam.module?.name && exam.module.name !== exam.examName) return exam.module.name;
  if (exam.moduleId && exam.moduleName) return exam.moduleName;
  return 'Unknown Course';
}

function mapDuration(exam) {
  if (exam.duration) {
    if (typeof exam.duration === 'string') return exam.duration;
    if (typeof exam.duration === 'number') {
      const hours = Math.floor(exam.duration / 60);
      const minutes = exam.duration % 60;
      if (hours > 0 && minutes > 0) return `${hours} hours ${minutes} minutes`;
      if (hours > 0) return `${hours} hours`;
      return `${minutes} minutes`;
    }
  }
  
  if (exam.startTime && exam.endTime) {
    const startTime = new Date(exam.startTime);
    const endTime = new Date(exam.endTime);
    if (!isNaN(startTime.getTime()) && !isNaN(endTime.getTime())) {
      const durationMs = endTime.getTime() - startTime.getTime();
      if (durationMs > 0) {
        const durationHours = Math.floor(durationMs / (1000 * 60 * 60));
        const durationMinutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
        if (durationHours > 0 && durationMinutes > 0) return `${durationHours} hours ${durationMinutes} minutes`;
        if (durationHours > 0) return `${durationHours} hours`;
        if (durationMinutes > 0) return `${durationMinutes} minutes`;
      }
    }
  }
  
  if (exam.durationInMinutes) {
    const minutes = parseInt(exam.durationInMinutes);
    if (!isNaN(minutes)) {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      if (hours > 0 && remainingMinutes > 0) return `${hours} hours ${remainingMinutes} minutes`;
      if (hours > 0) return `${hours} hours`;
      return `${remainingMinutes} minutes`;
    }
  }
  
  return '3 hours';
}

// Test the mapping
console.log('Testing exam data mapping:');
testExamData.forEach((exam, index) => {
  console.log(`\nTest Case ${index + 1}:`);
  console.log(`Exam: ${exam.examName}`);
  console.log(`Faculty: ${mapFaculty(exam)}`);
  console.log(`Course: ${mapCourse(exam)}`);
  console.log(`Duration: ${mapDuration(exam)}`);
});
