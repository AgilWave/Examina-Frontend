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
import { BACKEND_URL } from "@/Constants/backend";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { toast } from "sonner";
import axios from "axios";
import Cookies from "js-cookie";
import { setCreateDialog } from "@/redux/features/dialogState";
import { setCreateUserDefault } from "@/redux/features/UserSlice";

function CreateUser() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    setIsLoading(true);
    e.preventDefault();
    const body = {
      name: user.createUser.name,
      email: user.createUser.email,
      username: user.createUser.username,
      role: user.createUser.role,
    };
    const token = Cookies.get("adminjwt");
    try {
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };
      const response = await axios.post(
        `${BACKEND_URL}/users/Interact`,
        body,
        { headers }
      );
      if (response.data.isSuccessful) {
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error creating user:", error);
      toast.error("An error occurred while creating the user.");
    } finally {
      setIsLoading(false);
      dispatch(setCreateUserDefault());
      dispatch(setCreateDialog(false));
    }
  };

  const validateForm = () => {
    if (
      !user.createUser.name ||
      !user.createUser.email ||
      !user.createUser.username
    ) {
      toast.error("Please fill all the required fields.");
      return false;
    }
    if (!user.createUser.role) {
      toast.error("Please select a role.");
      return false;
    }
    return true;
  };

  const handleCreateUser = () => {
    if (validateForm()) {
      setIsDialogOpen(true);
    }
  };

  return (
    <>
      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <Button variant="default" onClick={handleCreateUser}>
          Submit
        </Button>
        <AlertDialogContent className="sm:max-w-[425px]">
          <AlertDialogHeader>
            <AlertDialogTitle>Create User</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to create this user? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleSubmit} loading={isLoading} loadingText="Creating...">
              Contiune
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default CreateUser;
