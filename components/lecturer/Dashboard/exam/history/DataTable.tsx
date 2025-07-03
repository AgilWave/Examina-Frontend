/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ChevronDown } from "lucide-react";
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

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";

import { columns } from "./helpers/columns";
import { RootState } from "@/redux/store";

import {
  setExamHistoryNextPage,
  setExamHistoryPage,
  setExamHistoryPrevPage,
  setExamHistoryTotalPages,
} from "@/redux/features/pageSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { getInactiveExams } from "@/services/history/getInactiveExams";
import { LogoutAction } from "@/services/actions/auth";
import { RefreshCcw } from "lucide-react";
import Filters from "./filter";
import { parseAsBoolean, useQueryState } from "nuqs";
import SearchField from "./helpers/Search";
import { useRouter } from "next/navigation";

export function DataTable() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState({});
  const page = useSelector((state: RootState) => state.page);
  const [data, setData] = useState([]);
  const [pageSize, setPageSize] = useState(25);
  const dispatch = useDispatch();
  const router = useRouter();
  const [searchQuery] = useQueryState("searchQuery");
  const [isLoading, setIsLoading] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isFilterOpen, setIsFilterOpen] = useQueryState(
    "filterOpen",
    parseAsBoolean
  );
  const [filterApplied] = useQueryState("filterApplied", parseAsBoolean);


  const fetchData = async (page: number) => {
    setIsLoading(true);
    try {
      const response = await getInactiveExams(
        dispatch,
        page,
        pageSize,
        searchQuery,
      );
      if (response.isSuccessful) {
        if (response.listContent.length === 0) {
          setData([]);
          toast.error(response.message);
          return;
        }
        setData(response.listContent);
      } else {
        setData([]);
        toast.error(response.message);
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
    const page = JSON.parse(sessionStorage.getItem("examHistoryPage") || "1");
    fetchData(page);
  }, [filterApplied]);

  useEffect(() => {
    dispatch(
      setExamHistoryPage(JSON.parse(sessionStorage.getItem("examHistoryPage") || "1"))
    );
    dispatch(
      setExamHistoryTotalPages(
        JSON.parse(sessionStorage.getItem("totalExamHistoryPages") || "0")
      )
    );
    dispatch(
      setExamHistoryNextPage(
        JSON.parse(sessionStorage.getItem("nextExamHistoryPage") || "-1")
      )
    );
    dispatch(
      setExamHistoryPrevPage(
        JSON.parse(sessionStorage.getItem("prevExamHistoryPage") || "-1")
      )
    );
    const page = JSON.parse(sessionStorage.getItem("examHistoryPage") || "1");
    fetchData(page);
  }, []);

  useEffect(() => {
    const page = JSON.parse(sessionStorage.getItem("examHistoryPage") || "1");
    fetchData(page);
  }, [pageSize]);

  useEffect(() => {
    const page = JSON.parse(sessionStorage.getItem("examHistoryPage") || "1");
    fetchData(page);
  }, [searchQuery]);

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
    if (page.examHistory.nextPage > page.examHistory.page) {
      const curPage = page.examHistory.nextPage;
      fetchData(curPage);
    }
  };

  const handlePrev = async () => {
    if (page.examHistory.prevPage >= 0) {
      const curPage = page.examHistory.prevPage;
      fetchData(curPage);
    }
  };

  const rows = table.getRowModel().rows;

  return (
    <>
      <div className="flex flex-col gap-4 w-full">
        <div className="flex flex-col gap-4 bg-card rounded-xl p-4 shadow-sm border">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center w-full md:w-1/2">
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
                  <DropdownMenu modal={false}>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-[140px] rounded-lg"
                      >
                        Columns{" "}
                        <ChevronDown className="ml-2 h-4 w-4 text-primary/65" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="font-poppins" align="end">
                      {table
                        .getAllColumns()
                        .filter((column) => column.getCanHide())
                        .map((column) => {
                          return (
                            <DropdownMenuCheckboxItem
                              key={column.id}
                              className="capitalize font-poppins"
                              checked={column.getIsVisible()}
                              onCheckedChange={(value) =>
                                column.toggleVisibility(!!value)
                              }
                            >
                              {column.id}
                            </DropdownMenuCheckboxItem>
                          );
                        })}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex w-full justify-end">
          <Filters />
        </div>
        <div className="rounded-lg dark:border-teal-600/50 border shadow-sm overflow-hidden">
          <Table isLoading={isLoading} loadingColumns={columns.length} loadingRows={10}>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder ? null : (
                          <div
                            className={`flex items-center justify-between ${
                              header.column.getIsResizing() ? "w-32" : ""
                            }`}
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                            {header.column.getIsResizing() && (
                              <div className="absolute right-0 top-0 h-full w-2 cursor-col-resize select-none touch-none" />
                            )}
                          </div>
                        )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody className="bg-card">
              {rows.length > 0 ? (
                rows.map((row) => {
                  return (
                    <TableRow
                      key={row.id}
                      onClick={() => {
                        router.push(`/admin/dashboard/exams/manage-exams/history/${row.original.id}`);
                      }}
                      className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      {row.getVisibleCells().map((cell) => {
                        return (
                          <TableCell key={cell.id}>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="text-center">
                    No data available
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-center gap-4 mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrev}
            disabled={page.examHistory.prevPage <= 0}
          >
            Previous
          </Button>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
            Page {page.examHistory.page} of {page.examHistory.totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={handleNext}
            disabled={
              page.examHistory.nextPage === -1 || page.examHistory.nextPage === null
            }
          >
            Next
          </Button>
        </div>
      </div>
    </>
  );
}

export default DataTable;
