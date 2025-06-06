'use client';

import React from "react";
import BreadCrumb from "./BreadCrumb";
import { useSearchParams } from "next/navigation";
function Header() {
  const searchParams = useSearchParams();
  const moduleName = searchParams.get("module");
  return (
    <div className="flex flex-col gap-2 items-center md:items-start">
      <div className="flex w-full items-center justify-center md:justify-start">
        <BreadCrumb />
      </div>
      <h1 className="text-3xl font-bold text-foreground">Create Questions for {moduleName}</h1>
      <p className="text-muted-foreground">You can create all questions for this module.</p>
    </div>
  );
}

export default Header;
