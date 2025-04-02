import React from "react";
import { FullName } from "../inputs/FullName";
import { Email } from "../inputs/Email";
import { UserName } from "../inputs/UserName";
import { Role } from "../inputs/selectors/Role";
import BlackListSwitch from "../inputs/switches/BlackListSwitch";
import ResetPasswordDialog from "../dialogs/ResetPassword";

function UserDetails() {
  return (
    <div className="w-full flex flex-col gap-6">
      <div className="w-full flex flex-col lg:flex-row gap-6 items-start">
        <div className="w-full lg:w-3/4 bg-white dark:bg-black/30 p-3 rounded-lg border border-slate-100 dark:border-slate-700 shadow-sm">
          <h3 className="text-lg font-medium mb-4 text-slate-800 dark:text-slate-100 border-b border-slate-100 dark:border-slate-700 pb-2">
            Personal Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FullName />
            <Email />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <UserName />
            <Role />
          </div>
        </div>

        <div className="flex flex-col w-full lg:w-1/4 gap-4">
          <div className=" bg-white dark:bg-black/30 p-5 rounded-lg border border-slate-100 dark:border-slate-700 shadow-sm">
            <h3 className="text-lg font-medium mb-4 text-slate-800 dark:text-slate-100 border-b border-slate-100 dark:border-slate-700 pb-2">
              Account Actions
            </h3>
            <div className="flex flex-col gap-4">
            <BlackListSwitch />
            <ResetPasswordDialog />
            </div>
           
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserDetails;
