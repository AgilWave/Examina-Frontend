import React from "react";
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

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { toast } from "sonner";
import axios from "axios";
import Cookies from "js-cookie";
import {setEditBlocked, setviewStudentDefault } from "@/redux/features/StudentSlice";
import { BACKEND_URL } from "@/Constants/backend";

function UpdateStudent() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const dispatch = useDispatch();
  const student = useSelector((state: RootState) => state.student);
  const dialog = useSelector((state: RootState) => state.dialog);

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const body = {
      batch: student.viewStudent.student.batch.id,
    };
    const id = dialog.viewDialogId;
    const token = Cookies.get("adminjwt");
    try {
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };
      const response = await axios.patch(
        `${BACKEND_URL}/users/Interact/Update/${id}`,
        body,
        { headers }
      );
      if (response.data.isSuccessful) {
        toast.success(response.data.message);
        dispatch(setviewStudentDefault());
        dispatch(setEditBlocked(true));
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error creating student:", error);
      toast.error("An error occurred while creating the student.");
    }
  };

  const validateForm = () => {
    if (!student.viewStudent.student.batch.id) {
      toast.error("Please select a batch.");
      return false;
    }
    return true;
  };

  const handleUpdateUser = () => {
    if (validateForm()) {
      setIsDialogOpen(true);
    }
  };

  return (
    <>
      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <Button variant="default" onClick={handleUpdateUser} className="cursor-pointer">
          Update
        </Button>
        <AlertDialogContent className="sm:max-w-[425px]">
          <AlertDialogHeader>
            <AlertDialogTitle>Update Student</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to Update this student? 
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleSubmit}>
              Contiune
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default UpdateStudent;
