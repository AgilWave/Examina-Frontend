import React from "react";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { format } from "date-fns";
import { Clock, Edit, FilePlus, User } from "lucide-react";

function SystemDetails() {
  const course = useSelector((state: RootState) => state.course);
  
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "PPpp");
    } catch {
      return dateString; 
    }
  };

  return (
    <div className="rounded-xl text-card-foreground  ">
      <div className="p-6">
        <h3 className="text-lg font-semibold leading-none tracking-tight flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-5 h-5"
          >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          System Metadata
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          Administrative information about this record
        </p>
        
        <Table className="mt-6">
          <TableBody>
            <TableRow className="hover:bg-transparent">
              <TableCell className="py-4 font-medium flex items-center gap-2 text-muted-foreground">
                <FilePlus className="w-4 h-4" />
                Created
              </TableCell>
              <TableCell className="py-4">
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span>{course.viewCourse.createdBy || "System"}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {formatDate(course.viewCourse.createdAt)}
                    </span>
                  </div>
                </div>
              </TableCell>
            </TableRow>
            
            <TableRow className="hover:bg-transparent">
              <TableCell className="py-4 font-medium flex items-center gap-2 text-muted-foreground">
                <Edit className="w-4 h-4" />
                Last Updated
              </TableCell>
              <TableCell className="py-4">
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span>{course.viewCourse.updatedBy || "Not modified"}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {course.viewCourse.updatedAt ? formatDate(course.viewCourse.updatedAt) : "Never"}
                    </span>
                  </div>
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default SystemDetails;