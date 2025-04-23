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
import { setCreateModuleDefault } from "@/redux/features/ModuleSlice";
import CreateBatch from "./dialogs/CreateModule";
import { useMediaQuery } from "@/hooks/use-media-query";

function CreateModuleDialog() {
  const dispatch = useDispatch();
  const dialog = useSelector((state: RootState) => state.dialog);
  const [open, setOpen] = useState(false);
  const isDesktopMediaQuery = useMediaQuery("(min-width: 768px)");

  useEffect(() => {
  if (isDesktopMediaQuery) {
    setOpen(dialog.createDialog);
  } else {
    setOpen(false);
  }
}, [dialog.createDialog, isDesktopMediaQuery]);

  const handleClear = () => {
    dispatch(setCreateModuleDefault());
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
      <Plus className="h-4 w-4" />
    </Button>
  );

  const sharedContent = (
    <>
      <Content />
      <div className="flex gap-2 justify-end border-t pt-4">
        <Button variant="outline" onClick={handleClear}>
          Clear
        </Button>
        <CreateBatch />
      </div>
    </>
  );

  if (isDesktopMediaQuery) {
    return (
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>{triggerButton}</DialogTrigger>
        <DialogContent className="rounded-lg ]">
          <DialogHeader>
            <DialogTitle>Add New Module</DialogTitle>
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
          <DrawerTitle>Add New Module</DrawerTitle>
        </DrawerHeader>
        <div className="px-4 h-0 flex-1 overflow-y-auto">
          <Content />
        </div>
        <DrawerFooter className="flex gap-2 flex-col-reverse mt-4">
          <Button variant="outline" onClick={handleClear}>
            Clear
          </Button>
          <CreateBatch />
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

export default CreateModuleDialog;
