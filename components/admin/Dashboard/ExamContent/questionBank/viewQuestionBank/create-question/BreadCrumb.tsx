import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useSearchParams } from "next/navigation";

function BreadCrumb() {
  const searchParams = useSearchParams();
  const moduleName = searchParams.get("module");
  const id = searchParams.get("id");
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
            <BreadcrumbLink
              href="/admin/dashboard/exams"
              className="text-muted-foreground hover:text-foreground"
            >
              Exams
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink
              href="/admin/dashboard/exams/questions-bank"
              className="text-muted-foreground hover:text-foreground"
            >
              Question Bank
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink className="text-muted-foreground hover:text-foreground"
              href={`/admin/dashboard/exams/questions-bank/view-questions?id=${id}&module=${moduleName}`}
            >

              {moduleName}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="text-muted-foreground">
              Create Questions
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </>
  );
}

export default BreadCrumb;
