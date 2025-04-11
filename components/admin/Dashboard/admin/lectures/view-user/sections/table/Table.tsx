"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type FacultyTableProps = {
  data: { faculty: string; batch: string; module: string }[];
};

export function FacultyTable({ data }: FacultyTableProps) {
  return (
    <div className="p-4">
      <div className="max-h-45 overflow-y-auto border rounded-2xl shadow-sm dark:border-teal-600/50">
        <Table  className="w-full table-auto border-collapse">
          <TableHeader  className="sticky top-0 bg-white dark:bg-black z-10">
            <TableRow>
              <TableHead  className="px-4 py-2 text-left font-medium">Faculty</TableHead >
              <TableHead  className="px-4 py-2 text-left font-medium">Batch</TableHead >
              <TableHead  className="px-4 py-2 text-left font-medium">Module</TableHead >
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-4 text-gray-500">
                  No records yet.
                </TableCell>
              </TableRow>
            ) : (
              data.map((item, index) => (
                <TableRow key={index} className="border-t">
                  <TableCell  className="px-4 py-2">{item.faculty}</TableCell >
                  <TableCell  className="px-4 py-2">{item.batch}</TableCell >
                  <TableCell  className="px-4 py-2">{item.module}</TableCell >
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
