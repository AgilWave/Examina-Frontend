"use client";
import React, { useState, useEffect, useMemo } from "react";
import Header from "./Header";
import SearchField from "./helpers/Search";
import { ExamReport } from "./examReport";
import { getExamReports } from "./examReportsService";
import { Exam } from '@/types/reports';
import ExamDetailsForm from "./filters/sample";
import { Loader2 } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { useQueryState } from "nuqs";
import { getAllFaculties } from "@/services/Faculty/getAllFaculties";
import { getAllCourses } from "@/services/Course/getAllCourses";
import { getAllBatches } from "@/services/Batch/getAllBatches";

function Reports() {
  const dispatch = useDispatch();
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [faculties, setFaculties] = useState<{id: number, name: string}[]>([]);
  const [courses, setCourses] = useState<{id: number, name: string, facultyId: number}[]>([]);
  const [batches, setBatches] = useState<{id: number, batchCode: string, courseId: number}[]>([]);
  
  // Get filter criteria from Redux store
  const filterState = useSelector((state: RootState) => state.examReportFilter);
  
  // Get search query from URL state
  const [searchQuery] = useQueryState("searchQuery");

  // Helper functions to map IDs to names
  const getFacultyNameById = (id: number): string | null => {
    const faculty = faculties.find(f => f.id === id);
    return faculty ? faculty.name : null;
  };

  const getCourseNameById = (id: number): string | null => {
    const course = courses.find(c => c.id === id);
    return course ? course.name : null;
  };

  const getBatchNameById = (id: number): string | null => {
    const batch = batches.find(b => b.id === id);
    return batch ? batch.batchCode : null;
  };

  // Check if any filters are applied
  const hasActiveFilters = useMemo(() => {
    return filterState.facultyId !== 0 || 
           filterState.courseId !== 0 || 
           filterState.batchId !== 0 || 
           filterState.moduleId !== 0 ||
           filterState.examDate !== "";
  }, [filterState]);

  // Filter exams based on selected criteria
  const filteredExams = useMemo(() => {
    if (!exams.length) return [];

    console.log('=== FILTERING DEBUG ===');
    console.log('Total exams:', exams.length);
    console.log('Filter state:', filterState);
    console.log('Search query:', searchQuery);
    
    // Log sample exam data
    if (exams.length > 0) {
      console.log('Sample exam:', exams[0]);
    }

    return exams.filter((exam) => {
      // Filter by search query if provided
      if (searchQuery && searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesSearch = 
          exam.examName.toLowerCase().includes(query) ||
          exam.examCode.toLowerCase().includes(query) ||
          exam.faculty?.toLowerCase().includes(query) ||
          exam.course?.toLowerCase().includes(query) ||
          exam.batch?.toLowerCase().includes(query);
        
        if (!matchesSearch) {
          return false;
        }
      }

      // Filter by date if selected
      if (filterState.examDate) {
        const examDate = new Date(exam.date).toISOString().split('T')[0];
        if (examDate !== filterState.examDate) {
          return false;
        }
      }

      // Filter by faculty if selected
      if (filterState.facultyId && filterState.facultyId !== 0) {
        const selectedFacultyName = getFacultyNameById(filterState.facultyId);
        console.log('Faculty filter debug:', {
          selectedFacultyId: filterState.facultyId,
          selectedFacultyName,
          examFaculty: exam.faculty,
          faculties: faculties
        });
        
        if (selectedFacultyName && exam.faculty) {
          // More flexible matching - check if exam faculty contains key words from selected faculty
          const examFaculty = exam.faculty.toLowerCase();
          const selectedFaculty = selectedFacultyName.toLowerCase();
          
          // Split by common words and check for matches
          const facultyWords = selectedFaculty.split(/\s+|faculty\s+of\s+/i).filter(word => word.length > 2);
          const hasMatch = facultyWords.some(word => examFaculty.includes(word));
          
          console.log('Faculty matching:', {
            examFaculty,
            selectedFaculty,
            facultyWords,
            hasMatch
          });
          
          if (!hasMatch) {
            console.log('❌ Exam rejected due to faculty mismatch');
            return false;
          }
        } else if (selectedFacultyName) {
          // If we have a selected faculty but exam has no faculty data, exclude it
          console.log('❌ Exam rejected due to missing faculty data');
          return false;
        }
      }

      // Filter by course if selected  
      if (filterState.courseId && filterState.courseId !== 0) {
        const selectedCourseName = getCourseNameById(filterState.courseId);
        if (selectedCourseName && exam.course) {
          const examCourse = exam.course.toLowerCase();
          const selectedCourse = selectedCourseName.toLowerCase();
          
          // Check for partial matches
          if (!examCourse.includes(selectedCourse) && !selectedCourse.includes(examCourse)) {
            return false;
          }
        } else if (selectedCourseName) {
          return false;
        }
      }

      // Filter by batch if selected
      if (filterState.batchId && filterState.batchId !== 0) {
        const selectedBatchName = getBatchNameById(filterState.batchId);
        if (selectedBatchName && exam.batch) {
          const examBatch = exam.batch.toLowerCase();
          const selectedBatch = selectedBatchName.toLowerCase();
          
          // Check for partial matches
          if (!examBatch.includes(selectedBatch) && !selectedBatch.includes(examBatch)) {
            return false;
          }
        } else if (selectedBatchName) {
          return false;
        }
      }

      // Filter by module - this might require more complex logic as exams don't directly have module info
      if (filterState.moduleId && filterState.moduleId !== 0) {
        // Module filtering might need to be based on course or other related data
        // For now, we'll skip module filtering until we understand the data relationship better
      }

      return true;
    });
    
    console.log('Filtered results:', filteredExams.length);
  }, [exams, searchQuery, filterState, faculties, courses, batches]);

  useEffect(() => {
    const fetchExams = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch exam data
        const examData = await getExamReports();
        console.log('Loaded exam data:', examData);
        setExams(examData);
        
        // Fetch lookup data for filtering
        const facultyData = await getAllFaculties(null, 1, 100, false, null, null);
        if (facultyData?.listContent) {
          console.log('Loaded faculty data:', facultyData.listContent);
          setFaculties(facultyData.listContent);
        }
        
        const courseData = await getAllCourses(null, 1, 100, false, null, null);
        if (courseData?.listContent) {
          console.log('Loaded course data:', courseData.listContent);
          setCourses(courseData.listContent);
        }
        
        const batchData = await getAllBatches(null, 1, 100, false, null, null);
        if (batchData?.listContent) {
          console.log('Loaded batch data:', batchData.listContent);
          setBatches(batchData.listContent);
        }
        
      } catch (err) {
        console.error('Error fetching exam reports:', err);
        setError('Failed to load exam reports. Please try again later.');
        setExams([]);
      } finally {
        setLoading(false);
      }
    };

    fetchExams();
  }, []);

  if (loading) {
    return (
      <div className="h-fit p-1 md:p-8">
        <div className="max-w-8xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center md:items-center mb-4 md:mb-8 gap-4">
            <Header />
          </div>
        </div>
        <div className="flex flex-col gap-4 bg-card rounded-xl p-4 shadow-sm border">
          <div className="flex flex-col gap-4">
            <ExamDetailsForm/>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-center p-8">
          <div className="flex items-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Loading exam reports...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-fit p-1 md:p-8">
        <div className="max-w-8xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center md:items-center mb-4 md:mb-8 gap-4">
            <Header />
          </div>
        </div>
        <div className="flex flex-col gap-4 bg-card rounded-xl p-4 shadow-sm border">
          <div className="flex flex-col gap-4">
            <ExamDetailsForm/>
          </div>
        </div>
        <div className="mt-4 bg-destructive/10 border border-destructive/20 rounded-lg p-4">
          <div className="text-destructive text-center">
            <p className="font-medium">Error loading exam reports</p>
            <p className="text-sm text-muted-foreground mt-1">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-fit p-1 md:p-8">
      <div className="max-w-8xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-center mb-4 md:mb-8 gap-4">
          <Header />
        </div>
      </div>
      <div className="flex flex-col gap-4 bg-card rounded-xl p-4 shadow-sm border">
        <div className="flex flex-col gap-4">
          {/* <SearchField /> */}
          <ExamDetailsForm/>
        </div>
      </div>
      <div className="mt-4">
        {filteredExams.length > 0 ? (
          <ExamReport exams={filteredExams} />
        ) : exams.length > 0 ? (
          <div className="bg-muted/50 border rounded-lg p-8 text-center">
            {hasActiveFilters ? (
              <>
                <p className="text-muted-foreground">No exam reports found for the selected criteria.</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {filterState.facultyId !== 0 && (
                    <>Showing results for faculty: <strong>{getFacultyNameById(filterState.facultyId) || 'Unknown Faculty'}</strong><br /></>
                  )}
                  {filterState.courseId !== 0 && (
                    <>Showing results for course: <strong>{getCourseNameById(filterState.courseId) || 'Unknown Course'}</strong><br /></>
                  )}
                  {filterState.batchId !== 0 && (
                    <>Showing results for batch: <strong>{getBatchNameById(filterState.batchId) || 'Unknown Batch'}</strong><br /></>
                  )}
                  {filterState.examDate && (
                    <>Showing results for date: <strong>{filterState.examDate}</strong><br /></>
                  )}
                  Try selecting different criteria or clear the filters to see all reports.
                </p>
              </>
            ) : (
              <>
                <p className="text-muted-foreground">No exam reports match the selected filters.</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Try adjusting your search criteria or clear the filters.
                </p>
              </>
            )}
          </div>
        ) : (
          <div className="bg-muted/50 border rounded-lg p-8 text-center">
            <p className="text-muted-foreground">No exam reports found.</p>
            <p className="text-sm text-muted-foreground mt-1">
              Create some exams to see them here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Reports;
