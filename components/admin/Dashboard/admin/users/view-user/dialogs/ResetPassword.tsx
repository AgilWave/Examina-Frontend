import React from "react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import axios from "axios";
import Cookies from "js-cookie";
import { Key } from "lucide-react";
import { BACKEND_URL } from "@/Constants/backend";

function ResetPasswordDialog() {
  const dialog = useSelector((state: RootState) => state.dialog);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    setIsLoading(true);
    e.preventDefault();
    const id = dialog.viewDialogId;
    const token = Cookies.get("adminjwt");
    try {
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };
      const response = await axios.patch(
        `${BACKEND_URL}/users/Interact/ResetPassword/${id}`,
        {},
        { headers }
      );
      if (response.data.isSuccessful) {
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      toast.error("An error occurred while resetting the password.");
    } finally {
      setIsLoading(false);
      setIsDialogOpen(false);
    }
  };

  return (
    <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="outline" size="icon" className="w-full">
          <Key className="h-4 w-4" aria-hidden="true" />
          Reset Password
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="sm:max-w-[425px]">
        <AlertDialogHeader>
          <AlertDialogTitle>Reset Password</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to reset the password for this user? This
            action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button type="submit" form="resetPasswordForm" onClick={handleSubmit} loading={isLoading} disabled={isLoading} loadingText="Resetting..."> 
            Reset Password
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default ResetPasswordDialog;
