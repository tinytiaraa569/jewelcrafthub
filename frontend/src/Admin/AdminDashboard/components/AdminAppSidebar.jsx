import {
    Sidebar,
    SidebarFooter,
   
  } from "@/components/ui/sidebar"
import AdminCustomSidebarMenu from "./AdminCustomSidebarMenu"

  
  export function AdminAppSidebar() {
    return (
      <Sidebar>
       
        <AdminCustomSidebarMenu />
          
        <SidebarFooter />
      </Sidebar>
    )
  }
  