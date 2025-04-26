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
import { Textarea } from "@/components/ui/textarea";
import { RootState } from "@/redux/store";
import { useSelector, useDispatch } from "react-redux";
import { BadgeX, BadgeCheck, AlertCircle } from "lucide-react";
import { setEditBlocked } from "@/redux/features/ModuleSlice";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { BACKEND_URL } from "@/Constants/backend";

function BlackListSwitch() {
  const module = useSelector((state: RootState) => state.module);
  const [isBlacklisted, setIsBlacklisted] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [nextBlacklistStatus, setNextBlacklistStatus] = useState(false);
  const [reason, setReason] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const dialog = useSelector((state: RootState) => state.dialog);
  const dispatch = useDispatch();

  useEffect(() => {
    if (module.viewModule?.setIsActive !== undefined) {
      setIsBlacklisted(module.viewModule.setIsActive);
    }
  }, [module]);

  const handleSwitchToggle = (checked: boolean) => {
    setNextBlacklistStatus(checked);
    setDialogOpen(true);
  };

  const handleConfirm = async () => {
    setIsLoading(true);
    const jwt = Cookies.get("adminjwt");
    const id = dialog.viewDialogId;

    try {
      const response = await axios.patch(
        `${BACKEND_URL}/module/Interact/Update/Status/${id}`,
        {
          isBlacklisted: nextBlacklistStatus,
          blacklistedReason: reason,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwt}`,
          },
        }
      );

      if (response.data.isSuccessful) {
        if (nextBlacklistStatus) {
          toast.success("Module blacklisted successfully.");
        } else {
          toast.success("Module activated successfully.");
        }
        dispatch(setEditBlocked(true));
        setIsBlacklisted(nextBlacklistStatus);
      } else {
        toast.error(response.data.message || "Update failed.");
      }
    } catch (error) {
      console.error("Error updating blacklist status:", error);
      toast.error("An error occurred while updating the blacklist status.");
    } finally {
      setIsLoading(false);
      setReason("");
      setDialogOpen(false);
    }
  };

  return (
    <div className="flex h-fit flex-col items-center gap-3 justify-between p-4 bg-white dark:bg-black/40 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
      <div className="flex flex-col items-center space-x-3">
        {isBlacklisted ? (
          <BadgeX className="text-red-500" size={20} />
        ) : (
          <BadgeCheck className="text-green-500" size={20} />
        )}
        <div className="text-center">
          <h4 className="font-medium text-slate-900 dark:text-slate-100">Module Status</h4>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {isBlacklisted ? "Module is blacklisted" : "Module is active"}
          </p>
        </div>
      </div>

      <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogTrigger asChild>
          <div className="flex items-center space-x-2 cursor-pointer">
            <Label
              htmlFor="blacklist"
              className={`text-sm font-medium ${
                isBlacklisted ? "text-red-500" : "text-slate-600 dark:text-slate-300"
              }`}
            >
              {isBlacklisted ? "Blacklisted" : "Active"}
            </Label>
            <Switch
              id="blacklist"
              checked={isBlacklisted}
              onCheckedChange={handleSwitchToggle}
              disabled={module.editBlocked}
              className={isBlacklisted ? "data-[state=checked]:bg-red-500" : ""}
            />
          </div>
        </AlertDialogTrigger>

        <AlertDialogContent className="sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center">
              <AlertCircle className="mr-2 h-5 w-5 text-amber-500" />
              Confirm {nextBlacklistStatus ? "Blacklist" : "Activation"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {nextBlacklistStatus
                ? "This action will blacklist the module. It will be deactivated."
                : "This action will remove the module from the blacklist and activate it."}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="my-4">
            <Label htmlFor="reason" className="text-sm font-medium mb-2 block">
              Reason for action:
            </Label>
            <Textarea
              id="reason"
              placeholder="Enter the reason..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full min-h-24"
            />
          </div>

          <AlertDialogFooter className="sm:justify-between flex-col sm:flex-row gap-2">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirm}
              disabled={isLoading}
              className="bg-red-500 text-white hover:bg-red-600 focus:ring-red-500"
            >
              {isLoading ? "Processing..." : "Confirm"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default BlackListSwitch;
