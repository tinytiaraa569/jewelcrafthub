import React from "react";
import {
  LayoutDashboardIcon,
  UsersIcon,
  BarChartIcon,
  FolderIcon,
  ListIcon,
  HelpCircleIcon,
  SearchIcon,
  SettingsIcon,
  ChevronDown,
  Tags,
  BanknoteIcon, 
  UserCogIcon,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import NavUser from "./free/NavUser";
import { useTheme } from "@/components/ui/ThemeProvider";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const menuItems = [
  { title: "Dashboard", icon: LayoutDashboardIcon, url: "/admin-dashboard" },
  {
    title: "Users",
    icon: UsersIcon,
    submenu: [
      { title: "All Users", url: "/admin-allusers" },
      { title: "Designs Uploaded", url: "/admin-all-designs" },
      
    ],
  },
  {  title: "Category", icon: Tags ,url: "/admin-category" },
  { title: "Brief", icon: ListIcon, url: "/admin-briefs" },
  { title: "Withdrawals", icon: BanknoteIcon   , url: "/admin-withdrawals" },
  { title: "Team", icon: UserCogIcon, url: "/admin-team" },
  { title: "Support", icon: HelpCircleIcon, url: "/admin-support" },
  { title: "Analytics", icon: BarChartIcon, url: "/admin-analytics" },
];

const supportItems = [
  { title: "Settings", icon: SettingsIcon, url: "/admin-profile" },
  { title: "Get Help", icon: HelpCircleIcon, url: "#" },
  { title: "Search", icon: SearchIcon, url: "#" },
];

const AdminCustomSidebarMenu = () => {
  const { theme } = useTheme();
  const navigate = useNavigate()
  const { adminUser, isAuthenticated } = useSelector((state) => state.adminAuth);
  if(!adminUser){
    navigate("/admin")
  }

  return (
    <Sidebar
      collapsible="offcanvas"
      className="bg-background text-foreground shadow-md"
      data-theme={theme}
    >
      {/* Sidebar Header */}
      <SidebarHeader className="p-4 border-b border-muted">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="flex items-center gap-3 hover:bg-muted/50 rounded-lg p-2 transition">
              <LayoutDashboardIcon className="h-6 w-6 text-primary" />
              <span className="text-lg font-semibold tracking-wide">JewelCraftHub.</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* Sidebar Content */}
      <SidebarContent className="flex flex-col flex-1">
        <ScrollArea className="flex-1">
          {/* Main Navigation */}
          <div className="p-4">
            <h2 className="text-xs font-semibold text-muted-foreground uppercase mb-2">
              Main Menu
            </h2>
            <SidebarMenu>
            

            {menuItems.map((item, index) =>
              item.submenu ? (
                <Collapsible key={index} className="group/collapsible">
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton className="flex items-center justify-between w-full p-2 hover:bg-muted/50 rounded-lg transition !cursor-pointer">
                        <div className="flex items-center gap-3 !cursor-pointer">
                          <item.icon className="h-5 w-5" />
                          <span>{item.title}</span>
                        </div>
                        <ChevronDown className="w-4 h-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.submenu.map((sub, subIndex) => (
                          <SidebarMenuSubItem key={subIndex} className="pl-2 cursor-pointer">
                            <SidebarMenuButton
                              className="!cursor-pointer block py-1 px-2 text-sm hover:bg-muted/30 rounded-md "
                              onClick={() => {
                                if (sub.url !== "#") navigate(sub.url);
                              }}
                            >
                              {sub.title}
                            </SidebarMenuButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              ) : (
                <SidebarMenuItem key={index}>
                  <SidebarMenuButton
                    className="cursor-pointer flex items-center gap-3 hover:bg-muted/50 rounded-lg p-2 transition"
                    onClick={() => {
                      if (item.url !== "#") navigate(item.url);
                    }}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            )}

            </SidebarMenu>
          </div>

          <Separator className="bg-muted my-2" />

          {/* Support Navigation */}
          <div className="p-4">
            <h2 className="text-xs font-semibold text-muted-foreground uppercase mb-2">
              Support
            </h2>
            <SidebarMenu>
            {supportItems.map((item, index) => (
            <SidebarMenuItem key={index}>
              <SidebarMenuButton
                className="!cursor-pointer flex items-center gap-3 hover:bg-muted/50 rounded-lg p-2 transition"
                onClick={() => {
                  if (item.url !== "#") navigate(item.url);
                }}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}

            </SidebarMenu>
          </div>
        </ScrollArea>
      </SidebarContent>

      {/* Sidebar Footer with Admin Details */}
      <SidebarFooter className="border-t border-muted p-4">
        {isAuthenticated && adminUser ? (
          <NavUser user={adminUser} />
        ) : (
          <NavUser user={{ name: "Admin", email: "admin@example.com" }} />
        )}
      </SidebarFooter>
    </Sidebar>
  );
};

export default AdminCustomSidebarMenu;
