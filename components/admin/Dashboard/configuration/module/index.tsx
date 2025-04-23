"use client";
import React from "react";
import Header from "./Header";
import CreateUserDialog from "./create-module";
import {DataTable} from "./DataTable";

function Users() {
  return (
    <div className="h-fit p-1 md:p-8">
      <div className="max-w-8xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-center mb-4 md:mb-8 gap-4">
          <Header />
          <CreateUserDialog />
        </div>
      </div>
      <DataTable />
    </div>
  );
}

export default Users;
