'use client';

import React from "react";
import BreadCrumb from "./BreadCrumb";

function Header() {
  return (
    <div className="flex flex-col gap-2 items-center md:items-start">
      <div className="flex w-full items-center justify-center md:justify-start">
        <BreadCrumb />
      </div>
      <h1 className="text-3xl font-bold text-foreground">Exam Report Management</h1>
      <p className="text-muted-foreground">Manage all exam reports.</p>
    </div>
  );
}

export default Header;
