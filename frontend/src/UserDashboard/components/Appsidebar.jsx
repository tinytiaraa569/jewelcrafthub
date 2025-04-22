import {
    Sidebar,
    SidebarFooter,
   
  } from "@/components/ui/sidebar"
import { CustomSidebarMenu } from "./CustomSidebarMenu"
import { SidebarHeader } from "./SidebarHeader"
  
  export function AppSidebar() {
    return (
      <Sidebar>
       {/* <SidebarHeader /> */}
        <CustomSidebarMenu />
          
        <SidebarFooter />
      </Sidebar>
    )
  }
  