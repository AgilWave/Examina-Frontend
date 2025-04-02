import React from "react";
import { FullName } from "../inputs/FullName";
import { Email } from "../inputs/Email";
import { UserName } from "../inputs/UserName";
import { Role } from "../inputs/selectors/Role";

function Userdetails() {
  return (
    <div className="w-full px-3 py-6 flex flex-col h-fit justify-between items-center">
      <div className="flex w-full flex-col gap-5">
        <div className="w-full flex flex-col  md:flex-row gap-[30px]">
          <FullName />
          <Email />
        </div>
        <div className="w-full flex flex-col  md:flex-row gap-[30px]">
          <UserName />
          <Role />
        </div>
      </div>
    </div>
  );
}

export default Userdetails;
