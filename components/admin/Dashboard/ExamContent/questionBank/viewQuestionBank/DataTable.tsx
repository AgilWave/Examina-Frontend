/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";

import { columns } from "./helpers/columns";
import { RootState } from "@/redux/store";

import { setViewDialog, setViewDialogId } from "@/redux/features/dialogState";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { LogoutAction } from "@/services/actions/auth";
import { RefreshCcw } from "lucide-react";
import { useQueryState } from "nuqs";
import SearchField from "./helpers/Search";
import Qcard from "./Cards";
import { useSearchParams } from "next/navigation";
import { getAllQuestionsByModuleId } from "@/services/questionBank/getAllQuestionsByModuleId";
import { setQuestionPage, setQuestionTotalPages, setQuestionNextPage, setQuestionPrevPage } from "@/redux/features/pageSlice";

export function DataTable() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState({});
  const page = useSelector((state: RootState) => state.page);
  const [data, setData] = useState([]);
  const [pageSize, setPageSize] = useState(25);
  const dialog = useSelector((state: RootState) => state.dialog);
  const dispatch = useDispatch();
  const [searchQuery] = useQueryState("searchQuery");
  const moduleId = useSearchParams().get("id");
  const [isLoading, setIsLoading] = useState(false);


  const fetchData = async (page: number) => {
    setIsLoading(true);
    try {
      const response = await getAllQuestionsByModuleId(
        dispatch,
        page,
        pageSize,
        moduleId,
        searchQuery,
      );
      if (response.isSuccessful) {
        if (response.listContent.length === 0) {
          setData([]);
          toast.error(response.message);
          return;
        }
        setData(response.listContent);
        dispatch(setQuestionPage(response.paginationInfo.page));
        dispatch(setQuestionTotalPages(response.paginationInfo.totalPages));
        dispatch(setQuestionNextPage(response.paginationInfo.nextPage));
        dispatch(setQuestionPrevPage(response.paginationInfo.page - 1));
      } else {
        setData([]);
        toast.error(response.message);
        dispatch(setQuestionPage(1));
        dispatch(setQuestionTotalPages(0));
        dispatch(setQuestionNextPage(-1));
        dispatch(setQuestionPrevPage(-1));
      }
    } catch (error: any) {
      if (error.response) {
        if (error.response.status === 401) {
          toast.error("Unauthorized access. Please login again.");
          LogoutAction();
        } else {
          toast.error(error.response.data.message);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const page = JSON.parse(sessionStorage.getItem("QuestionBankPage") || "1");
    if (!dialog.createDialog) {
      fetchData(page);
    } else if (dialog.viewDialog) {
      fetchData(page);
    }
  }, [dialog]);

  useEffect(() => {
    dispatch(
      setQuestionPage(
        JSON.parse(sessionStorage.getItem("QuestionPage") || "1")
      )
    );
    dispatch(
      setQuestionTotalPages(
        JSON.parse(sessionStorage.getItem("QuestionTotalPages") || "0")
      )
    );
    dispatch(
      setQuestionNextPage(
        JSON.parse(sessionStorage.getItem("QuestionNextPage") || "-1")
      )
    );
    dispatch(
      setQuestionPrevPage(
        JSON.parse(sessionStorage.getItem("QuestionPrevPage") || "-1")
      )
    );
    dispatch(
      setViewDialog(JSON.parse(sessionStorage.getItem("viewDialog") || "false"))
    );
    dispatch(
      setViewDialogId(JSON.parse(sessionStorage.getItem("viewDialogId") || "0"))
    );
    const page = JSON.parse(sessionStorage.getItem("QuestionPage") || "1");
    fetchData(page);
  }, []);

  useEffect(() => {
    const page = JSON.parse(sessionStorage.getItem("QuestionPage") || "1");
    fetchData(page);
  }, [pageSize]);

  useEffect(() => {
    const page = JSON.parse(sessionStorage.getItem("QuestionPage") || "1");
    fetchData(page);
  }, [searchQuery]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
      columnVisibility,
      columnFilters,
      rowSelection,
      pagination: {
        pageIndex: 0,
        pageSize: pageSize,
      },
    },
  });

  const handleNext = async () => {
    if (page.question.nextPage > page.question.page) {
      const curPage = page.question.nextPage;
      fetchData(curPage);
    }
  };

  const handlePrev = async () => {
    if (page.question.prevPage >= 0) {
      const curPage = page.question.prevPage;
      fetchData(curPage);
    }
  };

  const handleDeleteQuestion = () => {
    fetchData(page.question.page);
  };
  return (
    <>
      <div className="flex flex-col gap-4 w-full">
        <div className="flex flex-col gap-4 bg-card rounded-xl p-4 shadow-sm border">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center w-full md:w-3/4">
              <SearchField />
            </div>
            <div className="relative flex gap-2 ">
              <div className="flex relative md:w-auto w-full  gap-4 py-2 flex-row justify-between items-center">
                <Button
                  className="p-[10px] h-[36px] items-center border-[1px]  rounded-lg flex"
                  variant={"outline"}
                  onClick={() => fetchData(1)}
                >
                  <RefreshCcw className="2xl:h-[20px] h-[15px] text-primary/65" />
                </Button>
                <div className="flex flex-row gap-4 items-center">
                  <div className="w-[120px]">
                    <Select
                      value={pageSize.toString()}
                      onValueChange={(val) => setPageSize(Number(val))}
                    >
                      <SelectTrigger className="w-full  border-[1px]  rounded-lg text-[#00000099]">
                        <SelectValue placeholder="Page Size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Page Size</SelectLabel>
                          <SelectItem value="5">5</SelectItem>
                          <SelectItem value="10">10</SelectItem>
                          <SelectItem value="25">25</SelectItem>
                          <SelectItem value="50">50</SelectItem>
                          <SelectItem value="100">100</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center w-full h-40">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            <div className="rounded-2xl border shadow-sm overflow-hidden w-full">
              <Qcard questions={data} onDelete={handleDeleteQuestion} />
            </div>
            <div className="flex items-center justify-center gap-4 mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrev}
                disabled={page.question.prevPage <= 0}
              >
                Previous
              </Button>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                Page {page.question.page} of {page.question.totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleNext}
                disabled={
                  page.question.nextPage === -1 || page.question.nextPage === null
                }
              >
                Next
              </Button>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default DataTable;
