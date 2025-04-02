"use client";

import { useState } from "react";
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { toast } from "sonner";
import axios from "axios";
import Cookies from "js-cookie";
import { Input } from "@/components/ui/input";
import { Trash } from "lucide-react";
import { setViewDialog } from "@/redux/features/dialogState";

export function ConfirmDeleteDialog() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [userId, setUserId] = useState("");
  const [loaderOpen, setLoaderOpen] = useState(false);
  const dispatch = useDispatch();
  const dialog = useSelector((state: RootState) => state.dialog);
  const users = useSelector((state: RootState) => state.user);

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    setLoaderOpen(true);
    e.preventDefault();
    if (userId !== users.viewUser?.id.toString()) {
      toast.error("Ids does not match");
      return;
    }
    const jwt = Cookies.get("adminjwt");
    const id = dialog.viewDialogId;
    try {
      const headers = {
        Accept: "text/plain",
        Authorization: `Bearer ${jwt}`,
      };
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/Interact/${id}`,
        { headers }
      );
      if (response.data.isSuccessful) {
        toast.success("User Deleted Successfully");
      } else {
        toast.error(response.data.message);
      }
    } catch (err: unknown) {
      console.error(
        err instanceof Error ? err.message : "Unknown error occurred"
      );
    } finally {
      setLoaderOpen(false);
      setIsDialogOpen(false);
      dispatch(setViewDialog(false));
    }
  };

  const handleDeleteUser = () => {
    setIsDialogOpen(true);
  };

  return (
    <>
      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogTrigger asChild>
          <TooltipProvider delayDuration={200}>
            <Tooltip>
              <TooltipTrigger asChild>
                <div
                  onClick={handleDeleteUser}
                  className={`opacity-70 cursor-pointer ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground border-[1px] border-red-500 p-1 rounded-sm ${
                    users.editBlocked ? "" : "hidden"
                  }`}
                >
                  <Trash className="text-red-500 h-4 w-4" />
                </div>
              </TooltipTrigger>
              <TooltipContent
                className="font-poppins 2xl:text-[14px] text-[12px] font-[400] p-[2px] "
                side="bottom"
              >
                <p className="p-1">Delete User</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </AlertDialogTrigger>
        <AlertDialogContent className="bg-white border border-primary  w-full flex justify-center flex-col items-center">
          <AlertDialogHeader className="w-full items-center ">
            <AlertDialogTitle className=" text-primary font-[600] text-[20px]">
              Are you sure?
            </AlertDialogTitle>
            <AlertDialogDescription className=" text-[14px] font-[500]">
              <div className="flex flex-col justify-center items-center w-full  py-4">
                <p className="w-full text-center mb-3 2xl:text-[14px] text-[12px]">
                  Please enter the Id of the User to confirm the action
                </p>
                <div className="flex w-full items-center justify-center">
                  <Input
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                  />
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-3  sm:w-[300px] w-full">
            <AlertDialogCancel className="sm:w-[150px] w-full">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="sm:w-[150px] w-full cursor-pointer"
              onClick={handleSubmit}
              loading={loaderOpen}
              loadingText="Deleting..."
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
