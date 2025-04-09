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
import {setEditBlocked, setviewUserDefault } from "@/redux/features/UserSlice";

function UpdateUser() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user);
  const dialog = useSelector((state: RootState) => state.dialog);

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const body = {
      name: user.viewUser.name,
      email: user.viewUser.email,
      role: user.viewUser.role,
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
        dispatch(setviewUserDefault());
        dispatch(setEditBlocked(true));
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error creating user:", error);
      toast.error("An error occurred while creating the user.");
    }
  };

  const validateForm = () => {
    if (
      !user.viewUser.name ||
      !user.viewUser.email ||
      !user.viewUser.username
    ) {
      toast.error("Please fill all the required fields.");
      return false;
    }
    if (!user.viewUser.role) {
      toast.error("Please select a role.");
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
            <AlertDialogTitle>Create User</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to Update this user? 
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

export default UpdateUser;
