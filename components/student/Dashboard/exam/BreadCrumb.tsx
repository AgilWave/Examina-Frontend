import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

function BreadCrumb() {
  return (
    <>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink
              href="/admin/dashboard/overview"
              className="text-muted-foreground hover:text-foreground"
            >
              Dashboard
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
          <BreadcrumbPage className="text-muted-foreground">
            Exams
          </BreadcrumbPage>
        </BreadcrumbItem>
        </BreadcrumbList> 
      </Breadcrumb>
    </>
  );
}

export default BreadCrumb;
