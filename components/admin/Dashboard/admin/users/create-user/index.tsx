"use client";
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerFooter,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { setCreateDialog } from "@/redux/features/dialogState";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import Content from "./Content";
import { setCreateUserDefault } from "@/redux/features/UserSlice";
import CreateUser from "./dialogs/CreateUser";
import { useMediaQuery } from "@/hooks/use-media-query";

function CreateUserDialog() {
  const dispatch = useDispatch();
  const dialog = useSelector((state: RootState) => state.dialog);
  const [open, setOpen] = useState(false);
  const isDesktopMediaQuery = useMediaQuery("(min-width: 768px)");

  useEffect(() => {
    
    isDesktopMediaQuery ? setOpen(dialog.createDialog) : setOpen(false);
  }, [dialog.createDialog, isDesktopMediaQuery]);

  useEffect(() => {
    setOpen(dialog.createDialog);
  }, [dialog.createDialog]);

  const handleClear = () => {
    dispatch(setCreateUserDefault());
  };

  const handleOpenChange = (value: boolean) => {
    setOpen(value);
    dispatch(setCreateDialog(value));
  };

  const triggerButton = (
    <Button
      variant="outline"
      className="bg-primary dark:bg-primary flex items-center justify-center hover:bg-primary/80 dark:hover:bg-primary/80 text-primary-foreground cursor-pointer w-full md:w-auto px-4 py-2"
    >
      <Plus className="md:mr-2 h-4 w-4" /> Add User
    </Button>
  );

  const sharedContent = (
    <>
      <Content />
      <div className="flex gap-2 justify-end mt-4">
        <Button variant="outline" onClick={handleClear}>
          Clear
        </Button>
        <CreateUser />
      </div>
    </>
  );

  if (isDesktopMediaQuery) {
    return (
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>{triggerButton}</DialogTrigger>
        <DialogContent className="rounded-lg lg:w-[350%]">
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
          </DialogHeader>
          {sharedContent}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={handleOpenChange}>
      <DrawerTrigger asChild>{triggerButton}</DrawerTrigger>
      <DrawerContent className="px-2 pb-4 min-h-[80%] max-h-[90%] flex flex-col">
        <DrawerHeader>
          <DrawerTitle>Add New User</DrawerTitle>
        </DrawerHeader>
        <div className="px-4 h-0 flex-1 overflow-y-auto">
          <Content />
        </div>
        <DrawerFooter className="flex gap-2 flex-col-reverse mt-4">
          <Button variant="outline" onClick={handleClear}>
            Clear
          </Button>
          <CreateUser />
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

export default CreateUserDialog;
