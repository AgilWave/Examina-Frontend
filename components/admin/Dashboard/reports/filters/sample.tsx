import React, { ReactNode, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import {
  setFilterFacultyId,
  setFilterCourseId,
  setFilterBatchId,
  setFilterModuleId,
  setFilterExamDate,
  resetAllFilters
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
import { CalendarIcon, X } from "lucide-react";
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
  const [loading, setLoading] = useState({
    faculties: false,
    courses: false,
    batches: false,
    modules: false,
  });

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
    if (filterState.facultyId) {
      setIsLoading(true);
      try {
        const coursesData = await getAllCourses(null, 1, 10, false, null, null);
        if (coursesData?.listContent) {
          const filteredCourses = coursesData.listContent.filter(
            (course: Course) => course.facultyId === filterState.facultyId
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
  }, [filterState.facultyId]);

  const fetchBatches = useMemo(() => async () => {
    if (filterState.courseId) {
      setIsLoading(true);
      try {
        const batchesData = await getAllBatches(null, 1, 10, false, null, null);
        if (batchesData?.listContent) {
          const filteredBatches = batchesData.listContent.filter(
            (batch: Batch) => batch.courseId === filterState.courseId
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
  }, [filterState.courseId]);

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
    if (filterState.courseId) {
      const selectedCourse = courses.find(course => course.id === filterState.courseId);
      if (selectedCourse?.modules) {
        setModules(selectedCourse.modules);
      } else {
        setModules([]);
      }
    } else {
      setModules([]);
    }
  }, [filterState.courseId, courses]);

  const handleFacultyChange = (value: string) => {
    dispatch(resetAllFilters());
    dispatch(setFilterFacultyId(parseInt(value)));
  };

  const handleCourseChange = (value: string) => {
    dispatch(resetAllFilters());
    dispatch(setFilterCourseId(parseInt(value)));
  };

  const handleBatchChange = (value: string) => {
    dispatch(resetAllFilters());
    dispatch(setFilterBatchId(parseInt(value)));
  };

  const handleModuleChange = (value: string) => {
    dispatch(resetAllFilters());
    dispatch(setFilterModuleId(parseInt(value)));
  };

  // Fetch data for dropdowns
  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        // Fetch faculties
        setLoading((prev) => ({ ...prev, faculties: true }));
        const facultyResponse = await getAllFaculties(
          null,
          1,
          100,
          false,
          null,
          "true"
        );
        if (facultyResponse?.data?.faculties) {
          setFaculties(facultyResponse.data.faculties);
        }
        setLoading((prev) => ({ ...prev, faculties: false }));

        // Fetch courses
        setLoading((prev) => ({ ...prev, courses: true }));
        const courseResponse = await getAllCourses(
          null,
          1,
          100,
          false,
          null,
          "true"
        );
        if (courseResponse?.data?.courses) {
          setCourses(courseResponse.data.courses);
        }
        setLoading((prev) => ({ ...prev, courses: false }));

        // Fetch batches
        setLoading((prev) => ({ ...prev, batches: true }));
        const batchResponse = await getAllBatches(
          null,
          1,
          100,
          false,
          null,
          "true"
        );
        if (batchResponse?.data?.batches) {
          setBatches(batchResponse.data.batches);
        }
        setLoading((prev) => ({ ...prev, batches: false }));

        // Fetch modules
        setLoading((prev) => ({ ...prev, modules: true }));
        const moduleResponse = await getAllModules(
          null,
          1,
          100,
          false,
          null,
          "true"
        );
        if (moduleResponse?.data?.modules) {
          setModules(moduleResponse.data.modules);
        }
        setLoading((prev) => ({ ...prev, modules: false }));
      } catch (error) {
        console.error("Error fetching dropdown data:", error);
        setLoading({
          faculties: false,
          courses: false,
          batches: false,
          modules: false,
        });
      }
    };

    fetchDropdownData();
  }, []);

  return (
    <CardContent>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Filter Exam Reports
        </h3>
      </div>

      {/* Filter Sections */}
      <div className="space-y-6">
        {/* Date Filter and Search Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    dispatch(resetAllFilters());
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

          {/* Search Section */}
          <div>
            <Label className="text-sm font-medium text-gray-700 dark:text-white mb-2 block">
              Search Exams
            </Label>
            <SearchField />
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
          </div>
        </div>
      </div>
    </CardContent>
  );
}
