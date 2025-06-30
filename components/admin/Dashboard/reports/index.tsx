"use client";
import React, { useState, useEffect, useMemo } from "react";
import Header from "./Header";
import SearchField from "./helpers/Search";
import { ExamReport } from "./examReport";
import { getExamReports } from "./examReportsService";
import { Exam } from '@/types/reports';
import ExamDetailsForm from "./filters/sample";
import { Loader2 } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useQueryState } from "nuqs";

function Reports() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Get filter criteria from Redux store
  const examState = useSelector((state: RootState) => state.exam.createExam);
  
  // Get search query from URL state
  const [searchQuery] = useQueryState("searchQuery");

  // Filter exams based on selected criteria
  const filteredExams = useMemo(() => {
    if (!exams.length) return [];

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
      if (examState.examDate) {
        const examDate = new Date(exam.date).toISOString().split('T')[0];
        if (examDate !== examState.examDate) {
          return false;
        }
      }

      // Filter by faculty if selected
      if (examState.facultyId && examState.facultyId !== 0) {
        // For now, we'll use name matching until proper ID mapping is implemented
        // You can enhance this by implementing proper ID to name mapping
        if (exam.faculty && !exam.faculty.toLowerCase().includes('faculty')) {
          // This is a placeholder - in a real implementation, you'd match by ID
          // For now, we'll allow all since we don't have faculty IDs in exam data
        }
      }

      // Filter by course if selected
      if (examState.courseId && examState.courseId !== 0) {
        // Placeholder for course filtering - similar to faculty
      }

      // Filter by batch if selected
      if (examState.batchId && examState.batchId !== 0) {
        // Placeholder for batch filtering - similar to faculty
      }

      // Filter by module if selected
      if (examState.moduleId && examState.moduleId !== 0) {
        // Placeholder for module filtering - similar to faculty
      }

      // All filters passed
      return true;
    });
  }, [exams, searchQuery, examState.examDate, examState.facultyId, examState.courseId, examState.batchId, examState.moduleId]);

  useEffect(() => {
    const fetchExams = async () => {
      try {
        setLoading(true);
        setError(null);
        const examData = await getExamReports();
        setExams(examData);
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
            <p className="text-muted-foreground">No exam reports match the selected filters.</p>
            <p className="text-sm text-muted-foreground mt-1">
              Try adjusting your search criteria or clear the filters.
            </p>
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
