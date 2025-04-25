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
  setViewFacultyDefault,
} from "@/redux/features/FacultySlice";

function UpdateFaculty() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const dispatch = useDispatch();
  const Faculty = useSelector((state: RootState) => state.faculty);
  const dialog = useSelector((state: RootState) => state.dialog);

  const { name } = Faculty.viewFaculty;
  const id = dialog.viewDialogId;

  const validateForm = (): boolean => {
    if (!name) {
      toast.error("Please fill all the required fields.");
      return false;
    }
    return true;
  };

  const handleUpdateFaculty = () => {
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
      name: name,

    };

    try {
      const response = await axios.patch(
        `${BACKEND_URL}/Faculty/Interact/Update/${id}`,
        body,
        { headers }
      );

      if (response.data.isSuccessful) {
        toast.success(response.data.message);

        dispatch(setViewFacultyDefault());
        dispatch(setEditBlocked(true));
        setIsDialogOpen(false);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error updating Faculty:", error);
      toast.error("An error occurred while updating the Faculty.");
    }
  };

  return (
    <>
      <Button variant="default" onClick={handleUpdateFaculty} className="cursor-pointer">
        Update
      </Button>

      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent className="sm:max-w-[425px]">
          <AlertDialogHeader>
            <AlertDialogTitle>Update Faculty</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to update this Faculty?
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

export default UpdateFaculty;
