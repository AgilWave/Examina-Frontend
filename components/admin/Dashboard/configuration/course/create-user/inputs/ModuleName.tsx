"use client";

import * as React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BookIcon, PlusCircle, Trash2, AlertCircle } from "lucide-react";
import api from "@/lib/axiosInstance";
import Cookies from "js-cookie";
import { RootState } from "@/redux/store";
import { setCreateCourseModules } from "@/redux/features/CourseSlice";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Module {
  id: number;
  name: string;
}

export function ModuleSelector() {
  const dispatch = useDispatch();
  const [selectedModuleId, setSelectedModuleId] = useState("");
  const [allModules, setAllModules] = useState<Module[]>([]);
  const course = useSelector((state: RootState) => state.course);
  const moduleIds = useSelector(
    (state: RootState) => state.course.createCourse.moduleIds
  );
  const [selectedModules, setSelectedModules] = useState<Module[]>([]);

  const getModules = async () => {
    const id = course.createCourse.facultyId
    try {
        const response = await api.get(`/module/Search?facultyId=${id}`
        , {
        headers: {
          Authorization: `Bearer ${Cookies.get("adminjwt")}`,
        },
      });
      if (response.data.isSuccessful) {
        setAllModules(response.data.listContent);
      } else {
        setAllModules([]);
      }
    } catch (error) {
      console.error("Error fetching modules:", error);
    }
  };

  useEffect(() => {
      getModules();
  }, [allModules.length,course.createCourse.facultyId]);

  useEffect(() => {
    // Update the selected modules list when moduleIds changes
    const modules = moduleIds.map(id => 
      allModules.find(module => module.id === id)
    ).filter((module): module is Module => module !== undefined);
    
    setSelectedModules(modules);
  }, [moduleIds, allModules]);

  const handleAddModule = () => {
    if (!selectedModuleId) return;
    
    const selectedId = parseInt(selectedModuleId, 10);
    
    // Check if module is already selected
    if (!moduleIds.includes(selectedId)) {
      // Add to Redux store
      dispatch(setCreateCourseModules([...moduleIds, selectedId]));
      // Reset selection
      setSelectedModuleId("");
    }
  };

  const handleDeleteModule = (moduleId: number) => {
    const updatedModuleIds = moduleIds.filter(id => id !== moduleId);
    dispatch(setCreateCourseModules(updatedModuleIds));
  };

  // Filter out already selected modules from the dropdown
  const availableModules = allModules.filter(
    module => !moduleIds.includes(module.id)
  );

  return (
    <div className="flex flex-col w-full grow gap-2 mb-4">
      <Label className="flex items-center text-sm font-medium text-slate-700 dark:text-slate-200">
        <BookIcon className="mr-2 h-4 w-4 text-slate-500" />
        Modules
        <span className="text-red-500 ml-1">*</span>
      </Label>

      <div className="flex space-x-2 mb-4">
        <div className="relative flex-grow">
          <Select
            value={selectedModuleId}
            onValueChange={setSelectedModuleId}
            disabled={availableModules.length === 0}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a Module" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Select a Module</SelectLabel>
                {availableModules.length > 0 ? (
                  availableModules.map((module) => (
                    <SelectItem
                      key={module.id}
                      value={module.id.toString()}
                    >
                      <div className="flex items-center">
                        <BookIcon className="h-4 w-4 text-green-500 mr-2" />
                        {module.name}
                      </div>
                    </SelectItem>
                  ))
                ) : (
                  <div className="px-2 py-2 text-sm text-slate-500 dark:text-slate-400">
                    No more modules available
                  </div>
                )}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <Button 
          onClick={handleAddModule}
          disabled={!selectedModuleId}
          variant="default"
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Add
        </Button>
      </div>

      <div className="bg-slate-50 dark:bg-card px-0 py-1">
          <h3 className="text-sm font-medium">Selected Modules</h3>
        </div>

      {/* Selected Modules Table Container */}
      <div className="border rounded-md">
        
        
        {/* Fixed height scrollable container */}
        <div className="h-64 overflow-y-auto">
          {selectedModules.length > 0 ? (
            <Table>
              <TableHeader className="sticky top-0 z-10">
                <TableRow>
                  <TableHead className="w-20">ID</TableHead>
                  <TableHead>Module Name</TableHead>
                  <TableHead className="text-right w-20">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedModules.map((module) => (
                  <TableRow key={module.id}>
                    <TableCell className="font-medium">{module.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <BookIcon className="h-4 w-4 text-green-500 mr-2" />
                        {module.name}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        onClick={() => handleDeleteModule(module.id)}
                        variant="ghost" 
                        size="sm"
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="flex flex-col items-center justify-center h-full p-6 text-center">
              <AlertCircle className="h-10 w-10 text-slate-400 mb-2" />
              <p className="text-slate-500 dark:text-slate-400">No modules selected</p>
              <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">
                Use the dropdown above to select modules
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}