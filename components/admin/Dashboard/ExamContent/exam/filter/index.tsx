import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

import { parseAsBoolean, useQueryState } from "nuqs";
import { Lecture } from "./selectors/Lecture";
import { QuestionType } from "./selectors/QuestionType";

const Filters = () => {
  const [isFilterOpen, setIsFilterOpen] = useQueryState(
    "filterOpen",
    parseAsBoolean
  );
  const [filterApplied, setFilterApplied] = useQueryState(
    "filterApplied",
    parseAsBoolean
  );
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [LectureQuery, setLectureQuery] = useQueryState("Lecture");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [questionType, setQuestionType] = useQueryState("questionType");

  const handleReset = () => {
    setFilterApplied(false);
    setLectureQuery("");
    setQuestionType("");
  };

  return (
    <div className="flex w-full flex-col space-y-4">
      <Accordion
        className="w-full "
        type="single"
        collapsible
        value={isFilterOpen ? "item-1" : "item-0"}
        onValueChange={(value) => setIsFilterOpen(value === "item-1")}
      >
        <AccordionItem className=" border-white" value="item-1">
          <AccordionContent className="w-full flex gap-5 p-3 flex-col">
            <h1 className="w-full font-poppins 2xl:text-[14px] font-[600] text-[12px]">
              Filters
            </h1>
            <div className="flex gap-2 justify-evenly w-full md:flex-row flex-col items-center">
              <div className="flex w-full  justify-start gap-8">
                <Lecture />
                <QuestionType />
              </div>
              {/* <div className="flex w-full justify-start"></div> */}
            </div>

            <div className="flex w-full py-4 items-center justify-end gap-4">
              <Button variant={"outline"} onClick={handleReset}>
                Reset
              </Button>
              <Button
                className={`${
                  filterApplied ? "bg-secondary/50 hover:bg-secondary/90" : ""
                }`}
                onClick={() => {
                  setFilterApplied(true);
                }}
                disabled={!!filterApplied}
              >
                Apply
              </Button>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default Filters;
