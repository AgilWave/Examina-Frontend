import React, { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import axios, { Axios, AxiosError } from "axios";
import Cookies from "js-cookie";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { BACKEND_URL } from "@/Constants/backend";

import { setCreateDialog } from "@/redux/features/dialogState";
import { setCreateCourseDefault } from "@/redux/features/CourseSlice";

function CreateCourse() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const course = useSelector((state: RootState) => state.course);

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsLoading(true);
  
    const courseName = course.createCourse.courseName?.trim();
    const moduleIds = course.createCourse.moduleIds || [];
  
    if (!courseName || !Array.isArray(moduleIds) || moduleIds.length === 0) {
      toast.error("Please provide a course name and select at least one module.");
      setIsLoading(false);
      return;
    }
  
    const body = {
      name: courseName,
      moduleIds: moduleIds.map((id: number) => id), 
    };
  
    const token = Cookies.get("adminjwt");
  
    try {
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };
  
      const response = await axios.post(
        `${BACKEND_URL}/course/Interact`,
        body,
        { headers }
      );
  
      if (response.data.isSuccessful) {
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message || "Course creation failed.");
      }
    } catch (error: AxiosError | any) {
      console.error("Error creating course:", error);
      if (error.response?.data?.message) {
        toast.error(`Error: ${error.response.data.message}`);
      } else {
        toast.error("An error occurred while creating the course.");
      }
    } finally {
      setIsLoading(false);
      dispatch(setCreateCourseDefault());
      dispatch(setCreateDialog(false));
    }
  };

  const validateForm = () => {
    const { courseName } = course.createCourse;

    if (!courseName) {
      toast.error("Please fill all the required fields.");
      return false;
    }

    return true;
  };

  const handleCreateCourse = () => {
    if (validateForm()) {
      setIsDialogOpen(true);
    }
  };

  return (
    <>
      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <Button variant="default" onClick={handleCreateCourse}>
          Submit
        </Button>
        <AlertDialogContent className="sm:max-w-[425px]">
          <AlertDialogHeader>
            <AlertDialogTitle>Create Course</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to create this course? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleSubmit}
              loading={isLoading}
              loadingText="Creating..."
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default CreateCourse;
