 import { useState } from "react";
import {
  MousePointer,
  ListChecks,
  TextCursorInput,
  UserRound,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Eye, Pencil, Trash2 } from "lucide-react";

interface Question {
  id: number;
  text: string;
  type: "input" | "selector" | "multi-selector";
  createdBy: string;
}

const Qcard = ({ data }: { data: any }) => {
  const [questions] = useState<Question[]>([
    {
      id: 1,
      text: "Formula for calculating percentage change in price?",
      type: "input",
      createdBy: "Shehal H.",
    },
    {
      id: 2,
      text: "Revenue: $10,000; expenses: $7,500. What is profit?",
      type: "selector",
      createdBy: "Shehal H.",
    },
    {
      id: 3,
      text: "Inflation rate: 3%; original price: $100. New price after one year?",
      type: "input",
      createdBy: "Shehal H.",
    },
    {
      id: 4,
      text: "Demand function: Q = 100 - 2P. Equilibrium price and quantity?",
      type: "multi-selector",
      createdBy: "Shehal H.",
    },
    {
      id: 5,
      text: "Car purchased for $20,000, depreciates by 10% annually. Value after 5 years?",
      type: "selector",
      createdBy: "Shehal H.",
    },
    {
      id: 6,
      text: "Price elasticity: -2; price increase: 10%. Percentage change in quantity demanded?",
      type: "input",
      createdBy: "Shehal H.",
    },
    {
      id: 7,
      text: "Nominal interest rate: 6%; inflation rate: 2%. Real interest rate?",
      type: "input",
      createdBy: "Shehal H.",
    },
    {
      id: 8,
      text: "Nominal interest rate: 6%; inflation rate: 2%. Real interest rate?",
      type: "input",
      createdBy: "Shehal H.",
    },
    {
      id: 9,
      text: "Nominal interest rate: 6%; inflation rate: 2%. Real interest rate?",
      type: "input",
      createdBy: "Shehal H.",
    },
    {
      id: 10 ,
      text: "Nominal interest rate: 6%; inflation rate: 2%. Real interest rate?",
      type: "input",
      createdBy: "Shehal H.",
    },
  ]);

  const renderTypeIcon = (type: Question["type"]) => {
    switch (type) {
      case "input":
        return <TextCursorInput className="h-5 w-4 text-teal-500" />;
      case "selector":
        return <MousePointer className="h-5 w-4 text-emerald-500" />;
      case "multi-selector":
        return <ListChecks className="h-4 w-4 text-emerald-500" />;
      default:
        return null;
    }
  };

  const truncateText = (text: string, maxLength = 80) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "...";
  };

  return (
    <div className="flex flex-col rounded-2xl transition-colors duration-200 h-full">
      {/* Scrollable card section */}
      <div className="h-[431px] overflow-y-auto rounded-2xl p-2 bg-white dark:bg-[#000000a9] border-gray-200 dark:border-black border shadow-sm w-full scrollbar-custom">
        <div className="space-y-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {questions.map((question) => (
            <Card
              key={question.id}
              className="transition-all hover:shadow-md bg-[#fdfdfd] dark:bg-[#0A0A0A] border border-gray-200 dark:border-teal-900 rounded-xl shadow-sm cursor-pointer p-3 flex flex-col justify-start h-full"
            >
              {/* Top Line */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="bg-teal-100 dark:bg-teal-900 text-teal-700 dark:text-teal-300 text-xs font-medium rounded-full px-3 py-1.5 flex items-center space-x-1">
                    {renderTypeIcon(question.type)}
                    <span className="capitalize">
                      {question.type.replace("-", " ")}
                    </span>
                  </div>
                  <div className="bg-gray-100 dark:bg-gray-900 border border-teal-800 flex items-center gap-3 text-gray-700 dark:text-gray-300 text-xs font-medium rounded-full px-2 py-1.5">
                    <UserRound className="h-4 w-4 text-gray-500" />
                    {question.createdBy}
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 15 15"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                      >
                        <path
                          d="M3.625 7.5C3.625 8.12132 3.12132 8.625 2.5 8.625C1.87868 8.625 1.375 8.12132 1.375 7.5C1.375 6.87868 1.87868 6.375 2.5 6.375C3.12132 6.375 3.625 6.87868 3.625 7.5ZM8.625 7.5C8.625 8.12132 8.12132 8.625 7.5 8.625C6.87868 8.625 6.375 8.12132 6.375 7.5C6.375 6.87868 6.87868 6.375 7.5 6.375C8.12132 6.375 8.625 6.87868 8.625 7.5ZM13.625 7.5C13.625 8.12132 13.1213 8.625 12.5 8.625C11.8787 8.625 11.375 8.12132 11.375 7.5C11.375 6.87868 11.8787 6.375 12.5 6.375C13.1213 6.375 13.625 6.87868 13.625 7.5Z"
                          fill="currentColor"
                          fillRule="evenodd"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end" className="w-40">
                    <DropdownMenuItem
                      onClick={() =>
                        console.log(`Viewing question ${question.id}`)
                      }
                      className="flex items-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        console.log(`Editing question ${question.id}`)
                      }
                      className="flex items-center gap-2"
                    >
                      <Pencil className="w-4 h-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        console.log(`Deleting question ${question.id}`)
                      }
                      className="flex items-center gap-2 text-red-500 hover:bg-red-700 dark:hover:bg-red-900/50"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                      <div className="text-red-500">Delete</div>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Main Content */}
              <div className="flex items-start">
                <div>
                  <p className="text-gray-800 dark:text-gray-200 text-m font-regular leading-relaxed">
                    {truncateText(question.text)}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
export default Qcard;