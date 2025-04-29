"use client";

import React, { useState } from "react";
import Header from "./Header";
import CreationPage from "./other/creation";
import { Button } from "@/components/ui/button";


export function DataTable() {
  const [category, setCategory] = useState("");
  const [questionType, setQuestionType] = useState("");

  const resetSelectors = () => {
    setCategory("");
    setQuestionType("");
  };

  return (
    <div className="flex flex-col gap-4 w-full h-[85vh] p-1 md:p-8">
      <div className="flex flex-col md:flex-row justify-between items-center">
        <Header />
      </div>
      
      <CreationPage 
        category={category} 
        questionType={questionType} 
        onResetSelectors={resetSelectors} 
      />

      <div className="flex justify-end mt-4 gap-4">
        <Button 
          variant="outline"
          className="bg-white text-black dark:bg-slate-900 dark:text-white"
          onClick={resetSelectors}
        >
          Reset
        </Button>

        <Button
         variant="default"
          className=""
          onClick={() => {
            // Handle save action here
            console.log("Save button clicked");
          }}
        >
          Save Questions
        </Button>

      </div>
    </div>
  );
}

export default DataTable;
