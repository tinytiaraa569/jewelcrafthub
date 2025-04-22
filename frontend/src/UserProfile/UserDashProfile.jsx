import React from "react";
import { BrowserRouter as Router, Link, useLocation, Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@/components/ui/breadcrumb";
import { ChevronRight } from "lucide-react";
import { AppSidebar } from "@/UserDashboard/components/Appsidebar";
import { SidebarHeader } from "@/UserDashboard/components/SidebarHeader";
import UserProfile from "./UserProfile";

function DynamicBreadcrumb() {
  const location = useLocation();
  const pathSegments = location.pathname.split("/").filter((segment) => segment);

  return (
    <Breadcrumb className="flex items-center space-x-2 text-sm">
      <BreadcrumbItem>
        <BreadcrumbLink asChild>
          <Link to="/user-dashboard" className="hover:text-foreground">
            Home
          </Link>
        </BreadcrumbLink>
      </BreadcrumbItem>

      {pathSegments.map((segment, index) => {
        const path = `/${pathSegments.slice(0, index + 1).join("/")}`;
        const isLast = index === pathSegments.length - 1;

        return (
          <BreadcrumbItem key={path} className="flex items-center">
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
            {isLast ? (
              <span className=" capitalize">{segment}</span>
            ) : (
              <BreadcrumbLink asChild>
                <Link to={path} className="capitalize hover:text-foreground">
                  {segment}
                </Link>
              </BreadcrumbLink>
            )}
          </BreadcrumbItem>
        );
      })}
    </Breadcrumb>
  );
}

export default function UserDashProfile({ children }) {
  return (
    <SidebarProvider>
        <div className="flex  w-full">
          <AppSidebar />

          <div className="flex flex-1 flex-col">
            <SidebarHeader />

            <main className="flex-1 p-4 overflow-auto">
              <div className="flex items-center space-x-4">
                <SidebarTrigger />
                <DynamicBreadcrumb />
              </div>
              <UserProfile />
            </main>
          </div>
        </div>
    </SidebarProvider>
  );
}
