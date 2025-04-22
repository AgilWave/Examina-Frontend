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
import { setCreateBatchDefault } from "@/redux/features/BatchSlice";

function CreateBatch() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const batch = useSelector((state: RootState) => state.batch);

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const body = {
      batchCode: batch.createBatch.batchCode,
      courseId:  Number(batch.createBatch.courseId),
      year: Number(batch.createBatch.year),
    };

    const token = Cookies.get("adminjwt");

    try {
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      const response = await axios.post(
        `${BACKEND_URL}/batch/Interact`,
        body,
        { headers }
      );

      if (response.data.isSuccessful) {
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error creating batch:", error);
      toast.error("An error occurred while creating the batch.");
    } finally {
      setIsLoading(false);
      dispatch(setCreateBatchDefault());
      dispatch(setCreateDialog(false));
    }
  };

  const validateForm = () => {
    const { batchCode, courseId, year } = batch.createBatch;

    if (!batchCode || !courseId || !year) {
      toast.error("Please fill all the required fields.");
      return false;
    }

    return true;
  };

  const handleCreateBatch = () => {
    if (validateForm()) {
      setIsDialogOpen(true);
    }
  };

  return (
    <>
      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <Button variant="default" onClick={handleCreateBatch}>
          Submit
        </Button>
        <AlertDialogContent className="sm:max-w-[425px]">
          <AlertDialogHeader>
            <AlertDialogTitle>Create Batch</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to create this batch? This action cannot be
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

export default CreateBatch;
