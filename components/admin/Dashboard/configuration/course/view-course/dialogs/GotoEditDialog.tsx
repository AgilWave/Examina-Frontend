"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";

import { Pencil } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { setEditBlocked } from "@/redux/features/CourseSlice";
import { setEditCancel, setEditClose, setViewDialog } from "@/redux/features/dialogState";

export function GotoEditDialog({
  isDialogOpen,
  setIsDialogOpen,
}: {
  isDialogOpen: boolean;
  setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const dispatch = useDispatch();
  const dialog = useSelector((state: RootState) => state.dialog);
  const course = useSelector((state: RootState) => state.course);

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (course.editBlocked === true) {
      dispatch(setEditBlocked(false));
      setIsDialogOpen(false);
    } else {
      if (dialog.editCancel === true) {
        dispatch(setEditCancel(false));
        dispatch(setEditBlocked(true));
        setIsDialogOpen(false);
      } else if (dialog.editClose === true) {
        dispatch(setEditClose(false));
        dispatch(setViewDialog(true));
        dispatch(setEditBlocked(true));
        setIsDialogOpen(false);
      } else {
        dispatch(setEditBlocked(true));
        setIsDialogOpen(false);
      }
    }
  };

  const handleGotoEdit = () => {
    setIsDialogOpen(true);
  };

  useEffect(() => {
    if (dialog.editClose === false) {
      setIsDialogOpen(false);
    }else{
      setIsDialogOpen(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dialog.editClose]);

  return (
    <>
      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogTrigger asChild>
          <TooltipProvider delayDuration={200}>
            <Tooltip>
              <TooltipTrigger asChild>
              <div 
                onClick={handleGotoEdit}
                className={`${
                  course.editBlocked === false
                    ? "bg-primary hover:bg-primary"
                    : "bg-white dark:bg-black"
                } opacity-70 cursor-pointer ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground border-[1px] border-primary p-1 rounded-sm`}
              >
                <Pencil
                  className={`${
                    course.editBlocked === false
                      ? "text-white"
                      : "text-primary"
                  } h-4 w-4`}
                />
              </div>
              </TooltipTrigger>
              <TooltipContent
                className="font-poppins 2xl:text-[14px] text-[12px] font-[400] p-[2px] "
                side="bottom"
              >
                <p className="p-1">Edit Course</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </AlertDialogTrigger>
        <AlertDialogContent className="bg-white border border-primary  w-full flex justify-center flex-col items-center">
          <AlertDialogHeader className="w-full items-center ">
            <AlertDialogTitle className="font-poppins text-primary font-[600] text-[20px]">
              Are you sure?
            </AlertDialogTitle>
            <AlertDialogDescription className="font-poppins text-[14px] font-[500]">
              {`${
                course.editBlocked === true
                  ? "Are you sure you want to edit this course?"
                  : "Are you sure you want to cancel the edit?"
              }`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-3 font-poppins sm:w-[300px] w-full">
            <AlertDialogCancel className="sm:w-[150px] w-full">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="sm:w-[150px] w-full"
              onClick={handleSubmit}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
