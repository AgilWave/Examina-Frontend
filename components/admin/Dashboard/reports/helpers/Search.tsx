import { Input } from "@/components/ui/input";
import { useQueryState } from "nuqs";
import React, { useRef } from "react";

const SearchField = () => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [searchQuery, setSearchQuery] = useQueryState("searchQuery");

  const handleInputChange = (e: {
    target: { value: string | ((old: string | null) => string | null) | null };
  }) => {
    setSearchQuery(e.target.value);
  };

  return (
    <Input
      ref={inputRef}
      className="w-full dark:bg-[#0a0a0a2b] rounded-lg h-10 
      text-gray-700 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400
      focus:outline-none focus:ring-2
      focus:ring-teal-500 focus:border-transparent"
      placeholder="Search by name"
      value={searchQuery || ""}
      onChange={handleInputChange}
      onFocus={() => {
        inputRef.current?.focus();
      }}
      onBlur={() => {
        inputRef.current?.blur();
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          inputRef.current?.blur();
        }
      }}
    />
  );
};

export default SearchField;
