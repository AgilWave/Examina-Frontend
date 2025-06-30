"use client";

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Calendar, 
  Clock, 
  Users, 
  UserX, 
  FileText, 
  GraduationCap,
  BookOpen,
  Library,
  ChevronRight
} from 'lucide-react';
import { Exam } from '@/types/reports';

interface ExamReportProps {
  exams: Exam[];
}

export function ExamReport({ exams }: ExamReportProps) {
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleRowClick = (exam: Exam) => {
    setSelectedExam(exam);
    setIsDialogOpen(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    return new Date(timeString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-4 ">
      {!exams || exams.length === 0 ? (
        <div className="bg-muted/50 border rounded-lg p-8 text-center">
          <p className="text-muted-foreground">No exam data available to display.</p>
          <p className="text-sm text-muted-foreground mt-1">
            Check console for debugging information.
          </p>
        </div>
      ) : (
        exams.map((exam) => (
        <Card 
          key={exam.id} 
          className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:bg-accent/50 bg-white dark:bg-[#0A0A0A] border dark:border-teal-800"
          onClick={() => handleRowClick(exam)}
        >
          <CardContent className="p-3 sm:p-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0">
              <div className="flex-1 space-y-2 sm:space-y-1">
                <div className="flex items-center gap-2 sm:gap-4">
                  <div className="space-y-1 flex-1">
                    <h3 className="font-semibold text-base sm:text-lg text-foreground leading-tight">
                      {exam.examName}
                    </h3>
                    <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                      <FileText className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                      <span className="font-mono bg-muted px-1.5 py-0.5 sm:px-2 sm:py-1 rounded text-xs">
                        {exam.examCode}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-xs sm:text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-blue-500 flex-shrink-0" />
                    <span className="font-medium">{formatDate(exam.date)}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <GraduationCap className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 flex-shrink-0" />
                    <span className="truncate">{exam.faculty}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Library className="h-3 w-3 sm:h-4 sm:w-4 text-orange-500 flex-shrink-0" />
                    <span className="truncate">{exam.course}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-3 w-3 sm:h-4 sm:w-4 text-purple-500 flex-shrink-0" />
                    <Badge variant="outline" className="text-xs">
                      {exam.batch}
                    </Badge>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between sm:justify-end gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-muted">
                <Badge variant="secondary" className="px-2 py-1 sm:px-3 text-xs">
                  {exam.details.participantCount} participants
                </Badge>
                <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground flex-shrink-0" />
              </div>
            </div>
          </CardContent>
        </Card>
        ))
      )}

      {/* Exam Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-[95vw] xl:max-w-[90vw] 2xl:max-w-[75vw] max-h-[95vh] w-full">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <FileText className="h-4 w-4 sm:h-5 sm:w-5" />
              Examination Summary
            </DialogTitle>
            <DialogDescription>
              Detailed examination report including participant statistics, question distribution, and timing information.
            </DialogDescription>
          </DialogHeader>
          
          {selectedExam && (
            <ScrollArea className="max-h-[calc(90vh-8rem)]">
              <div className="space-y-6 p-2">
                {/* Exam Basic Info */} 
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-foreground">Exam Details</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Exam Name:</span>
                        <span className="font-medium text-right">{selectedExam.examName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Code:</span>
                        <span className="font-mono bg-muted px-2 py-1 rounded text-xs">
                          {selectedExam.examCode}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Date:</span>
                        <span className="font-medium">{formatDate(selectedExam.date)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Faculty:</span>
                        <span className="font-medium text-right">{selectedExam.faculty}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Course:</span>
                        <span className="font-medium text-right">{selectedExam.course}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Batch:</span>
                        <Badge variant="outline">{selectedExam.batch}</Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-semibold text-foreground">Timing & Duration</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Start Time:</span>
                        <span className="font-medium">{formatTime(selectedExam.details.startTime)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">End Time:</span>
                        <span className="font-medium">{formatTime(selectedExam.details.endTime)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Duration:</span>
                        <span className="font-medium">{selectedExam.details.duration}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Statistics */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Card className="bg-blue-50 border dark:border-teal-700  dark:bg-card">
                    <CardContent className="p-3 sm:p-4 text-center">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <Users className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 dark:text-white" />
                        <span className="text-xs sm:text-sm font-medium text-blue-600 dark:text-white">Total Participants</span>
                      </div>
                      <div className="text-xl sm:text-2xl font-bold text-blue-700 dark:text-white">
                        {selectedExam.details.participantCount}
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-red-50 border dark:border-teal-700  dark:bg-card">
                    <CardContent className="p-3 sm:p-4 text-center">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <UserX className="h-4 w-4 sm:h-5 sm:w-5 text-red-600 dark:text-white" />
                        <span className="text-xs sm:text-sm font-medium text-red-600 dark:text-white">Absent</span>
                      </div>
                      <div className="text-xl sm:text-2xl font-bold text-red-700 dark:text-white">
                        {selectedExam.details.absentCount}
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-green-50 border dark:border-teal-700 dark:bg-card">
                    <CardContent className="p-3 sm:p-4 text-center">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 dark:text-white" />
                        <span className="text-xs sm:text-sm font-medium text-green-600 dark:text-white">Present</span>
                      </div>
                      <div className="text-xl sm:text-2xl font-bold text-green-700 dark:text-white">
                        {selectedExam.details.participantCount - selectedExam.details.absentCount}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Separator />

                {/* Question Distribution */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-foreground flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Question Distribution
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {selectedExam.details.questionCounts.map((question, index) => (
                      <div 
                        key={index}
                        className="flex justify-between items-center p-3 bg-muted rounded-lg"
                      >
                        <span className="text-sm font-medium">{question.type}</span>
                        <Badge variant="secondary">{question.count} questions</Badge>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Participants List */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-foreground flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Participant List
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Present Participants */}
                    <div className="space-y-3">
                      <h5 className="text-sm font-medium text-green-600 flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Present ({selectedExam.details.participantCount - selectedExam.details.absentCount})
                      </h5>
                      <div className="space-y-2 max-h-64 overflow-y-auto scrollbar-custom custom-scrollbar">
                        {selectedExam.details.participants
                          .filter(p => p.status === 'present')
                          .map((participant) => (
                            <div 
                              key={participant.id}
                              className="flex items-center justify-between p-2 bg-green-50 dark:bg-card rounded-lg border border-green-200"
                            >
                              <div>
                                <div className="font-medium text-sm">{participant.name}</div>
                                <div className="text-xs text-muted-foreground">{participant.email}</div>
                              </div>
                              <Badge variant="default" className="bg-green-100 text-green-800 dark:bg-green-800/10 hover:bg-green-100">
                                Present
                              </Badge>
                            </div>
                          ))}
                      </div>
                    </div>

                    {/* Absent Participants */}
                    <div className="space-y-3">
                      <h5 className="text-sm font-medium text-red-600 flex items-center gap-2">
                        <UserX className="h-4 w-4" />
                        Absent ({selectedExam.details.absentCount})
                      </h5>
                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        {selectedExam.details.participants
                          .filter(p => p.status === 'absent')
                          .map((participant) => (
                            <div 
                              key={participant.id}
                              className="flex items-center justify-between p-2 bg-red-50 dark:bg-card rounded-lg border border-red-200"
                            >
                              <div>
                                <div className="font-medium text-sm">{participant.name}</div>
                                <div className="text-xs text-muted-foreground">{participant.email}</div>
                              </div>
                              <Badge variant="destructive" className="bg-red-100 text-red-800 dark:bg-red-800/10 hover:bg-red-100">
                                Absent
                              </Badge>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}