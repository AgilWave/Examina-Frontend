import React from "react";
import UserDetails from "./sections/Userdetails";
import SystemDetails from "./sections/SystemDetails";
import ModuleDetails from "./sections/ModuleDetails";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Settings } from "lucide-react";

function Content() {
  return (
    <div className="mt-5 w-full min-h-[440px] p-3 sm:p-5 flex flex-col justify-between items-center dark:bg-black/40 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
      <div className="flex w-full flex-col gap-3 sm:gap-5">
        <Tabs defaultValue="details" className="w-full">
          <div className="border-slate-200 dark:border-slate-700 border-b-2">
            <TabsList className="bg-transparent h-10 sm:h-12 p-1 sm:p-2">
              <TabsTrigger value="details" className="text-xs sm:text-sm">
                <User className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                Details
              </TabsTrigger>
              <TabsTrigger value="moduleDetails" className="text-xs sm:text-sm">
                <User className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                Module Details
              </TabsTrigger>
              <TabsTrigger value="settings" className="text-xs sm:text-sm">
                <Settings className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                System Details
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="details">
            <UserDetails />
          </TabsContent>
          <TabsContent value="moduleDetails" >
              <ModuleDetails/>
          </TabsContent>
          <TabsContent value="settings" >
              <SystemDetails/>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default Content;