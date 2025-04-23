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
import { setCreateModuleDefault } from "@/redux/features/ModuleSlice";

function CreateModule() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const modules = useSelector((state: RootState) => state.module);

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const body = {
      moduleName : modules.createModule.moduleName,
      facultyName: modules.createModule.facultyName,
    };

    const token = Cookies.get("adminjwt");

    try {
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      const response = await axios.post(
        `${BACKEND_URL}/module/Interact`,
        body,
        { headers }
      );

      if (response.data.isSuccessful) {
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error creating module:", error);
      toast.error("An error occurred while creating the module.");
    } finally {
      setIsLoading(false);
      dispatch(setCreateModuleDefault());
      dispatch(setCreateDialog(false));
    }
  };

  const validateForm = () => {
    const { moduleName, facultyName} = modules.createModule;

    if (!moduleName || !facultyName) {
      toast.error("Please fill all the required fields.");
      return false;
    }

    return true;
  };

  const handleCreateModule = () => {
    if (validateForm()) {
      setIsDialogOpen(true);
    }
  };

  return (
    <>
      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <Button variant="default" onClick={handleCreateModule}>
          Submit
        </Button>
        <AlertDialogContent className="sm:max-w-[425px]">
          <AlertDialogHeader>
            <AlertDialogTitle>Create Batch</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to create this module? This action cannot be
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

export default CreateModule;
