import React from "react";
import { BrowserRouter as Router, Link, useLocation, Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
// import { SidebarHeader } from "./components/SidebarHeader";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@/components/ui/breadcrumb";
import { ChevronRight } from "lucide-react";
import { AdminAppSidebar } from "../AdminDashboard/components/AdminAppSidebar";
import { AdminSidebarHeader } from "../AdminDashboard/components/AdminSidebarHeader";
import AdminTeam from "./AdminTeam";

function DynamicBreadcrumb() {
  const location = useLocation();
  const pathSegments = location.pathname.split("/").filter((segment) => segment);

  return (
    <Breadcrumb className="flex items-center space-x-2 text-sm">
      <BreadcrumbItem>
        <BreadcrumbLink asChild>
          <Link to="/admin-dashboard" className="hover:text-foreground">
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

export default function AdminTeamMain({ children }) {
  return (
    <SidebarProvider>
        <div className="flex h-screen w-full">
          <AdminAppSidebar variant="inset"/>

          <div className="flex flex-1 flex-col">
            <AdminSidebarHeader />

            <main className="flex-1 p-4 overflow-auto">
              <div className="flex items-center space-x-4">
                <SidebarTrigger />
                <DynamicBreadcrumb />
              </div>
              <AdminTeam />
              {children}
            </main>
          </div>
        </div>
    </SidebarProvider>
  );
}
