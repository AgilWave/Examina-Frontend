"use client";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { setCreateDialog } from "@/redux/features/dialogState";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import Content from "./Content";
import { setCreateUserDefault } from "@/redux/features/UserSlice";
import CreateFuelType from "./dialogs/CreateUser";

function CreateUserDialog() {
  const dispatch = useDispatch();
  const dialog = useSelector((state: RootState) => state.dialog);
  
  const handleClear = () => {
    dispatch(setCreateUserDefault());
  };
  return (
    <Dialog
      open={dialog.createDialog}
      onOpenChange={(val) => dispatch(setCreateDialog(val))}
    >
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="bg-primary dark:bg-primary flex items-center justify-center hover:bg-primary/80 dark:hover:bg-primary/80 text-primary-foreground cursor-pointer w-full md:w-auto px-4 py-2"
        >
          <Plus className="md:mr-2 h-4 w-4" /> Add User
        </Button>
      </DialogTrigger>
      <DialogContent className="rounded-lg lg:w-[350%]">
        <DialogHeader>
          <DialogTitle>Add New User</DialogTitle>
        </DialogHeader>
        <Content />
        <DialogFooter>
          <Button variant="outline" onClick={handleClear}>
            Clear
          </Button>
          <CreateFuelType />
          </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default CreateUserDialog;
