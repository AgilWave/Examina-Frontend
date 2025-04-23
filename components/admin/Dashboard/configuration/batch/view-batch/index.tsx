/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
} from "@/components/ui/drawer";
import { setEditClose, setViewDialog } from "@/redux/features/dialogState";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import Content from "./Content";
import { setEditBlocked } from "@/redux/features/BatchSlice";
import { ConfirmDeleteDialog } from "./dialogs/ConfirmDeleteDialog";
import { GotoEditDialog } from "./dialogs/GotoEditDialog";
import { getBatchByID } from "@/services/Batch/getBatchByID";
import CreateUser from "./dialogs/UpdateBatch";
import { Button } from "@/components/ui/button";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Loader2 } from "lucide-react";

function ViewUserDialog() {
  const dispatch = useDispatch();
  const dialog = useSelector((state: RootState) => state.dialog);
  const batch = useSelector((state: RootState) => state.batch);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const isDesktopMediaQuery = useMediaQuery("(min-width: 768px)");

  const fetchUser = async () => {
    if (dialog.viewDialogId !== undefined) {
      try {
        setIsLoading(true);
        await getBatchByID(dispatch, dialog.viewDialogId);
      } catch (err: any) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchUser();
  }, [dialog.viewDialogId, dialog.viewDialog]);

  useEffect(() => {
    if (batch.editBlocked) {
      fetchUser();
    }
  }, [batch.editBlocked]);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    isDesktopMediaQuery ? setOpen(dialog.viewDialog) : setOpen(false);
  }, [dialog.viewDialog, isDesktopMediaQuery]);

  useEffect(() => {
    setOpen(dialog.viewDialog);
  }, [dialog.viewDialog]);

  const handleBackgroundClick = (e: any) => {
    if (!batch.editBlocked) {
      e.preventDefault();
    }
  };

  const handleClose = (val: boolean) => {
    if (!batch.editBlocked) {
      dispatch(setEditClose(true));
      setIsDialogOpen(true);
    } else {
      dispatch(setEditBlocked(true));
      dispatch(setViewDialog(val));
      dispatch(setViewDialog(false));
    }
  };

  const handleOpenChange = (value: boolean) => {
    setOpen(value);
    if (value === false) {
      handleClose(value);
    }
  };

  const headerContent = (
    <div className="flex items-center justify-between w-full">
      <div className="w-full md:w-auto">Batch Details #{batch.viewBatch?.id}</div>
      <div className="flex items-center gap-2 sm:gap-3 pr-5 sm:pr-0 sm:w-auto">
        <ConfirmDeleteDialog />
        <GotoEditDialog isDialogOpen={isDialogOpen} setIsDialogOpen={setIsDialogOpen} />
      </div>
    </div>
  );

  const loadingContent = (
    <div className="flex flex-col items-center justify-center w-full h-40">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );

  // Changed the content area's height to be consistent regardless of editBlocked status
  const mainContent = (
    <div className={`overflow-y-auto ${batch.editBlocked ? 'max-h-[60vh]' : 'max-h-[60vh]'} md:max-h-[calc(100vh-250px)] scrollbar-custom flex-1`}>
      {isLoading ? loadingContent : <Content />}
    </div>
  );

  const footerContent = !batch.editBlocked && (
    <>
      <Button
        variant="outline"
        className="w-full sm:w-auto cursor-pointer"
        onClick={() => {
          dispatch(setEditBlocked(true));
          setIsDialogOpen(false);
          dispatch(setViewDialog(false));
        }}
      >
        Cancel
      </Button>
      <CreateUser />
    </>
  );

  if (isDesktopMediaQuery) {
    return (
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent
          className="rounded-lg w-[95vw] max-w-[95vw] sm:w-[90vw] md:min-w-[700px] lg:min-w-[900px] xl:min-w-[1000px] flex flex-col"
          onInteractOutside={handleBackgroundClick}
          onCloseAutoFocus={() => handleClose(false)}
        >
          <DialogHeader>
            <DialogTitle className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 sm:pr-8">
              {headerContent}
            </DialogTitle>
          </DialogHeader>

          <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
            {mainContent}
          </div>

          {footerContent && (
            <DialogFooter className="flex flex-col sm:flex-row justify-end gap-2 mt-4">
              {footerContent}
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={handleOpenChange}>
      <DrawerContent className="px-2 pb-4 min-h-[80%] max-h-[90%] flex flex-col">
        <DrawerHeader>
          <DrawerTitle className="flex flex-col items-start justify-between gap-2">
            {headerContent}
          </DrawerTitle>
        </DrawerHeader>

        <div className="px-4 h-0 flex-1 overflow-y-auto">
          {mainContent}
        </div>

        {footerContent && (
          <DrawerFooter className="flex flex-col-reverse gap-2 mt-4">
            {footerContent}
          </DrawerFooter>
        )}
      </DrawerContent>
    </Drawer>
  );
}

export default ViewUserDialog;