// src/app/page.tsx
'use client'

import { useState } from 'react'
import { Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from "@/components/ui/input"
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DatePicker } from '@/components/ui/date-picker'
import { Card } from '@/components/ui/card'
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
  } from "@/components/ui/breadcrumb";

interface Exam {
  id: string
  title: string
  startTime: string
  endTime: string
  date: string
  status: 'Ongoing' | 'Pending' | 'Ended'
  type: 'Final Examination' | 'Mid Examination'
}

export default function ExamDashboard() {
  // Sample exam data with different statuses
  const exams: Exam[] = Array(9).fill(null).map((_, i) => ({
    id: `exam-${i + 1}`,
    title: 'Data Warehousing and Business Intelligence',
    startTime: '1:00 P.M',
    endTime: '4:00 P.M',
    date: '10 March 2025',
    status: 
      i % 3 === 0 ? 'Ongoing' : 
      i % 3 === 1 ? 'Pending' : 'Ended',
    type: i % 2 === 0 ? 'Final Examination' : 'Mid Examination'
  }))

  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null)
  const [isAddExamOpen, setIsAddExamOpen] = useState(false)
  const [filteredExams, setFilteredExams] = useState(exams); 
  const [selectedExamType, setSelectedExamType] = useState("all");

  const handleFilterChange = (value: string) => {
    setSelectedExamType(value);
  };  

  const applyFilters = () => {
    const filtered = exams.filter(exam => {
      if (selectedExamType === "all") return true;
      if (selectedExamType === "final") return exam.type === "Final Examination";
      if (selectedExamType === "mid") return exam.type === "Mid Examination";
      return true;
    });
    setFilteredExams(filtered);
  };


  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen)
  }

  const getStatusColors = (status: string) => {
    switch(status) {
      case 'Ongoing':
        return { 
          bg: 'bg-blue-100', 
          text: 'text-blue-500', 
          border: 'border-blue-300',
          dot: 'bg-blue-500'
        }
      case 'Pending':
        return { 
          bg: 'bg-yellow-100', 
          text: 'text-yellow-600',
          border: 'border-yellow-300',
          dot: 'bg-yellow-500'
        }
      case 'Ended':
        return { 
          bg: 'bg-gray-100', 
          text: 'text-gray-400',
          border: 'border-gray-300',
          dot: 'bg-gray-500'
        }
      default:
        return { 
          bg: 'bg-gray-100', 
          text: 'text-gray-800',
          border: 'border-gray-300',
          dot: 'bg-gray-500'
        }
    }
  }


  const getTypeColors = (type: string) => {
    switch(type) {
      case 'Final Examination':
        return { 
          bg: 'bg-[#EEC1FF]', 
          text: 'text-[#98299A]'
        }
      case 'Mid Examination':
        return { 
          bg: 'bg-teal-200', 
          text: 'text-teal-800'
        }
      default:
        return { 
          bg: 'bg-gray-100', 
          text: 'text-gray-800'
        }
    }
  }

  return (
    <div className="h-fit bg-gradient-to-br text- dark:text-white p-1 md:p-8">
        <div className="flex flex-col gap-2">
            <Breadcrumb className="text-gray-400" aria-label="Breadcrumb">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink
                    href="/admin/dashboard"
                    className="text-black/80 dark:text-gray-400"
                  >
                    Dashboard
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator>/</BreadcrumbSeparator>
                <BreadcrumbItem>
                  <BreadcrumbLink 
                    href="/admin/dashboard/exams" className="text-black/50 dark:text-gray-400">
                    Exam
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator>/</BreadcrumbSeparator>
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-black/50 dark:text-gray-400">
                    Manage Exam
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <h1 className="text-3xl font-bold text-black/90 dark:text-gray-100">
              Manage Exams
            </h1>
            <p className="text-black/80 dark:text-gray-400 text-sm">
              Manage your exams, view exam details, and create new exams.
            </p>
          </div>
          

    <div className="container mx-auto p-4 bg-white dark:bg-black  text-gray-200 rounded-2xl mt-5">
      <div className="flex flex-col space-y-4">
        {/* Search and Actions Bar */}
        <div className="flex items-center justify-between space-x-2 w-[500px] sm:w-full mt-5 bg-white dark:bg-black">
          <div className='flex items-start space-x-2'>
          <div className="relative flex-1">
            <Input
              type="text"
              placeholder="Search exam"
              className="pl-10 bg-white dark:bg-black text-gray-200 border-teal-600"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
          </div>
          
          <Button
            variant="outline"
            onClick={toggleFilter}
            className="bg-white dark:bg-black text-teal-600 hover:bg-teal-600 hover:text-white border-teal-600"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
            </svg>
            Filter
          </Button>
          </div>
          
          <Dialog open={isAddExamOpen} onOpenChange={setIsAddExamOpen}>
            <DialogTrigger asChild>
              <Button className="bg-teal-600 hover:bg-teal-500 text-white ">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                  <line x1="12" y1="5" x2="12" y2="19"/>
                  <line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
                Add New Exam
              </Button>
            </DialogTrigger>
            <DialogContent className='bg-white dark:bg-black text-black border-teal-600'>
              <DialogHeader>
                <DialogTitle className='dark:text-white text-black'>Add New Coursework</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4 bg-white dark:bg-black text-black">
                <div className="grid gap-2">
                  <Label htmlFor="title" className='dark:text-white text:black'>Exam Title</Label>
                  <Input id="title" placeholder="Enter exam title"className='border-teal-600' />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="date" className='dark:text-white text-black'>Date</Label>
                    <DatePicker />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="type" className='dark:text-white text-black'>Exam Status</Label>
                    <Select>
                      <SelectTrigger className='bg-white dark:bg-black dark:text-white text-black border-teal-600'>
                        <SelectValue placeholder="Select status" className='text-white'/>
                      </SelectTrigger>
                      <SelectContent className='bg-white dark:bg-black dark:text-white text-black  border-teal-600'>
                        <SelectItem value="ongoing"  >Ongoing</SelectItem>
                        <SelectItem value="pending" >Pending</SelectItem>
                        <SelectItem value="ended" >Ended</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 bg-white dark:bg-black dark:text-white text-black">
                  <div className="grid gap-2">
                    <Label htmlFor="startTime" className='dark:text-white text-black'>Start Time</Label>
                    <Input id="startTime" placeholder="e.g. 1:00 PM" className='border-teal-600' />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="endTime" className='dark:text-white text-black'>End Time</Label>
                    <Input id="endTime" placeholder="e.g. 4:00 PM" className='border-teal-600' />
                  </div>
                </div>
                <Button className="mt-4 bg-teal-600 hover:bg-teal-500 text-white">Save Exam</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>


        {/* Filter Section */}
        {isFilterOpen && (
          <div className="bg-white dark:bg-black dark:text-white text-black p-4 rounded-lg border border-teal-600 animate-in fade-in-50 slide-in-from-top-5 duration-300">
            <h3 className="font-medium mb-3">Filter Exams</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white dark:bg-black dark:text-white text-black ">
                <Label htmlFor="dateFilter">Date</Label>
                <div className='bg-white dark:bg-black dark:text-white text-black border-teal-600 mt-2'>
                  <DatePicker />
                </div>
              </div>
              <div>
                <Label htmlFor="typeFilter">Exam Type</Label>
                <Select onValueChange={handleFilterChange} value={selectedExamType}>
                    <SelectTrigger className='bg-white dark:bg-black dark:text-white text-black border-teal-600 mt-2'>
                        <SelectValue placeholder="All" className='bg-white dark:bg-black dark:text-white text-black' />
                    </SelectTrigger>
                    <SelectContent className='bg-white dark:bg-black dark:text-white text-black border-teal-600'>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="final">Final Examination</SelectItem>
                        <SelectItem value="mid">Mid Examination</SelectItem>
                    </SelectContent>
                </Select>

              </div>
              <div className="flex items-end">
              <Button onClick={applyFilters} className="bg-teal-600 hover:bg-teal-500 text-white">
                Apply Filters
                </Button>
              </div>
            </div>
          </div>
        )}

        
        {/* Exam Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 ">
          {filteredExams.map((exam) => { 
            const statusColors = getStatusColors(exam.status)
            const typeColors = getTypeColors(exam.type)
            return (
              <Dialog key={exam.id} open={selectedExam?.id === exam.id} onOpenChange={(open) => {
                if (!open) setSelectedExam(null);
              }}>
                <DialogTrigger asChild>
                  <Card 
                    className="p-4 cursor-pointer border bg-white dark:bg-black dark:text-white text-black border-teal-600 rounded-md hover:shadow-md transition-shadow"
                    onClick={() => setSelectedExam(exam)}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="h-10 w-10 bg-teal-100 rounded-full flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-teal-500">
                          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
                          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium dark:text-white text-black">{exam.title}</h3>
                        <div className="flex flex-col mt-2 text-sm dark:text-white text-black space-y-1">
                          <div className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                              <circle cx="12" cy="12" r="10"/>
                              <polyline points="12 6 12 12 16 14"/>
                            </svg>
                            {exam.startTime} - {exam.endTime}
                          </div>
                          <div className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                              <line x1="16" y1="2" x2="16" y2="6"/>
                              <line x1="8" y1="2" x2="8" y2="6"/>
                              <line x1="3" y1="10" x2="21" y2="10"/>
                            </svg>
                            {exam.date}
                          </div>
                        </div>
                        <div className="mt-3 flex items-center justify-between">
                          <span className={`px-2 py-1 text-xs rounded-full ${typeColors.bg} ${typeColors.text}`}>
                            {exam.type}
                          </span>
                          <div className="flex items-center">
                            <div className={`h-2 w-2 rounded-full mr-2 ${statusColors.dot}`} />
                            <span className={`text-xs font-medium ${statusColors.text}`}>
                              {exam.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </DialogTrigger>
                <DialogContent className='bg-white dark:bg-black dark:text-white text-black background-blur border-teal-600'>
                  <DialogHeader>
                    <DialogTitle>Exam Details</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-medium">{exam.title}</h3>
                      <div className="flex items-center mt-2">
                        <div className={`h-2 w-2 rounded-full mr-2 ${statusColors.dot}`} />
                        <span className={`text-sm font-medium ${statusColors.text}`}>
                          {exam.status}
                        </span>
                      </div>
                    </div>
                    <div className="border-teal-600 border-t pt-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm dark:text-white text-black">Date</p>
                          <p className="font-medium">{exam.date}</p>
                        </div>
                        <div>
                          <p className="text-sm dark:text-white text-black">Time</p>
                          <p className="font-medium">{exam.startTime} - {exam.endTime}</p>
                        </div>
                      </div>
                    </div>
                    <div className="border-teal-600 border-t pt-4">
                      <p className="text-sm dark:text-white text-blacke">Description</p>
                      <p className="mt-1 dark:text-white text-black">This exam covers principles of data warehousing, ETL processes, 
                      dimensional modeling, and business intelligence applications.</p>
                    </div>
                    <div className="flex justify-end space-x-2 pt-4 ">
                      <Button variant="outline" className='bg-white dark:bg-black dark:text-white text-black border-teal-600 hover:bg-teal-600 hover:text-white'>Edit</Button>
                      <Button 
                        variant="outline"
                        className="bg-white dark:bg-black dark:text-white text-black border-red-600 hover:bg-red-600 hover:text-white"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            )
          })}
        </div>
      </div>
    </div>
    </div>
  )
}