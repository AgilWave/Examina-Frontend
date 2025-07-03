"use client";

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  User, 
  FileText, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Calendar,
  TrendingUp,
  Download,
  RefreshCw,
} from 'lucide-react';
import { getStudentByID } from '@/services/Students/getStudentsByID';
import { useDispatch } from 'react-redux';
import { StudentDetails, StudentExamReport } from './types';
import { generateStudentReportPDF } from './studentReportPDFTemplate';

function StudentReport() {
  const [isDialogOpen, setIsDialogOpen] = useState(true);
  const [studentId, setStudentId] = useState('');
  const [loading, setLoading] = useState(false);
  const [studentDetails, setStudentDetails] = useState<StudentDetails | null>(null);
  const [examReports, setExamReports] = useState<StudentExamReport[]>([]);
  const dispatch = useDispatch();

  // Mock data for demonstration - replace with actual API calls
  const mockExamReports: StudentExamReport[] = [
    {
      id: 1,
      examName: "Database Management Systems - Final",
      examCode: "DBMS2024F",
      moduleName: "Database Management",
      courseName: "Computer Science",
      examDate: "2024-06-15",
      startTime: "10:00",
      endTime: "12:00",
      status: "completed",
      score: 85,
      totalMarks: 100,
      percentage: 85,
      timeSpent: "1h 45m",
      submissionTime: "11:45",
      rank: 5,
      totalParticipants: 45
    },
    {
      id: 2,
      examName: "Data Structures and Algorithms - Midterm",
      examCode: "DSA2024M",
      moduleName: "Data Structures",
      courseName: "Computer Science",
      examDate: "2024-05-20",
      startTime: "14:00",
      endTime: "16:00",
      status: "completed",
      score: 92,
      totalMarks: 100,
      percentage: 92,
      timeSpent: "1h 55m",
      submissionTime: "15:55",
      rank: 2,
      totalParticipants: 45
    },
    {
      id: 3,
      examName: "Operating Systems - Quiz 1",
      examCode: "OS2024Q1",
      moduleName: "Operating Systems",
      courseName: "Computer Science",
      examDate: "2024-06-25",
      startTime: "09:00",
      endTime: "10:00",
      status: "missed",
      totalMarks: 50,
      totalParticipants: 45
    },
    {
      id: 4,
      examName: "Software Engineering - Final Project",
      examCode: "SE2024FP",
      moduleName: "Software Engineering",
      courseName: "Computer Science",
      examDate: "2024-07-10",
      startTime: "10:00",
      endTime: "13:00",
      status: "pending",
      totalMarks: 150,
      totalParticipants: 45
    }
  ];

  const handleGetReport = async () => {
    if (!studentId.trim()) return;
    
    setLoading(true);
    try {
      // Get student details
        //eslint-disable-next-line 
      const studentData = await getStudentByID(dispatch, studentId);
      
      // Mock student details - replace with actual API response
      const mockStudentDetails: StudentDetails = {
        id: parseInt(studentId),
        name: "Shehal herath",
        email: "shehal.herath@student.nibm.lk",
        studentId: studentId,
        faculty: "Faculty of Engineering",
        course: "Software Engeering",
        batch: "KUHDSE241F",
        enrollmentDate: "2024-01-15",
        isActive: true
      };
      
      setStudentDetails(mockStudentDetails);
      setExamReports(mockExamReports);
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error fetching student data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckAnotherStudent = () => {
    setStudentId('');
    setStudentDetails(null);
    setExamReports([]);
    setIsDialogOpen(true);
  };

  const handleDownloadPDF = () => {
    if (!studentDetails) return;
    
    // Create a printable version of the report using the external template
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const printContent = generateStudentReportPDF(studentDetails, examReports);

    printWindow.document.write(printContent);
    printWindow.document.close();
  };

  const completedExams = examReports.filter(exam => exam.status === 'completed');
  const missedExams = examReports.filter(exam => exam.status === 'missed');
  const pendingExams = examReports.filter(exam => exam.status === 'pending');

  const averageScore = completedExams.length > 0 
    ? completedExams.reduce((sum, exam) => sum + (exam.percentage || 0), 0) / completedExams.length 
    : 0;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 dark:bg-green-900/20 dark:text-green-500 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Completed</Badge>;
      case 'missed':
        return <Badge className="bg-red-100 dark:bg-red-900/20 dark:text-red-500 text-red-800"><XCircle className="w-3 h-3 mr-1" />Missed</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-500 text-yellow-800"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };
  return (
    <div className="p-6 space-y-6">
      {/* Custom CSS for animations */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes fadeInUp {
            0% {
              opacity: 0;
              transform: translateY(30px);
            }
            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          @keyframes fadeIn {
            0% { opacity: 0; }
            100% { opacity: 1; }
          }
          
          @keyframes slideInLeft {
            0% {
              opacity: 0;
              transform: translateX(-30px);
            }
            100% {
              opacity: 1;
              transform: translateX(0);
            }
          }
          
          @keyframes slideInRight {
            0% {
              opacity: 0;
              transform: translateX(30px);
            }
            100% {
              opacity: 1;
              transform: translateX(0);
            }
          }
          
          @keyframes slideInUp {
            0% {
              opacity: 0;
              transform: translateY(30px);
            }
            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          @keyframes float {
            0%, 100% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-8px);
            }
          }
          
          .float-animation {
            animation: float 6s ease-in-out infinite;
          }
          
          .float-animation:nth-child(2) {
            animation-delay: 2s;
          }
          
          .float-animation:nth-child(3) {
            animation-delay: 4s;
          }
        `
      }} />
      
      {/* Dialog for Student ID Input */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Enter Student ID
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="studentId">Student ID</Label>
                <Input
                  id="studentId"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  placeholder="Enter student ID"
                  className="mt-1"
                />
              </div>
              <Button 
                onClick={handleGetReport} 
                className="w-full"
                disabled={!studentId.trim() || loading}
              >
                {loading ? 'Loading...' : 'Get Report'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Student Report Content */}
        {studentDetails && (
          <div className="space-y-6">
            {/* Action Buttons */}
            <div className="flex justify-between items-center">
              <Button 
                onClick={handleCheckAnotherStudent}
                variant="outline"
                className="flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Check Another Student
              </Button>
              <Button 
                onClick={handleDownloadPDF}
                className="flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download Report
              </Button>
            </div>

            {/* Student Details Header */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Student Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Name</Label>
                    <p className="text-lg font-semibold">{studentDetails.name}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Student ID</Label>
                    <p className="text-lg font-semibold">{studentDetails.studentId}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Faculty</Label>
                    <p className="text-lg font-semibold">{studentDetails.faculty}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Course</Label>
                    <p className="text-lg font-semibold">{studentDetails.course}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Batch</Label>
                    <p className="text-lg font-semibold">{studentDetails.batch}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Performance Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                    <div>
                      <p className="text-2xl font-bold">{completedExams.length}</p>
                      <p className="text-sm text-gray-600">Completed Exams</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2">
                    <XCircle className="w-8 h-8 text-red-600" />
                    <div>
                      <p className="text-2xl font-bold">{missedExams.length}</p>
                      <p className="text-sm text-gray-600">Missed Exams</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-8 h-8 text-teal-600" />
                    <div>
                      <p className="text-2xl font-bold">{averageScore.toFixed(1)}%</p>
                      <p className="text-sm text-gray-600">Average Score</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2">
                    <Clock className="w-8 h-8 text-yellow-600" />
                    <div>
                      <p className="text-2xl font-bold">{pendingExams.length}</p>
                      <p className="text-sm text-gray-600">Pending Exams</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Detailed Reports Tabs */}
            <Tabs defaultValue="overview" className="space-y-4">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
                <TabsTrigger value="missed">Missed</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      All Examinations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow >
                          <TableHead>Exam Name</TableHead>
                          <TableHead>Faculty</TableHead>
                          <TableHead>Course</TableHead>
                          <TableHead>Module</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Score</TableHead>
                          <TableHead>Rank</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {examReports.map((exam) => (
                          <TableRow key={exam.id}>
                            <TableCell className="font-medium">{exam.examName}</TableCell>
                            <TableCell className="text-sm text-gray-600">Faculty of Engineering</TableCell>
                            <TableCell className="text-sm text-gray-600">{exam.courseName}</TableCell>
                            <TableCell>{exam.moduleName}</TableCell>
                            <TableCell>{new Date(exam.examDate).toLocaleDateString()}</TableCell>
                            <TableCell>{getStatusBadge(exam.status)}</TableCell>
                            <TableCell>
                              {exam.score ? (
                                <span className={`font-semibold ${getScoreColor(exam.percentage!)}`}>
                                  {exam.score}/{exam.totalMarks} ({exam.percentage}%)
                                </span>
                              ) : (
                                <span className="text-gray-500">-</span>
                              )}
                            </TableCell>
                            <TableCell>
                              {exam.rank ? (
                                <span className="text-sm">
                                  {exam.rank}/{exam.totalParticipants}
                                </span>
                              ) : (
                                <span className="text-gray-500">-</span>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="completed" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      Completed Examinations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Exam Name</TableHead>
                          <TableHead>Faculty</TableHead>
                          <TableHead>Course</TableHead>
                          <TableHead>Module</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Score</TableHead>
                          <TableHead>Time Spent</TableHead>
                          <TableHead>Rank</TableHead>
                          <TableHead>Submission Time</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {completedExams.map((exam) => (
                          <TableRow key={exam.id}>
                            <TableCell className="font-medium">{exam.examName}</TableCell>
                            <TableCell className="text-sm text-gray-600">Faculty of Engineering</TableCell>
                            <TableCell className="text-sm text-gray-600">{exam.courseName}</TableCell>
                            <TableCell>{exam.moduleName}</TableCell>
                            <TableCell>{new Date(exam.examDate).toLocaleDateString()}</TableCell>
                            <TableCell>
                              <span className={`font-semibold ${getScoreColor(exam.percentage!)}`}>
                                {exam.score}/{exam.totalMarks} ({exam.percentage}%)
                              </span>
                            </TableCell>
                            <TableCell>{exam.timeSpent}</TableCell>
                            <TableCell>
                              <Badge variant="outline">
                                {exam.rank}/{exam.totalParticipants}
                              </Badge>
                            </TableCell>
                            <TableCell>{exam.submissionTime}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="missed" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <XCircle className="w-5 h-5 text-red-600" />
                      Missed Examinations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {missedExams.length > 0 ? (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Exam Name</TableHead>
                            <TableHead>Faculty</TableHead>
                            <TableHead>Course</TableHead>
                            <TableHead>Module</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Time</TableHead>
                            <TableHead>Total Marks</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {missedExams.map((exam) => (
                            <TableRow key={exam.id}>
                              <TableCell className="font-medium">{exam.examName}</TableCell>
                              <TableCell className="text-sm text-gray-600">Faculty of Engineering</TableCell>
                              <TableCell className="text-sm text-gray-600">{exam.courseName}</TableCell>
                              <TableCell>{exam.moduleName}</TableCell>
                              <TableCell>{new Date(exam.examDate).toLocaleDateString()}</TableCell>
                              <TableCell>{exam.startTime} - {exam.endTime}</TableCell>
                              <TableCell>{exam.totalMarks}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    ) : (
                      <div className="text-center py-8">
                        <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900">No Missed Exams</h3>
                        <p className="text-gray-600">This student has not missed any examinations.</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="pending" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-yellow-600" />
                      Pending Examinations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {pendingExams.length > 0 ? (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Exam Name</TableHead>
                            <TableHead>Faculty</TableHead>
                            <TableHead>Course</TableHead>
                            <TableHead>Module</TableHead>
                            <TableHead>Scheduled Date</TableHead>
                            <TableHead>Time</TableHead>
                            <TableHead>Total Marks</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {pendingExams.map((exam) => (
                            <TableRow key={exam.id}>
                              <TableCell className="font-medium">{exam.examName}</TableCell>
                              <TableCell className="text-sm text-gray-600">Faculty of Engineering</TableCell>
                              <TableCell className="text-sm text-gray-600">{exam.courseName}</TableCell>
                              <TableCell>{exam.moduleName}</TableCell>
                              <TableCell>{new Date(exam.examDate).toLocaleDateString()}</TableCell>
                              <TableCell>{exam.startTime} - {exam.endTime}</TableCell>
                              <TableCell>{exam.totalMarks}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    ) : (
                      <div className="text-center py-8">
                        <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900">No Pending Exams</h3>
                        <p className="text-gray-600">This student has no upcoming examinations.</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        )}

        {/* Empty State */}
        {!studentDetails && !isDialogOpen && (
          <div className="min-h-[70vh] flex items-center justify-center">
            <div className="text-center max-w-md mx-auto px-6">
              {/* Animated Icon Container */}
              <div className="relative mb-8">
                <div className="w-32 h-32 mx-auto mb-6 relative">
                  {/* Background circles for animation */}
                  <div className="absolute inset-0 bg-gradient-to-r from-teal-100 to-emerald-100 rounded-full animate-pulse"></div>
                  <div className="absolute inset-2 bg-gradient-to-r from-teal-50 to-emerald-500 rounded-full animate-ping"></div>
                  
                  {/* Main icon */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <User className="w-16 h-16 text-teal-500 animate-bounce" />
                  </div>
                      {/* Floating elements */}
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-teal-500 rounded-full animate-pulse opacity-60 float-animation"></div>
                <div className="absolute -bottom-1 -left-1 w-4 h-4 bg-emerald-400 rounded-full animate-pulse opacity-70 float-animation"></div>
                <div className="absolute top-4 -left-3 w-3 h-3 bg-teal-400 rounded-full animate-pulse opacity-50 float-animation"></div>
                </div>
              </div>            {/* Content */}
            <div className="space-y-4 opacity-0 animate-pulse" style={{animation: 'fadeInUp 0.8s ease-out 0.3s forwards'}}>
              <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
                Student Report Center
              </h2>
              <h3 className="text-xl font-semibold text-gray-700 mb-3">
                No Student Selected
              </h3>
              <p className="text-gray-600 leading-relaxed mb-6">
                Start by entering a student ID to generate comprehensive examination reports with detailed analytics and performance insights.
              </p>
              
              {/* Features list */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 text-sm">
                <div className="flex flex-col items-center p-3 bg-teal-50 dark:bg-card rounded-lg border transform hover:scale-105 transition-all duration-300 ease-out hover:shadow-md" style={{animation: 'slideInLeft 0.6s ease-out 0.5s forwards', opacity: 0}}>
                  <FileText className="w-5 h-5 text-teal-500 mb-1" />
                  <span className="text-teal-700 font-medium">Detailed Reports</span>
                </div>
                <div className="flex flex-col items-center p-3 bg-emerald-50  dark:bg-card rounded-lg border transform hover:scale-105 transition-all duration-300 ease-out hover:shadow-md" style={{animation: 'slideInUp 0.6s ease-out 0.7s forwards', opacity: 0}}>
                  <TrendingUp className="w-5 h-5 text-emerald-500 mb-1" />
                  <span className="text-emerald-700 font-medium">Performance Analytics</span>
                </div>
                <div className="flex flex-col items-center p-3 bg-cyan-50  dark:bg-card rounded-lg border transform hover:scale-105 transition-all duration-300 ease-out hover:shadow-md" style={{animation: 'slideInRight 0.6s ease-out 0.9s forwards', opacity: 0}}>
                  <Download className="w-5 h-5 text-cyan-500 mb-1" />
                  <span className="text-cyan-700 font-medium">PDF Export</span>
                </div>
              </div>

              {/* Call to action button */}
              <div style={{animation: 'fadeInUp 0.6s ease-out 1.1s forwards', opacity: 0}}>
                <Button 
                  onClick={() => setIsDialogOpen(true)}
                  size="lg"
                  className="relative bg-teal-600 hover:from-teal-700 hover:to-emerald-700 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 ease-out overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                  {/* <Search className="w-5 h-5 mr-3 relative z-10" /> */}
                  <span className="relative z-10">Enter Student ID</span>
                </Button>
              </div>
              
              {/* Subtle hint */}
              <p className="text-xs text-gray-400 mt-4 flex items-center justify-center gap-1" style={{animation: 'fadeIn 0.6s ease-out 1.3s forwards', opacity: 0}}>
                <span className="w-2 h-2 bg-teal-300 rounded-full animate-pulse"></span>
                Quick access to student examination history and analytics
                <span className="w-2 h-2 bg-teal-300 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></span>
              </p>
            </div>
            </div>
          </div>
        )}
      </div>
  );
}

export default StudentReport;