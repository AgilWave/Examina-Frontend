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
import axios from "axios";
import Cookies from "js-cookie";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { BACKEND_URL } from "@/Constants/backend";

import { setCreateDialog } from "@/redux/features/dialogState";
import { setCreateFacultyDefault } from "@/redux/features/FacultySlice";

function CreateFaculty() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const Faculty = useSelector((state: RootState) => state.faculty);

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const FacultyName = Faculty.createFaculty.name?.trim();

    if (!FacultyName) {
      toast.error(
        "Please provide a Faculty name."
      );
      setIsLoading(false);
      return;
    }

    const body = {
      name: FacultyName,
    };

    const token = Cookies.get("adminjwt");

    try {
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      const response = await axios.post(
        `${BACKEND_URL}/faculty/Interact`,
        body,
        { headers }
      );

      if (response.data.isSuccessful) {
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message || "Faculty creation failed.");
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error("Axios error:", error);
        toast.error(`Error: ${error.response?.data?.message || error.message}`);
      } else {
        console.error("Unexpected error:", error);
        toast.error("An unexpected error occurred while creating the Faculty.");
      }
    } finally {
      setIsLoading(false);
      dispatch(setCreateFacultyDefault());
      dispatch(setCreateDialog(false));
    }
  };

  const validateForm = () => {
    const { name } = Faculty.createFaculty;

    if (!name) {
      toast.error("Please fill all the required fields.");
      return false;
    }

    return true;
  };

  const handleCreateFaculty = () => {
    if (validateForm()) {
      setIsDialogOpen(true);
    }
  };

  return (
    <>
      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <Button variant="default" onClick={handleCreateFaculty}>
          Submit
        </Button>
        <AlertDialogContent className="sm:max-w-[425px]">
          <AlertDialogHeader>
            <AlertDialogTitle>Create Faculty</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to create this Faculty? This action cannot be
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

export default CreateFaculty;
