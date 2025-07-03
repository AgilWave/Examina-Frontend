"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowLeft,
  Calendar,
  FileText,
  Users,
  BookOpen,
  AlertTriangle,
  Eye,
  Camera,
  Monitor,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Loader from "@/components/ui/loader";
import { getInactiveExamById } from "@/services/history/getInactiveExamById";
import { BACKEND_URL } from "@/Constants/backend";

interface ExamStudent {
  studentId: number;
  studentName: string;
  studentEmail: string;
  studentIdNumber: string;
  hasParticipated: boolean;
  joinedAt: string;
  isSubmitted: boolean;
  submittedAt: string;
  totalQuestions: number;
  answeredQuestions: number;
  violations: ViolationDetail[];
  answers: unknown[];
}

interface ViolationDetail {
  id: number;
  violationType: string;
  count: number;
  violationTimestamp: string;
  description: string;
  status: string;
  webcamScreenshotPath?: string;
  screenScreenshotPath?: string;
}

interface ExamStatistics {
  totalStudents: number;
  participatedCount: number;
  participationRate: string;
  submittedCount: number;
  submissionRate: string;
  totalViolations: number;
  totalAnswers: number;
  averageAnswersPerStudent: string;
}

interface ExamDetails {
  id: number;
  examName: string;
  examCode: string;
  examDate: string;
  startTime: string;
  endTime: string;
  status: string;
  faculty: string;
  course: string;
  batch: string;
  module: string;
  lecture: string;
  totalQuestions: number;
  examMode: string;
  description: string;
}

function ExamHistoryDetails() {
  const params = useParams();
  const router = useRouter();
  const [examData, setExamData] = useState<ExamDetails | null>(null);
  const [statistics, setStatistics] = useState<ExamStatistics | null>(null);
  const [students, setStudents] = useState<ExamStudent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStudentViolations, setSelectedStudentViolations] = useState<
    ViolationDetail[]
  >([]);
  const [violationDialogOpen, setViolationDialogOpen] = useState(false);
  const [selectedStudentName, setSelectedStudentName] = useState<string>("");
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [selectedImageType, setSelectedImageType] = useState<string>("");

  const examId = params.id as string;

  useEffect(() => {
    const fetchExamDetails = async () => {
      try {
        setLoading(true);
        const response = await getInactiveExamById(examId);

        if (response.isSuccessful && response.content) {
          const {
            examDetails,
            statistics: statsData,
            students: studentsData,
          } = response.content;
          setExamData(examDetails);
          setStatistics(statsData);
          setStudents(studentsData);
        } else {
          setError(response.message || "Failed to fetch exam details");
        }
        setLoading(false);
      } catch (err: unknown) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch exam details"
        );
        setLoading(false);
      }
    };

    if (examId) {
      fetchExamDetails();
    }
  }, [examId]);

  const formatDateTime = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  const calculateDuration = (startTime: string, endTime: string) => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    const durationMs = end.getTime() - start.getTime();

    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));

    return `${hours}h ${minutes}m`;
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "active":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "scheduled":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const getViolationIcon = (violationType: string) => {
    switch (violationType.toLowerCase()) {
      case "webcam":
      case "camera":
        return <Camera className="w-3 h-3" />;
      case "screen":
      case "monitor":
        return <Monitor className="w-3 h-3" />;
      case "focus":
      case "tab":
        return <Eye className="w-3 h-3" />;
      default:
        return <AlertTriangle className="w-3 h-3" />;
    }
  };

  const handleStudentViolationClick = (student: ExamStudent) => {
    if (student.violations && student.violations.length > 0) {
      setSelectedStudentViolations(student.violations);
      setSelectedStudentName(student.studentName);
      setViolationDialogOpen(true);
    }
  };

  const formatViolationTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      day: "2-digit",
      month: "short",
    });
  };

  const handleImageClick = (imagePath: string, imageType: string) => {
    setSelectedImage(BACKEND_URL + imagePath);
    setSelectedImageType(imageType);
    setImageModalOpen(true);
  };

  if (loading) {
    return (
      <div className="h-fit p-1 md:p-8">
        <div className="max-w-8xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <Loader />
          </div>
        </div>
      </div>
    );
  }

  if (error || !examData) {
    return (
      <div className="h-fit p-1 md:p-8">
        <div className="max-w-8xl mx-auto">
          <div className="flex flex-col items-center justify-center h-64 space-y-4">
            <div className="text-red-600 text-lg font-medium">
              {error || "Exam not found"}
            </div>
            <Button
              onClick={() => router.back()}
              variant="outline"
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-fit p-1 md:p-8">
      <div className="max-w-8xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => router.back()}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {examData.examName}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Exam Code: {examData.examCode}
              </p>
            </div>
          </div>
          <Badge className={getStatusColor(examData.status)}>
            {examData.status}
          </Badge>
        </div>

        {/* Exam Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Exam Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Description
                </label>
                <p className="text-gray-900 dark:text-gray-100">
                  {examData.description}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Mode
                  </label>
                  <p className="text-gray-900 dark:text-gray-100 capitalize">
                    {examData.examMode}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Total Questions
                  </label>
                  <p className="text-gray-900 dark:text-gray-100">
                    {examData.totalQuestions}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Schedule Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Schedule
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Date
                </label>
                <p className="text-gray-900 dark:text-gray-100">
                  {formatDateTime(examData.examDate)}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Start Time
                  </label>
                  <p className="text-gray-900 dark:text-gray-100">
                    {formatDateTime(examData.startTime)}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    End Time
                  </label>
                  <p className="text-gray-900 dark:text-gray-100">
                    {formatDateTime(examData.endTime)}
                  </p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Duration
                </label>
                <p className="text-gray-900 dark:text-gray-100">
                  {calculateDuration(examData.startTime, examData.endTime)}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Academic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Academic Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Faculty
                  </label>
                  <p className="text-gray-900 dark:text-gray-100">
                    {examData.faculty || "N/A"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Course
                  </label>
                  <p className="text-gray-900 dark:text-gray-100">
                    {examData.course || "N/A"}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Batch
                  </label>
                  <p className="text-gray-900 dark:text-gray-100">
                    {examData.batch || "N/A"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Module
                  </label>
                  <p className="text-gray-900 dark:text-gray-100">
                    {examData.module || "N/A"}
                  </p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Lecturer
                </label>
                <p className="text-gray-900 dark:text-gray-100">
                  {examData.lecture || "N/A"}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Student Participation */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Student Participation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="max-h-60 overflow-y-auto">
                {students.length > 0 ? (
                  students.slice(0, 10).map((student) => (
                    <div
                      key={student.studentId}
                      className={`flex items-center justify-between p-2 border rounded-lg ${
                        student.violations && student.violations.length > 0
                          ? "cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                          : ""
                      }`}
                      onClick={() => handleStudentViolationClick(student)}
                    >
                      <div className="flex-1">
                        <div className="font-medium text-sm flex items-center gap-2">
                          {student.studentName}
                          {student.violations &&
                            student.violations.length > 0 && (
                              <div className="flex items-center gap-1">
                                <AlertTriangle className="w-4 h-4 text-red-500" />
                                <span className="text-xs text-red-500 font-medium">
                                  {student.violations.length} violation
                                  {student.violations.length > 1 ? "s" : ""}
                                </span>
                              </div>
                            )}
                        </div>
                        <div className="text-xs text-gray-500">
                          {student.studentIdNumber}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Badge
                          variant={
                            student.hasParticipated ? "default" : "secondary"
                          }
                        >
                          {student.hasParticipated ? "Joined" : "Not Joined"}
                        </Badge>
                        <Badge
                          variant={
                            student.isSubmitted ? "default" : "destructive"
                          }
                        >
                          {student.isSubmitted ? "Submitted" : "Pending"}
                        </Badge>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-gray-500 py-4">
                    No student data available
                  </div>
                )}
                {students.length > 10 && (
                  <div className="text-center text-sm text-gray-500 pt-2">
                    ... and {students.length - 10} more students
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Statistics */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Exam Statistics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {examData.totalQuestions || 0}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Total Questions
                  </div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {statistics?.totalStudents || 0}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Total Students
                  </div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {statistics?.participatedCount || 0}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Participated
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-500">
                    {statistics?.participationRate || "0%"}
                  </div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {statistics?.submittedCount || 0}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Submitted
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-500">
                    {statistics?.submissionRate || "0%"}
                  </div>
                </div>
              </div>

              {/* Additional Statistics Row */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {statistics?.totalViolations || 0}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Total Violations
                  </div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {statistics?.totalAnswers || 0}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Total Answers
                  </div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {statistics?.averageAnswersPerStudent || "0"}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Avg Answers/Student
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Dialog
          open={violationDialogOpen}
          onOpenChange={setViolationDialogOpen}
        >
          <DialogContent className="w-[95vw] !max-w-none max-h-[85vh] overflow-y-auto !left-[2.5vw] !translate-x-0">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                Violations for {selectedStudentName}
              </DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-3 space-y-4 mt-4">
              {selectedStudentViolations.map((violation) => (
                <div
                  key={violation.id}
                  className="border rounded-lg p-4 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getViolationIcon(violation.violationType)}
                      <span className="font-medium text-sm capitalize">
                        {violation.violationType} Violation
                      </span>
                      <Badge variant="destructive" className="text-xs">
                        Count: {violation.count}
                      </Badge>
                    </div>
                    <div className="text-xs text-gray-500">
                      {formatViolationTime(violation.violationTimestamp)}
                    </div>
                  </div>

                  {violation.description && (
                    <div>
                      <label className="text-xs font-medium text-gray-600 dark:text-gray-400">
                        Description
                      </label>
                      <p className="text-sm text-gray-800 dark:text-gray-200">
                        {violation.description}
                      </p>
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                      Status:
                    </span>
                    <Badge
                      variant={
                        violation.status === "active"
                          ? "destructive"
                          : "secondary"
                      }
                      className="text-xs"
                    >
                      {violation.status}
                    </Badge>
                  </div>

                  {/* Screenshots Section */}
                  {(violation.webcamScreenshotPath ||
                    violation.screenScreenshotPath) && (
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-gray-600 dark:text-gray-400">
                        Evidence Screenshots
                      </label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {violation.webcamScreenshotPath && (
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                              <Camera className="w-3 h-3" />
                              Webcam Screenshot
                            </div>
                            <div
                              className="relative border rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 cursor-pointer hover:opacity-80 transition-opacity"
                              onClick={() =>
                                handleImageClick(
                                  violation.webcamScreenshotPath!,
                                  "Webcam Screenshot"
                                )
                              }
                            >
                              <img
                                src={
                                  BACKEND_URL + violation.webcamScreenshotPath
                                }
                                alt="Webcam violation evidence"
                                className="w-full h-32 object-cover"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = "none";
                                  const parent = target.parentElement;
                                  if (parent) {
                                    parent.innerHTML =
                                      '<div class="flex items-center justify-center h-32 text-gray-400 text-xs">Image not available</div>';
                                  }
                                }}
                              />
                            </div>
                          </div>
                        )}

                        {violation.screenScreenshotPath && (
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                              <Monitor className="w-3 h-3" />
                              Screen Screenshot
                            </div>
                            <div
                              className="relative border rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 cursor-pointer hover:opacity-80 transition-opacity"
                              onClick={() =>
                                handleImageClick(
                                  violation.screenScreenshotPath!,
                                  "Screen Screenshot"
                                )
                              }
                            >
                              <img
                                src={
                                  BACKEND_URL + violation.screenScreenshotPath
                                }
                                alt="Screen violation evidence"
                                className="w-full h-32 object-cover"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = "none";
                                  const parent = target.parentElement;
                                  if (parent) {
                                    parent.innerHTML =
                                      '<div class="flex items-center justify-center h-32 text-gray-400 text-xs">Image not available</div>';
                                  }
                                }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {selectedStudentViolations.length === 0 && (
                <div className="text-center text-gray-500 py-8">
                  No violations found for this student.
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>

        {/* Image Modal */}
        <Dialog open={imageModalOpen} onOpenChange={setImageModalOpen}>
          <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden p-0">
            <DialogHeader className="p-6 pb-2">
              <DialogTitle className="flex items-center gap-2">
                {selectedImageType === "Webcam Screenshot" ? (
                  <Camera className="w-5 h-5" />
                ) : (
                  <Monitor className="w-5 h-5" />
                )}
                {selectedImageType}
              </DialogTitle>
            </DialogHeader>
            <div className="px-6 pb-6">
              <div className="relative w-full max-h-[70vh] overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
                <img
                  src={selectedImage}
                  alt={selectedImageType}
                  className="w-full h-auto object-contain max-h-[70vh]"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = "none";
                    const parent = target.parentElement;
                    if (parent) {
                      parent.innerHTML =
                        '<div class="flex items-center justify-center h-64 text-gray-400">Image not available</div>';
                    }
                  }}
                />
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

export default ExamHistoryDetails;
