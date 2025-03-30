"use client";

import React from 'react';
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
import { LogoutAction } from "@/services/actions/auth";
import { LogOut } from "lucide-react";

function SignOut() {
  const [open, setOpen] = React.useState(false);
  
  const handleLogout = async () => {
    try {
      await LogoutAction();
      
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
  
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger asChild>
          <button className="flex items-center gap-2 px-4 py-2 text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors">
            <LogOut size={18} />
            Sign Out
          </button>
        </AlertDialogTrigger>
        
        <AlertDialogContent className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-xl shadow-lg">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Are you sure you want to log out?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600 dark:text-gray-400">
              You&apos;ll need to log in again to access your account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <AlertDialogFooter className="flex gap-3 mt-4">
            <AlertDialogCancel className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Yes, log me out
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default SignOut;