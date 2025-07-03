import { useState, useEffect, useMemo } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label";
import { CircleDot } from "lucide-react"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "@/redux/store"
import {
  setCreateExamName,
  setCreateExamCode,
  setCreateExamDescription,
  setCreateExamFacultyId,
  setCreateExamCourseId,
  setCreateExamBatchId,
  setCreateExamModuleId,
  setCreateExamLectureId,
} from "@/redux/features/examSlice"
import { getAllFaculties } from "@/services/Faculty/getAllFaculties";
import { getAllCourses } from "@/services/Course/getAllCourses";
import { getAllBatches } from "@/services/Batch/getAllBatches";
import { getAllLectures } from "@/services/Lectures/getAllLectures";

interface Faculty {
  id: number;
  name: string;
}

interface Course {
  id: number;
  name: string;
  facultyId: number;
  modules: {
    id: number;
    name: string;
  }[];
}

interface Batch {
  id: number;
  batchCode: string;
  courseId: number;
}

interface Lecture {
  id: number;
  name: string;
  lecture: {
    id: number;
    courses: {
      id: number;
      name: string;
    }[]
  }
}

interface Module {
  id: number;
  name: string;
}

export default function ExamDetailsForm() {
  const dispatch = useDispatch();
  const examState = useSelector((state: RootState) => state.exam.createExam);
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Function to generate exam code
  const generateExamCode = useMemo(() => {
    return () => {
      if (!examState.batchId || !examState.moduleId) return '';

      const selectedBatch = batches.find(batch => batch.id === examState.batchId);
      const selectedModule = modules.find(module => module.id === examState.moduleId);

      if (!selectedBatch || !selectedModule) return '';

      // Format: BATCH-MODULE-EXAM
      // Example: 2023-PROG101-MID
      const batchCode = selectedBatch.batchCode;
      const moduleCode = selectedModule.name.substring(0, 6).toUpperCase();
      const examType = 'MID'; // You can make this dynamic based on exam type if needed

      return `${batchCode}-${moduleCode}-${examType}-${new Date().getDate()}-${new Date().getMinutes()}`;
    };
  }, [examState.batchId, examState.moduleId, batches, modules]);

  // Update exam code when batch or module changes
  useEffect(() => {
    const newExamCode = generateExamCode();
    if (newExamCode) {
      dispatch(setCreateExamCode(newExamCode));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [examState.batchId, examState.moduleId, generateExamCode]);

  const fetchFaculties = useMemo(() => async () => {
    setIsLoading(true);
    try {
      const facultiesData = await getAllFaculties(null, 1, 10, false, null, null);
      if (facultiesData?.listContent) {
        setFaculties(facultiesData.listContent);
      }
    } catch (error) {
      console.error("Error fetching faculties:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchCourses = useMemo(() => async () => {
    if (examState.facultyId) {
      setIsLoading(true);
      try {
        const coursesData = await getAllCourses(null, 1, 10, false, null, null);
        if (coursesData?.listContent) {
          const filteredCourses = coursesData.listContent.filter(
            (course: Course) => course.facultyId === examState.facultyId
          );
          setCourses(filteredCourses);
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setIsLoading(false);
      }
    } else {
      setCourses([]);
    }
  }, [examState.facultyId]);

  const fetchBatches = useMemo(() => async () => {
    if (examState.courseId) {
      setIsLoading(true);
      try {
        const batchesData = await getAllBatches(null, 1, 10, false, null, null);
        if (batchesData?.listContent) {
          const filteredBatches = batchesData.listContent.filter(
            (batch: Batch) => batch.courseId === examState.courseId
          );
          setBatches(filteredBatches);
        }
      } catch (error) {
        console.error("Error fetching batches:", error);
      } finally {
        setIsLoading(false);
      }
    } else {
      setBatches([]);
    }
  }, [examState.courseId]);

  const fetchLectures = useMemo(() => async () => {
    if (examState.moduleId) {
      setIsLoading(true);
      try {
        const lecturesData = await getAllLectures(null, 1, 10, false, null, null);
        if (lecturesData?.listContent) {
          console.log("Fetched Lectures Data:", lecturesData.listContent);
          // Check the structure of each lecture item
          if (lecturesData.listContent.length > 0) {
            console.log("Example lecture item:", lecturesData.listContent[0]);
          }
          const filteredLectures = lecturesData.listContent.filter(
            (lecture: Lecture) => lecture.lecture.courses.some(course => course.id === examState.moduleId)
          );
          setLectures(filteredLectures);
        }
      } catch (error) {
        console.error("Error fetching lectures:", error);
      } finally {
        setIsLoading(false);
      }
    } else {
      setLectures([]);
    }
  }, [examState.moduleId]);

  useEffect(() => {
    fetchFaculties();
  }, [fetchFaculties]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  useEffect(() => {
    fetchBatches();
  }, [fetchBatches]);

  useEffect(() => {
    if (examState.courseId) {
      const selectedCourse = courses.find(course => course.id === examState.courseId);
      if (selectedCourse?.modules) {
        setModules(selectedCourse.modules);
      } else {
        setModules([]);
      }
    } else {
      setModules([]);
    }
  }, [examState.courseId, courses]);

  useEffect(() => {
    fetchLectures();
  }, [fetchLectures]);

  const handleFacultyChange = (value: string) => {
    dispatch(setCreateExamFacultyId(parseInt(value)));
    dispatch(setCreateExamCourseId(0));
    dispatch(setCreateExamBatchId(0));
    dispatch(setCreateExamModuleId(0));
    dispatch(setCreateExamLectureId(0));
  };

  const handleCourseChange = (value: string) => {
    dispatch(setCreateExamCourseId(parseInt(value)));
    dispatch(setCreateExamBatchId(0));
    dispatch(setCreateExamModuleId(0));
    dispatch(setCreateExamLectureId(0));
  };

  const handleBatchChange = (value: string) => {
    dispatch(setCreateExamBatchId(parseInt(value)));
  };

  const handleModuleChange = (value: string) => {
    dispatch(setCreateExamModuleId(parseInt(value)));
    dispatch(setCreateExamLectureId(0));
  };

  return (
    <Card className="rounded-2xl dark:border-black/20 shadow-md">
      <CardContent>
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-teal-500/20 p-2 rounded-full">
            <CircleDot className="text-teal-600" size={20} />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Exam Details</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">Enter the basic information about your exam.</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Basic Exam Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-800 dark:text-white">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="min-h-[56px] w-full">
                <Label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">Exam Name</Label>
                <Input
                  className="h-9 w-full"
                  placeholder="E.g. Software Engineering Midterm"
                  value={examState.examName}
                  onChange={(e) => dispatch(setCreateExamName(e.target.value))}
                />
              </div>

              <div className="min-h-[56px] w-full">
                <Label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">Exam Code</Label>
                <Input
                  className="h-9 w-full bg-gray-50 dark:bg-gray-800"
                  placeholder="Auto-generated based on batch and module"
                  value={examState.examCode}
                  readOnly
                />
                <p className="text-xs text-gray-500 mt-1">Auto-generated based on selected batch and module</p>
              </div>

              <div className="col-span-1 md:col-span-2">
                <Label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">Description</Label>
                <Textarea
                  className="w-full max-h-15 overflow-y-auto scroll resize-none"
                  placeholder="Short description of the exam"
                  rows={2}
                  value={examState.description}
                  onChange={(e) => dispatch(setCreateExamDescription(e.target.value))}
                />
              </div>
            </div>
          </div>

          {/* Academic Structure */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-800 dark:text-white">Academic Structure</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="min-h-[56px] w-full">
                <Label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">Faculty Name</Label>
                <Select
                  value={examState.facultyId ? examState.facultyId.toString() : ""}
                  onValueChange={handleFacultyChange}
                  disabled={isLoading}
                >
                  <SelectTrigger className="h-12 w-full">
                    <SelectValue placeholder="Select a faculty (e.g. Computing, Engineering)" />
                  </SelectTrigger>
                  <SelectContent>
                    {faculties.length === 0 ? (
                      <SelectItem value="no-faculties" disabled>No faculties found</SelectItem>
                    ) : (
                      faculties.map((faculty) => (
                        <SelectItem key={faculty.id} value={faculty.id.toString()}>
                          {faculty.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="min-h-[56px] w-full">
                <Label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">Course Name</Label>
                <Select
                  value={examState.courseId ? examState.courseId.toString() : ""}
                  onValueChange={handleCourseChange}
                  disabled={isLoading || !examState.facultyId}
                >
                  <SelectTrigger className="h-12 w-full">
                    <SelectValue placeholder="Select a course (e.g. CS101, SE201)" />
                  </SelectTrigger>
                  <SelectContent>
                    {courses.length === 0 ? (
                      <SelectItem value="no-courses" disabled>No courses found</SelectItem>
                    ) : (
                      courses.map((course) => (
                        <SelectItem key={course.id} value={course.id.toString()}>
                          {course.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="min-h-[56px] w-full">
                <Label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">Module</Label>
                <Select
                  value={examState.moduleId ? examState.moduleId.toString() : ""}
                  onValueChange={handleModuleChange}
                  disabled={isLoading || !examState.courseId}
                >
                  <SelectTrigger className="h-12 w-full">
                    <SelectValue placeholder="Select a module (e.g. Programming, Database)" />
                  </SelectTrigger>
                  <SelectContent>
                    {modules.length === 0 ? (
                      <SelectItem value="no-modules" disabled>No modules found</SelectItem>
                    ) : (
                      modules.map((module) => (
                        <SelectItem key={module.id} value={module.id.toString()}>
                          {module.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="min-h-[56px] w-full">
                <Label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">Batch</Label>
                <Select
                  value={examState.batchId ? examState.batchId.toString() : ""}
                  onValueChange={handleBatchChange}
                  disabled={isLoading || !examState.courseId}
                >
                  <SelectTrigger className="h-12 w-full">
                    <SelectValue placeholder="Select a batch (e.g. 2023, 2024)" />
                  </SelectTrigger>
                  <SelectContent>
                    {batches.length === 0 ? (
                      <SelectItem value="no-batches" disabled>No batches found</SelectItem>
                    ) : (
                      batches.map((batch) => (
                        <SelectItem key={batch.id} value={batch.id.toString()}>
                          {batch.batchCode}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="min-h-[56px] w-full">
                <Label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">Lecturer / Examiner Name</Label>                <Select                  value={examState.lectureId ? 
                    lectures.find(lecture => lecture.lecture.id === examState.lectureId)?.id.toString() || "" : 
                    ""}
                  onValueChange={(value) => {
                    const selectedLecture = lectures.find(lecture => lecture.id.toString() === value);
                    if (selectedLecture) {
                      dispatch(setCreateExamLectureId(selectedLecture.lecture.id));
                    }
                  }}
                  disabled={isLoading || !examState.moduleId}
                >
                  <SelectTrigger className="h-12 w-full">
                    <SelectValue placeholder="Select a lecturer (e.g. Dr. Smith, Prof. Johnson)" />
                  </SelectTrigger>
                  <SelectContent>                    {lectures.length === 0 ? (
                      <SelectItem value="no-lecturers" disabled>No lecturers found</SelectItem>
                    ) : (                      lectures.map((lecture) => (
                        <SelectItem key={lecture.id} value={lecture.id.toString()}>
                          {lecture.name} {/* This represents the lecturer's name */}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

