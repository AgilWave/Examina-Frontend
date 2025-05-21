

import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label";
import { CircleDot } from "lucide-react"

export default function ExamDetailsForm() {
  return (
    <Card className="rounded-2xl  dark:border-black/20 shadow-md">
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="min-h-[56px] w-full">
            <Label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">Faculty Name</Label>
            <Select>
              <SelectTrigger className="h-12 w-full">
                <SelectValue placeholder="Select Faculty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="science">Science</SelectItem>
                <SelectItem value="engineering">Engineering</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="min-h-[56px] w-full">
            <Label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">Exam Name</Label>
            <Input className="h-9 w-full" placeholder="E.g. Software Engineering Midterm" />
          </div>

          <div className="min-h-[56px] w-full">
            <Label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">Course Name</Label>
            <Select>
              <SelectTrigger className="h-10 w-full">
                <SelectValue placeholder="Select Course" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cs101">CS101</SelectItem>
                <SelectItem value="se201">SE201</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="min-h-[56px] w-full">
            <Label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">Exam Code</Label>
            <Input className="h-9 w-full" placeholder="E.g. SE201-MID" />
          </div>

          <div className="min-h-[56px] w-full">
            <Label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">Batch</Label>
            <Select>
              <SelectTrigger className="h-12 w-full">
                <SelectValue placeholder="Select Batch" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2022">2022</SelectItem>
                <SelectItem value="2023">2023</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="min-h-[56px] w-full">
            <Label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">Lecturer / Examiner Name</Label>
            <Input className="h-9 w-full" placeholder="Enter examiner's name" />
          </div>

          <div className="min-h-[56px] w-full">
            <Label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">Module</Label>
            <Select>
              <SelectTrigger className="h-12 w-full">
                <SelectValue placeholder="Select Module" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="module1">Module 1</SelectItem>
                <SelectItem value="module2">Module 2</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="min-h-[56px] w-full">
            <Label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">Description</Label>
            <Textarea
              className="w-full max-h-15 overflow-y-auto scroll resize-none"
              placeholder="Short description of the exam"
              rows={2}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

