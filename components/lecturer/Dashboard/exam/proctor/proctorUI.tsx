"use client";

import {
  VideoIcon,
  MicOffIcon,
  MicIcon,
  EyeIcon,
  EyeOffIcon,
  UsersIcon,
  MoreHorizontalIcon,
  ArrowLeftIcon,
  Circle,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@radix-ui/react-avatar";
import { cn } from "@/lib/utils";

// Generate more distinctive student IDs to make scrolling more obvious
const students = Array.from({ length: 56 }, (_, i) => ({
  id: i + 1,
  name: `KUDSE24.1F - ${String(i + 1).padStart(3, "0")}`,
  micOn: Math.random() > 0.5,
  camOn: Math.random() > 0.5,
  present: Math.random() > 0.15, // Some students might be absent
}));

export default function LectureProctoring() {
  const attendeeCount = students.filter((s) => s.present).length;
  const absentCount = 60 - attendeeCount; // Sample total count

  return (
    // Main container with background
    <div className="h-screen w-full bg-white dark:bg-card text-white p-4 rounded-2xl">
      <div className="flex h-full w-full rounded-xl overflow-hidden shadow-2xl">
        {/* Left Side: Video + Header + Footer */}
        <div className="w-3/4 h-full flex flex-col bg-black">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-zinc-800 bg-zinc-950">
            <div className="flex items-center gap-4 text-lg font-semibold">
              <ArrowLeftIcon className="w-5 h-5 cursor-pointer" />
              <div>
                <div>Data Management</div>
                <div className="text-xs text-zinc-400">24 March 2025</div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm bg-zinc-800 px-2 py-1 rounded">
                1:36:26
              </div>
              <div className="text-sm bg-green-700 px-2 py-1 rounded-full">
                Attendee {attendeeCount}
              </div>
              <div className="text-sm bg-red-700 px-2 py-1 rounded-full">
                Absent {absentCount}
              </div>
            </div>
          </div>

          {/* Video Grid */}
          <ScrollArea className="flex-1 ">
            <div className="p-4 grid grid-cols-4 gap-4 ">
              {students.slice(0, 15).map((student) => (
                <Card
                  key={student.id}
                  className="bg-white dark:bg-black text-black dark:text-white relative aspect-video flex items-center justify-center shadow-md hover:shadow-lg transition-all"
                >
                  <CardContent className="flex flex-col items-center justify-center h-full ">
                    <div className="text-sm mb-2">{student.name}</div>
                    <div className="flex gap-2">
                      {student.camOn ? (
                        <EyeIcon className="text-green-500 w-4 h-4" />
                      ) : (
                        <EyeOffIcon className="text-red-500 w-4 h-4" />
                      )}
                      {student.micOn ? (
                        <MicIcon className="text-green-500 w-4 h-4" />
                      ) : (
                        <MicOffIcon className="text-red-500 w-4 h-4" />
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
              {/* Overflow Box */}
              <Card className="bg-zinc-800 text-white aspect-video flex items-center justify-center text-xl font-bold shadow-md">
                +42
              </Card>
            </div>
          </ScrollArea>

          {/* Footer Controls */}
          <div className="p-4 flex justify-center gap-6 border-t border-zinc-800 bg-zinc-950">
            <MicOffIcon className="w-6 h-6 cursor-pointer hover:text-red-500 transition-colors" />
            <UsersIcon className="w-6 h-6 cursor-pointer hover:text-teal-400 transition-colors" />
            <MoreHorizontalIcon className="w-6 h-6 cursor-pointer hover:text-gray-300 transition-colors" />
          </div>
        </div>

        {/* Right Side: Participant List */}
        <div className="w-1/4 h-full bg-zinc-950">
          <div className="w-full h-full p-4 flex flex-col">
            <div className="mb-2 text-xl font-bold">Exam Participants</div>
            <Input
              className="mb-4 bg-zinc-800 text-white placeholder:text-zinc-400 border-zinc-700"
              placeholder="Search by course name"
            />{" "}
            <div className="flex-1 bg-zinc-900 rounded-md shadow-inner overflow-hidden">
              {" "}
              <ScrollArea className="h-full max-h-[calc(100vh-200px)]">
                {/* Add a subtle fadeout effect at the bottom to indicate scrollability */}
                <div className="relative p-3 pb-6">
                  <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-zinc-900 to-transparent pointer-events-none z-10"></div>
                  {/* Instructor */}
                  <div className="flex items-center justify-between text-sm text-zinc-400 p-2 mb-3 border-b border-zinc-800 pb-2">
                    <span>Instructor (you)</span>
                    <div className="flex gap-2">
                      <MicIcon className="w-4 h-4" />
                      <VideoIcon className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Lecturer */}
                  {/* <div className="text-sm font-medium text-zinc-300 p-2 mb-2">
                    Lecturer
                  </div> */}
                  <div className="flex items-center justify-between text-sm text-zinc-400 p-2 mb-3 pb-2">
                    <span>Lecturer</span>
                    <div className="flex gap-2">
                      <MicIcon className="w-4 h-4" />
                      <VideoIcon className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Students Section Header */}
                  <div className="text-sm font-medium text-zinc-300 p-2 border-t border-zinc-800 mt-2 pt-3 mb-2">
                    Students ({students.length}){" "}
                  </div>

                  {/* Students List */}
                  <div className="space-y-1 pr-2">
                    {students.map((student) => (
                      <div
                        key={student.id}
                        className={`flex items-center justify-between py-1.5 px-2 rounded-md mb-1 ${
                          student.present
                            ? "bg-zinc-800 hover:bg-zinc-700"
                            : "bg-zinc-800/50 text-zinc-400"
                        } transition-colors`}
                      >
                        <div className="flex items-center gap-2">
                          <div className="relative">
                            <Avatar className="w-6 h-6">
                              <AvatarFallback className="bg-teal-600 text-white text-xs">
                                {student.name.slice(-2)}
                              </AvatarFallback>
                            </Avatar>
                            {/* Status Dot */}
                            <Circle
                              className={cn(
                                "absolute -bottom-1 -right-1 w-2 h-2 rounded-full",
                                student.micOn && student.camOn
                                  ? "bg-green-500"
                                  : student.micOn || student.camOn
                                  ? "bg-yellow-400"
                                  : "bg-red-500"
                              )}
                            />
                          </div>
                          <span>{student.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {student.micOn ? (
                            <MicIcon className="w-4 h-4 text-green-500" />
                          ) : (
                            <MicOffIcon className="w-4 h-4 text-red-500" />
                          )}
                          {student.camOn ? (
                            <EyeIcon className="w-4 h-4 text-green-500" />
                          ) : (
                            <EyeOffIcon className="w-4 h-4 text-red-500" />
                          )}{" "}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </ScrollArea>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
