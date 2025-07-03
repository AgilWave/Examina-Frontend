import React, { ReactNode, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import {
  setFilterFacultyId,
  setFilterCourseId,
  setFilterBatchId,
  setFilterModuleId,
  setFilterExamDate
} from "@/redux/features/examReportsSlice";
import SearchField from "../helpers/Search";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getAllFaculties } from "@/services/Faculty/getAllFaculties";
import { getAllCourses } from "@/services/Course/getAllCourses";
import { getAllBatches } from "@/services/Batch/getAllBatches";
import { getAllModules } from "@/services/module/getAllModules";

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
  [x: string]: ReactNode;
  id: number;
  batchCode: string;
  courseId: number;
}

interface Module {
  id: number;
  name: string;
}

export default function ExamDetailsForm() {

  // Handle faculty change
  const dispatch = useDispatch();
  const filterState = useSelector((state: RootState) => state.examReportFilter);
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      try {
        // Fetch all faculties
        const facultiesData = await getAllFaculties(null, 1, 100, false, null, null);
        if (facultiesData?.listContent) {
          setFaculties(facultiesData.listContent);
        }

        // Fetch all courses
        const coursesData = await getAllCourses(null, 1, 100, false, null, null);
        if (coursesData?.listContent) {
          setCourses(coursesData.listContent);
        }

        // Fetch all batches
        const batchesData = await getAllBatches(null, 1, 100, false, null, null);
        if (batchesData?.listContent) {
          setBatches(batchesData.listContent);
        }

        // Fetch all modules
        const modulesData = await getAllModules(null, 1, 100, false, null, null);
        if (modulesData?.listContent) {
          setModules(modulesData.listContent);
        }
      } catch (error) {
        console.error("Error fetching initial data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // Filter courses based on selected faculty
  const filteredCourses = useMemo(() => {
    if (!filterState.facultyId) return [];
    return courses.filter(course => course.facultyId === filterState.facultyId);
  }, [courses, filterState.facultyId]);

  // Filter batches based on selected course
  const filteredBatches = useMemo(() => {
    if (!filterState.courseId) return [];
    return batches.filter(batch => batch.courseId === filterState.courseId);
  }, [batches, filterState.courseId]);

  // Filter modules based on selected course
  const filteredModules = useMemo(() => {
    if (!filterState.courseId) return [];
    const selectedCourse = courses.find(course => course.id === filterState.courseId);
    return selectedCourse?.modules || [];
  }, [courses, filterState.courseId]);

  const handleFacultyChange = (value: string) => {
    const facultyId = parseInt(value);
    dispatch(setFilterFacultyId(facultyId));
    // Reset dependent filters
    dispatch(setFilterCourseId(0));
    dispatch(setFilterBatchId(0));
    dispatch(setFilterModuleId(0));
  };

  const handleCourseChange = (value: string) => {
    const courseId = parseInt(value);
    dispatch(setFilterCourseId(courseId));
    // Reset dependent filters
    dispatch(setFilterBatchId(0));
    dispatch(setFilterModuleId(0));
  };

  const handleBatchChange = (value: string) => {
    dispatch(setFilterBatchId(parseInt(value)));
  };

  const handleModuleChange = (value: string) => {
    dispatch(setFilterModuleId(parseInt(value)));
  };

  return (
    <CardContent>
      {/* Filter Sections */}
      <div className="space-y-6">
        {/* Date Filter and Search Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search Section */}
          <div>
            <Label className="text-sm font-medium text-gray-700 dark:text-white mb-2 block">
              Search Exams
            </Label>
            <SearchField />
          </div>
          {/* Date Filter */}
          <div>
            <Label className="text-sm font-medium text-gray-700 dark:text-white mb-2 block">
              Filter by Date
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !filterState.examDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {filterState.examDate ? (
                    format(new Date(filterState.examDate), "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={
                    filterState.examDate
                      ? new Date(filterState.examDate)
                      : undefined
                  }
                  onSelect={(date) => {
                    const newDate = date ? format(date, "yyyy-MM-dd") : "";
                    dispatch(setFilterExamDate(newDate));
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            {filterState.examDate && (
              <p className="text-sm text-muted-foreground mt-2">
                Filtering exams for: {" "}
                <span className="font-medium">
                  {format(new Date(filterState.examDate), "PPPP")}
                </span>
              </p>
            )}
          </div>

          
        </div>

        {/* Academic Filters Section */}
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Faculty Filter */}
            <div className="min-h-[56px] w-full">
              <Label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">
                Faculty Name
              </Label>
              <Select
                value={filterState.facultyId ? filterState.facultyId.toString() : ""}
                onValueChange={handleFacultyChange}
                disabled={isLoading}
              >
                <SelectTrigger className="h-12 w-full">
                  <SelectValue placeholder="Select a faculty (e.g. Computing, Engineering)" />
                </SelectTrigger>
                <SelectContent>
                  {faculties.length === 0 ? (
                    <SelectItem value="no-faculties" disabled>
                      No faculties found
                    </SelectItem>
                  ) : (
                    faculties.map((faculty) => (
                      <SelectItem
                        key={faculty.id}
                        value={faculty.id.toString()}
                      >
                        {faculty.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Course Filter */}
            <div className="min-h-[56px] w-full">
              <Label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">Course Name</Label>
              <Select
                value={filterState.courseId ? filterState.courseId.toString() : ""}
                onValueChange={handleCourseChange}
                disabled={isLoading || !filterState.facultyId}
              >
                <SelectTrigger className="h-12 w-full">
                  <SelectValue placeholder="Select a course (e.g. CS101, SE201)" />
                </SelectTrigger>
                <SelectContent>
                  {filteredCourses.length === 0 ? (
                    <SelectItem value="no-courses" disabled>
                      {!filterState.facultyId ? "Please select a faculty first" : "No courses found"}
                    </SelectItem>
                  ) : (
                    filteredCourses.map((course) => (
                      <SelectItem key={course.id} value={course.id.toString()}>
                        {course.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Module Filter */}
            <div className="min-h-[56px] w-full">
              <Label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">Module</Label>
              <Select
                value={filterState.moduleId ? filterState.moduleId.toString() : ""}
                onValueChange={handleModuleChange}
                disabled={isLoading || !filterState.courseId}
              >
                <SelectTrigger className="h-12 w-full">
                  <SelectValue placeholder="Select a module (e.g. Programming, Database)" />
                </SelectTrigger>
                <SelectContent>
                  {filteredModules.length === 0 ? (
                    <SelectItem value="no-modules" disabled>
                      {!filterState.courseId ? "Please select a course first" : "No modules found"}
                    </SelectItem>
                  ) : (
                    filteredModules.map((module) => (
                      <SelectItem key={module.id} value={module.id.toString()}>
                        {module.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Batch Filter */}
            <div className="min-h-[56px] w-full">
              <Label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">Batch</Label>
              <Select
                value={filterState.batchId ? filterState.batchId.toString() : ""}
                onValueChange={handleBatchChange}
                disabled={isLoading || !filterState.courseId}
              >
                <SelectTrigger className="h-12 w-full">
                  <SelectValue placeholder="Select a batch (e.g. 2023, 2024)" />
                </SelectTrigger>
                <SelectContent>
                  {filteredBatches.length === 0 ? (
                    <SelectItem value="no-batches" disabled>
                      {!filterState.courseId ? "Please select a course first" : "No batches found"}
                    </SelectItem>
                  ) : (
                    filteredBatches.map((batch) => (
                      <SelectItem key={batch.id} value={batch.id.toString()}>
                        {batch.batchCode}
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
  );
}
