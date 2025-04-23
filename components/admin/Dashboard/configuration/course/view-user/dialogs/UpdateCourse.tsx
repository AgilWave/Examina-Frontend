"use client";

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
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { toast } from "sonner";
import axios from "axios";
import Cookies from "js-cookie";
import { BACKEND_URL } from "@/Constants/backend";
import {
  setEditBlocked,
  setViewCourseDefault,
} from "@/redux/features/CourseSlice";

function UpdateCourse() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const dispatch = useDispatch();
  const course = useSelector((state: RootState) => state.course);
  const dialog = useSelector((state: RootState) => state.dialog);

  const { courseName } = course.viewCourse;
  const id = dialog.viewDialogId;

  const validateForm = (): boolean => {
    if (!courseName) {
      toast.error("Please fill all the required fields.");
      return false;
    }
    return true;
  };

  const handleUpdateCourse = () => {
    dispatch(setEditBlocked(false));
    if (validateForm()) {
      setIsDialogOpen(true);
    }
  };

  const handleSubmit = async () => {
    const token = Cookies.get("adminjwt");
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    const body = {
      courseName: courseName,

    };

    try {
      const response = await axios.patch(
        `${BACKEND_URL}/course/Interact/Update/${id}`,
        body,
        { headers }
      );

      if (response.data.isSuccessful) {
        toast.success(response.data.message);

        // Reset and lock form again
        dispatch(setViewCourseDefault());
        dispatch(setEditBlocked(true));
        setIsDialogOpen(false);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error updating course:", error);
      toast.error("An error occurred while updating the course.");
    }
  };

  return (
    <>
      <Button variant="default" onClick={handleUpdateCourse} className="cursor-pointer">
        Update
      </Button>

      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent className="sm:max-w-[425px]">
          <AlertDialogHeader>
            <AlertDialogTitle>Update Course</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to update this course?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleSubmit}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default UpdateCourse;
