import { 
  Calendar, ChevronsUpDown, CreditCard, DollarSign, Gem, GemIcon, Headphones, HelpCircle, Home, Inbox, LogOutIcon, Search, Settings, Upload, User, UserPen 
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"  // Import Framer Motion
import logo from './images/logo.webp'
import { useDispatch, useSelector } from "react-redux"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { logout } from "@/redux/slices/authSlice"
import { imgurl } from "@/server"
import { PiPencil } from "react-icons/pi";

// Menu items
const items = [
  { id: 1, name: "Home", url: "/user-dashboard", icon: Home },
  { id: 2, name: "Portfolio", url: "/user-portfolio", icon: Inbox },
  { id: 3, name: "Upload", url: "/user-designupload", icon: Upload },

  { id: 4, name: "Payouts", url: "/user-payouts", icon: DollarSign  },
  { id: 5, name: "Brief", url: "/design-brief", icon: PiPencil  },
  { id: 6, name: "Settings", url: "/user-profile", icon: Settings },
  { id: 7, name: "Support", url: "/user-support", icon: HelpCircle }, // ❓ Help/Support
]

export function CustomSidebarMenu() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate()
  
  const getInitials = (name) => {
    if (!name) return "U";
    const nameParts = name.split(" ");
    return nameParts[0][0].toUpperCase() + (nameParts[1]?.[0]?.toUpperCase() || "");
  };

  return (
    <Sidebar>
      <SidebarContent>
        {/* Sidebar Header */}
        <SidebarGroup>
        <motion.div
          className="pt-4 pb-2 flex flex-col items-center justify-center 
                      dark:from-neutral-800 dark:to-neutral-900 
                      rounded-2xl mb-3"
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
        >
      {/* Icon with Increased Height */}
      <div className="relative flex items-center justify-center w-24 h-24 rounded-full">
      {/* Animated Border Container */}
      <div className="absolute inset-0 animate-border-glow bg-gradient-to-r from-[var(--primary-color)] via-[var(--secondary-color)] to-purple-500 rounded-full p-[2px]">
        {/* Inner Content */}
        <div className="flex items-center justify-center w-full h-full bg-white dark:bg-neutral-800 rounded-full">
          <Gem className="text-[var(--primary-color)] w-14 h-14 dark:text-[var(--secondary-color)] animate-pulse" />
        </div>
      </div>
    </div>


      {/* Smaller Professional Heading */}
      <motion.h1
      className="mt-3 text-2xl font-bold text-transparent bg-clip-text 
                bg-gradient-to-r from-slate-600 to-slate-800 
                dark:from-neutral-200 dark:to-neutral-400 tracking-wide"
      initial={{ y: -8, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
    >
      Jewel<span className="text-[var(--primary-color)]">Craft</span>Hub
    </motion.h1>

      {/* Two-line Paragraph */}
      <p className="mt-1 text-center text-sm text-gray-600 dark:text-gray-300 leading-tight max-w-sm">
        Transform your imagination into income by showcasing 
        your exquisite jewelry designs.
      </p>
    </motion.div>



        </SidebarGroup>

        {/* Command Menu with Animation */}
        <SidebarGroup>
          <p className="text-muted-foreground pl-3 text-sm mb-2">Menu Links</p>
          <motion.nav
            className="relative"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Command className="rounded-lg overflow-visible bg-transparent">
              <CommandInput placeholder="Search..." />
              <CommandList className="pb-4 overflow-visible">
                <CommandEmpty>No results found</CommandEmpty>
                <CommandGroup className="overflow-visible mt-2">
                  {items.map((item) => (
                    <CommandItem
                      key={item.id}
                      className="w-full hover:scale-105 transition-transform"
                    >
                      <Link
                        to={item.url}
                        className="flex items-center gap-3 hover:bg-transparent rounded-md transition-all w-full"
                      >
                        <item.icon className="w-5 h-5" />
                        <span>{item.name}</span>
                      </Link>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </motion.nav>
        </SidebarGroup>

        {/* Profile Popover Section */}
        <motion.div
          className="absolute bottom-4 left-2 right-2"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <SidebarGroup>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full flex justify-between items-center p-4 cursor-pointer"
                >
                  <div className="flex items-center gap-2 text-left">
                    <div className="relative w-8 h-8">
                      {user?.avatar ? (
                        <motion.img
                          src={`${imgurl}${user.avatar}`}
                          alt="User Avatar"
                          className="object-cover w-full h-full rounded-full border border-slate-300 dark:border-slate-700 shadow"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.5 }}
                        />
                      ) : (
                        <motion.div
                          className="flex items-center justify-center w-full h-full bg-slate-500 text-white font-medium text-xs rounded-full border border-slate-400 dark:border-slate-600 shadow-md"
                          initial={{ scale: 0.9 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 0.4 }}
                        >
                          {user?.name ? getInitials(user.name) : <User className="w-4 h-4 text-white" />}
                        </motion.div>
                      )}
                    </div>

                    <div className="flex flex-col text-xs pl-1">
                      <span className="font-medium text-gray-900 dark:text-white">
                        {user?.name}
                      </span>
                      <span className="text-muted-foreground">{user?.email}</span>
                    </div>
                  </div>
                  <ChevronsUpDown size={16} className="text-muted-foreground" />
                </Button>
              </PopoverTrigger>

              <PopoverContent side={"right"} align={"start"} className="w-64 mt-2 z-[200] mb-2">
                <Command className="rounded-lg">
                  <CommandList>
                    <motion.div
                      className="pl-2 flex items-center text-left gap-2 mb-1"
                      initial={{ x: -10, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ duration: 0.4 }}
                    >
                      <div className="relative w-10 h-10">
                        {user?.avatar ? (
                          <img src={`${imgurl}${user.avatar}`} alt="User Avatar" className="w-full h-full rounded-full" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-slate-500 text-white text-sm rounded-full">
                            {getInitials(user.name)}
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col text-xs">
                        <span className="font-medium">{user?.name}</span>
                        <span className="text-muted-foreground">{user?.email}</span>
                      </div>
                    </motion.div>

                    <Separator />

                    <CommandGroup>
                      <CommandItem>
                        <div className="w-full cursor-pointer flex items-center gap-2" onClick={()=> {navigate("/user-profile")} }>

                        <UserPen size={16} />
                        Account
                        </div>
                      </CommandItem>
                      <CommandItem >
                        <div className="w-full cursor-pointer flex items-center gap-2" onClick={()=> {navigate("/user-payouts")}}>
                        <CreditCard size={16} />
                        Payout
                        </div>

                      </CommandItem>
                      <CommandItem >
                        <div className="w-full cursor-pointer flex items-center gap-2" onClick={()=> {navigate("/user-support")}}>
                        <Headphones size={16} />
                        Support
                        </div>

                      </CommandItem>
                      <CommandItem >
                      <div className="w-full cursor-pointer flex items-center gap-2" onClick={() => {dispatch(logout())}}>
                        <LogOutIcon size={16} />
                        Logout
                      </div>
                      </CommandItem>
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </SidebarGroup>
        </motion.div>
      </SidebarContent>
    </Sidebar>
  );
}
