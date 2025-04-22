import {
    Sidebar,
    SidebarFooter,
   
  } from "@/components/ui/sidebar"
import { CustomSidebarMenu } from "./CustomSidebarMenu"
  
  export function AppSidebar() {
    return (
      <Sidebar>
       {/* <SidebarHeader /> */}
        <CustomSidebarMenu />
          
        <SidebarFooter />
      </Sidebar>
    )
  }
  