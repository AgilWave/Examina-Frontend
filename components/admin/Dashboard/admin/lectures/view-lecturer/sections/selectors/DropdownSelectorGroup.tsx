"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { Layers, Calendar, BookOpen } from "lucide-react";

type Props = {
  onAdd: (record: { faculty: string; batch: string; module: string }) => void;
};

export function DropdownSelectorGroup({ onAdd }: Props) {
  const [faculty, setFaculty] = useState("");
  const [batch, setBatch] = useState("");
  const [module, setModule] = useState("");

  const handleAdd = () => {
    if (faculty && batch && module) {
      onAdd({ faculty, batch, module });
      // Optionally reset after adding
      setFaculty("");
      setBatch("");
      setModule("");
    } else {
      alert("Please select all fields before adding.");
    }
  };

  return (
    <div className="w-full flex flex-col gap-4 md:flex-row md:items-end md:justify-between p-4">
      <div className="flex flex-col md:flex-row md:items-center gap-4 w-full">
        <CustomSelect
          label="Faculty"
          icon={<Layers className="h-4 w-4 text-blue-500 mr-2" />}
          items={["Computing", "Business", "Engineering"]}
          value={faculty}
          onChange={setFaculty}
        />
        <CustomSelect
          label="Batch"
          icon={<Calendar className="h-4 w-4 text-amber-500 mr-2" />}
          items={["2023", "2024", "2025"]}
          value={batch}
          onChange={setBatch}
        />
        <CustomSelect
          label="Module"
          icon={<BookOpen className="h-4 w-4 text-green-500 mr-2" />}
          items={["Maths", "Programming", "AI"]}
          value={module}
          onChange={setModule}
        />
      </div>
      <div className="mt-2 md:mt-0">
        <Button onClick={handleAdd}>Add</Button>
      </div>
    </div>
  );
}

type CustomSelectProps = {
  label: string;
  icon: React.ReactNode;
  items: string[];
  value: string;
  onChange: (value: string) => void;
};

function CustomSelect({
  label,
  icon,
  items,
  value,
  onChange,
}: CustomSelectProps) {
  return (
    <div className="flex flex-col grow gap-2 w-full md:w-auto">
      <Label className="flex items-center text-sm font-medium text-slate-700 dark:text-slate-200">
        {icon}
        {label}
        <span className="text-red-500 ml-1">*</span>
      </Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger
          className={`
            w-full md:min-w-[150px] pl-3 pr-10 py-2
            border border-slate-200 rounded-md shadow-sm
            focus:border-blue-500 focus:ring-2 focus:ring-blue-100
            transition-all duration-200
            bg-white text-slate-900
            dark:bg-slate-800 dark:text-slate-100 dark:border-slate-700
          `}
        >
          <SelectValue placeholder={`Select ${label}`} />
        </SelectTrigger>
        <SelectContent className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md shadow-md">
          <SelectGroup>
            <SelectLabel className="px-2 py-1.5 text-sm text-slate-500 dark:text-slate-400">
              {`Select ${label}`}
            </SelectLabel>
            {items.map((item) => (
              <SelectItem
                key={item}
                value={item}
                className="flex items-center py-2 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                {item}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
