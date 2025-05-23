"use client";
import React, { useState, useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { RootState } from "@/redux/store";
import { useSelector, useDispatch } from "react-redux";
import { BadgeX, BadgeCheck, AlertCircle } from "lucide-react";
import { setEditBlocked } from "@/redux/features/FacultySlice";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { BACKEND_URL } from "@/Constants/backend";

function ActiveSwitch() {
  const Faculty = useSelector((state: RootState) => state.faculty);
  const [isActive, setIsActive] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [nextStatus, setNextStatus] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dialog = useSelector((state: RootState) => state.dialog);
  const dispatch = useDispatch();

  useEffect(() => {
    if (Faculty.viewFaculty?.isActive !== undefined) {
      setIsActive(Faculty.viewFaculty.isActive);
    }
  }, [Faculty]);

  const handleSwitchToggle = (checked: boolean) => {
    setNextStatus(checked);
    setDialogOpen(true);
  };

  const handleConfirm = async () => {
    setIsLoading(true);
    const jwt = Cookies.get("adminjwt");
    const id = dialog.viewDialogId;

    try {
      const response = await axios.patch(
        `${BACKEND_URL}/Faculty/Interact/Update/${id}/Status`,
        { isActive: nextStatus },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwt}`,
          },
        }
      );

      if (response.data.isSuccessful) {
        toast.success(nextStatus ? "Faculty activated successfully." : "Faculty deactivated successfully.");
        dispatch(setEditBlocked(true));
        setIsActive(nextStatus);
      } else {
        toast.error(response.data.message || "Update failed.");
      }
    } catch (error) {
      console.error("Error updating Active status:", error);
      toast.error("An error occurred while updating the Active status.");
    } finally {
      setIsLoading(false);
      setDialogOpen(false);
    }
  };

  return (
    <div className="flex h-fit flex-col items-center gap-3 justify-between p-4 bg-white dark:bg-black/40 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
      <div className="flex flex-col items-center space-x-3">
        {isActive ? (
          <BadgeCheck className="text-green-500" size={20} />
        ) : (
          <BadgeX className="text-red-500" size={20} />
        )}
        <div className="text-center">
          <h4 className="font-medium text-slate-900 dark:text-slate-100">Faculty Status</h4>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {isActive ? "Faculty is currently active" : "Faculty is deactivated"}
          </p>
        </div>
      </div>

      <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogTrigger asChild>
          <div className="flex items-center space-x-2 cursor-pointer">
            <Label
              htmlFor="Active"
              className={`text-sm font-medium ${
                isActive ? "text-green-600 dark:text-green-300" : "text-red-500"
              }`}
            >
              {isActive ? "Active" : "Deactivated"}
            </Label>
            <Switch
              id="Active"
              checked={isActive}
              onCheckedChange={handleSwitchToggle}
              disabled={Faculty.editBlocked}
              className={!isActive ? "data-[state=checked]:bg-green-500" : ""}
            />
          </div>
        </AlertDialogTrigger>

        <AlertDialogContent className="sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center">
              <AlertCircle className="mr-2 h-5 w-5 text-amber-500" />
              Confirm {nextStatus ? "Activation" : "Deactivation"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {nextStatus
                ? "This action will activate the faculty."
                : "This action will deactivate the faculty."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="sm:justify-between flex-col sm:flex-row gap-2">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirm}
              disabled={isLoading}
              className={`${
                nextStatus ? "bg-green-600 hover:bg-green-700" : "bg-red-500 hover:bg-red-600"
              } text-white focus:ring-0`}
            >
              {isLoading ? "Processing..." : "Confirm"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default ActiveSwitch;
