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
import { useSelector } from "react-redux";
import { BadgeX, BadgeCheck, AlertCircle } from "lucide-react";
import { setEditBlocked } from "@/redux/features/BatchSlice";
import axios from "axios";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { BACKEND_URL } from "@/Constants/backend";  

function BlackListSwitch() {
  const batch = useSelector((state: RootState) => state.batch);
  const [isActive, setIsActive] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isBlacklistAction, setIsBlacklistAction] = useState(true);
  const dialog = useSelector((state: RootState) => state.dialog);
  const [reason, setReason] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (batch.viewBatch && batch.viewBatch.setIsActive !== undefined) {
      setIsActive(batch.viewBatch.setIsActive);
    }
  }, [batch]);

  const handleSwitchToggle = (checked: boolean) => {
    setIsBlacklistAction(checked);
    setDialogOpen(true);
  };

  const handleConfirm = async () => {
    // Set loading state
    setIsLoading(true);
    
    const jwt = Cookies.get("adminjwt");
    const id = dialog.viewDialogId;
    const body = {
      isBlacklisted: isBlacklistAction,
      blacklistedReason: reason,
    };

    try {
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      };
      
      const response = await axios.patch(
        `${BACKEND_URL}/batch/Interact/Update/Status/${id}`,
        body,
        { headers }
      );


      
      if (response.data.isSuccessful) {
        if (isBlacklistAction) {
          toast.success("Batch blacklisted successfully.");
        } else {
          toast.success("Batch activated successfully.");
        }
        dispatch(setEditBlocked(true));
        setIsActive(isBlacklistAction); 
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error updating blacklist status:", error);
      toast.error("An error occurred while updating the blacklist status.");
    } finally {
      // Always clean up and close dialog after the API call completes
      setIsLoading(false);
      setReason("");
      setDialogOpen(false);
    }
  };

  return (
    <>
      <div className="flex h-fit flex-col items-center gap-3 justify-between p-4 bg-white dark:bg-black/40 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
        <div className="flex items-center flex-col space-x-3">
          {isActive ? (
            <BadgeX className="text-red-500" size={20} />
          ) : (
            <BadgeCheck className="text-green-500" size={20} />
          )}
          <div>
            <h4 className="font-medium text-slate-900 dark:text-slate-100 text-center">
              Batch Status
            </h4>
            <p className="text-sm text-slate-500 dark:text-slate-400 text-center">
              {isActive
                ? "Batch is deactived"
                : "Batch is currently active"}
            </p>
          </div>
        </div>

        <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <AlertDialogTrigger asChild>
            <div className="flex items-center space-x-2 cursor-pointer">
              <Label
                htmlFor="blacklist"
                className={`text-sm font-medium ${
                  isActive
                    ? "text-red-500"
                    : "text-slate-600 dark:text-slate-300"
                }`}
              >
                {isActive ? "Blacklisted" : "Active"}
              </Label>
              <Switch
                id="blacklist"
                checked={isActive}
                onCheckedChange={handleSwitchToggle}
                className={
                  isActive ? "data-[state=checked]:bg-red-500" : ""
                }
                disabled={batch.editBlocked}
              />
            </div>
          </AlertDialogTrigger>
          <AlertDialogContent className="sm:max-w-md">
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center">
                <AlertCircle className="mr-2 h-5 w-5 text-amber-500" />
                Confirm {isBlacklistAction ? "Blacklist" : "Activation"}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {isBlacklistAction
                  ? "This action will blacklist the user. They will not be able to log in."
                  : "This action will remove the user from the blacklist. They will be able to log in again."}
              </AlertDialogDescription>
            </AlertDialogHeader>

            <div className="my-4">
              <Label
                htmlFor="reason"
                className="text-sm font-medium mb-2 block"
              >
                Please provide a reason:
              </Label>
              <Textarea
                id="reason"
                placeholder="Enter the reason for this action..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full min-h-24"
              />
            </div>

            <AlertDialogFooter className="sm:justify-between flex-col sm:flex-row gap-2">
              <AlertDialogCancel className="sm:mt-0">Cancel</AlertDialogCancel>
              <AlertDialogAction
                disabled={isLoading}
                loading={isLoading}
                loadingText="Processing..."
                className="bg-red-500 text-white hover:bg-red-600 focus:ring-red-500"
                onClick={handleConfirm}
              >
                Confirm
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </>
  );
}

export default BlackListSwitch;