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
  setViewBatchDefault,
} from "@/redux/features/BatchSlice";

function UpdateBatch() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const dispatch = useDispatch();
  const batch = useSelector((state: RootState) => state.batch);
  const dialog = useSelector((state: RootState) => state.dialog);

  const { batchCode, courseId, year } = batch.viewBatch;
  const id = dialog.viewDialogId;

  const validateForm = (): boolean => {
    if (!batchCode || !courseId || !year) {
      toast.error("Please fill all the required fields.");
      return false;
    }
    return true;
  };

  const handleUpdateBatch = () => {
    // 🟢 Unlock fields before opening dialog
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
      batchCode: batchCode,
      courseId: Number(courseId),
      year : Number(year),
    };

    try {
      const response = await axios.patch(
        `${BACKEND_URL}/batch/Interact/Update/${id}`,
        body,
        { headers }
      );

      if (response.data.isSuccessful) {
        toast.success(response.data.message);

        // Reset and lock form again
        dispatch(setViewBatchDefault());
        dispatch(setEditBlocked(true));
        setIsDialogOpen(false);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error updating batch:", error);
      toast.error("An error occurred while updating the batch.");
    }
  };

  return (
    <>
      <Button variant="default" onClick={handleUpdateBatch} className="cursor-pointer">
        Update
      </Button>

      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent className="sm:max-w-[425px]">
          <AlertDialogHeader>
            <AlertDialogTitle>Update Batch</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to update this batch?
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

export default UpdateBatch;
