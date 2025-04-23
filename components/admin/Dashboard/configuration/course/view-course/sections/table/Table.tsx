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
import { BookIcon, PlusCircle, Trash2, AlertCircle, Lock, Info } from "lucide-react";
import api from "@/lib/axiosInstance";
import Cookies from "js-cookie";
import { RootState } from "@/redux/store";
import { setViewCourseModuleIds, setViewCourseModules } from "@/redux/features/CourseSlice";
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
  const [isLoading, setIsLoading] = useState(true);
  const course = useSelector((state: RootState) => state.course);
  const moduleIds = useSelector(
    (state: RootState) => state.course.viewCourse.moduleIds 
  );
  const exisitngModules = useSelector(
    (state: RootState) => state.course.viewCourse.modules
  );
  const [selectedModules, setSelectedModules] = useState<Module[]>([]);
  const editBlocked = useSelector(
    (state: RootState) => state.course.editBlocked
  );

  const getModules = async () => {
    setIsLoading(true);
    const id = course.viewCourse.facultyId || -1;
    try {
      const response = await api.get(`/module/Search?facultyId=${id}`, {
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
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    dispatch(setViewCourseModuleIds([]));
    getModules();
  }, [course.viewCourse.facultyId, dispatch]);

  useEffect(() => {
    const matchedModules = (moduleIds || [])
      .map((id) => allModules?.find((m) => m.id === id))
      .filter((m): m is Module => !!m);

    setSelectedModules(matchedModules);
  }, [moduleIds, allModules]);

  const handleAddModule = () => {
    if (!selectedModuleId) return;

    const selectedId = parseInt(selectedModuleId, 10);

    const isModuleAlreadySelected = moduleIds.includes(selectedId);
    const isModuleExisting = exisitngModules.some(m => m.id === selectedId);

    if (isModuleAlreadySelected || isModuleExisting) {
      setSelectedModuleId(""); 
      return;
    }

    const isModuleAvailable = availableModules.some(m => m.id === selectedId);
    if (isModuleAvailable) {
      const updatedModuleIds = [...moduleIds, selectedId];
      dispatch(setViewCourseModuleIds(updatedModuleIds));
      setSelectedModuleId("");
    }
  };

  const handleDeleteModule = (moduleId: number, isExisting: boolean) => {
    if (isExisting) {
      const updatedExistingModules = exisitngModules.filter(m => m.id !== moduleId);
      dispatch(setViewCourseModules(updatedExistingModules));
    } else {
      const updatedModuleIds = moduleIds.filter((id) => id !== moduleId);
      dispatch(setViewCourseModuleIds(updatedModuleIds));
    }
  };

  const availableModules = allModules.filter(
    (module) => !moduleIds.includes(module.id) && !exisitngModules.some((m) => m.id === module.id)
  );

  const allDisplayModules = [...selectedModules, ...exisitngModules];

  return (
    <div className="flex flex-col w-full grow gap-2 mb-4 font-poppins">
      <Label className="flex items-center text-sm font-medium text-slate-700 dark:text-slate-200">
        <BookIcon className="mr-2 h-4 w-4 text-slate-500" />
        Modules
        <span className="text-red-500 ml-1">*</span>
      </Label>

      <div className="flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0 mb-4">
        <div className="relative flex-grow">
          <Select
            key={`module-select-${availableModules.length}`}
            value={selectedModuleId}
            onValueChange={setSelectedModuleId}
            disabled={editBlocked || availableModules.length === 0 || isLoading}
          >
            <SelectTrigger 
              className={`
                w-full pl-3 pr-10 py-2
                border rounded-md shadow-sm
                transition-all duration-200
                ${editBlocked ? 'text-slate-500 border-slate-200 opacity-70' : 'bg-white text-slate-900 border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-blue-100'}
                dark:border-slate-700 dark:text-slate-100
              `}
            >
              <SelectValue placeholder="Select a Module" />
            </SelectTrigger>

            <SelectContent className="border border-slate-200 dark:border-slate-700 rounded-md shadow-md">
              <SelectGroup>
                <SelectLabel className="px-2 py-1.5 text-sm text-slate-500 dark:text-slate-400">
                  Select a Module
                </SelectLabel>
                {isLoading ? (
                  <div className="px-2 py-4 text-sm text-slate-500 dark:text-slate-400 flex items-center justify-center">
                    <div className="h-4 w-4 border-2 border-t-transparent border-slate-400 rounded-full animate-spin mr-2"></div>
                    Loading modules...
                  </div>
                ) : availableModules.length > 0 ? (
                  availableModules.map((module) => (
                    <SelectItem key={module.id} value={module.id.toString()} className="flex items-center py-2 cursor-pointer hover:bg-accent">
                      <div className="flex items-center">
                        <BookIcon className="h-4 w-4 text-emerald-500 mr-2" />
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

          {isLoading && (
            <div className="absolute right-10 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <div className="h-4 w-4 border-2 border-t-transparent border-slate-400 rounded-full animate-spin"></div>
            </div>
          )}
          
          {editBlocked && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <Lock className="h-4 w-4 text-slate-400" />
            </div>
          )}
        </div>
        <Button
          onClick={handleAddModule}
          disabled={!selectedModuleId || editBlocked || isLoading}
          variant="default"
          className={`${
            editBlocked ? 'opacity-70 cursor-not-allowed' : ''
          } bg-teal-600 hover:bg-teal-700 text-white`}
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Module
        </Button>
      </div>

      {editBlocked && (
        <p className="text-xs text-slate-500 -mt-2 mb-2 flex items-center">
          <Lock className="h-3 w-3 mr-1" />
          Module selection is currently locked for editing
        </p>
      )}

      <div className="border border-slate-200 dark:border-slate-700 rounded-md relative shadow-sm">
        {editBlocked && (
          <div className="absolute inset-0 bg-slate-200/30 dark:bg-slate-800/30 z-20 rounded-md backdrop-blur-[1px]" />
        )}
        
        <div className="h-[220px] overflow-y-auto">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-full p-6 text-center">
              <div className="h-8 w-8 border-3 border-t-transparent border-slate-400 rounded-full animate-spin mb-2"></div>
              <p className="text-slate-500 dark:text-slate-400">
                Loading modules...
              </p>
            </div>
          ) : allDisplayModules.length > 0 ? (
            <Table>
              <TableHeader className="sticky top-0 z-10 bg-white dark:bg-slate-800">
                <TableRow>
                  <TableHead className="w-20">ID</TableHead>
                  <TableHead>Module Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right w-20">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allDisplayModules.map((module) => {
                  const isExisting = exisitngModules.some(m => m.id === module.id);
                  return (
                    <TableRow key={module.id} className={editBlocked ? 'opacity-80' : ''}>
                      <TableCell className="font-medium">{module.id}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <BookIcon className="h-4 w-4 text-emerald-500 mr-2" />
                          {module.name}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          isExisting ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                        }`}>
                          {isExisting ? 'Existing' : 'Selected'}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          onClick={() => handleDeleteModule(module.id, isExisting)}
                          variant="ghost"
                          size="sm"
                          className={`text-red-600 hover:text-red-800 hover:bg-red-50 dark:hover:bg-red-900/10 ${editBlocked ? 'opacity-50 cursor-not-allowed' : ''}`}
                          disabled={editBlocked}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete module</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          ) : (
            <div className="flex flex-col items-center justify-center h-full p-6 text-center">
              <AlertCircle className="h-10 w-10 text-slate-400 mb-2" />
              <p className="text-slate-500 dark:text-slate-400">
                No modules available
              </p>
              <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">
                {course.viewCourse.facultyId ? "Use the dropdown above to select modules" : "Select a Faculty first to see available modules"}
              </p>
            </div>
          )}
        </div>
      </div>
      
      {allDisplayModules.length > 0 && (
        <div className="flex items-center mt-2 text-xs text-slate-500">
          <Info className="h-3 w-3 mr-1" />
          {allDisplayModules.length} module{allDisplayModules.length !== 1 ? 's' : ''} selected for this course
        </div>
      )}
      
      {editBlocked && allDisplayModules.length > 0 && (
        <p className="text-xs text-slate-500 mt-1 flex items-center">
          <Lock className="h-3 w-3 mr-1" />
          Module modifications are currently disabled
        </p>
      )}
    </div>
  );
}