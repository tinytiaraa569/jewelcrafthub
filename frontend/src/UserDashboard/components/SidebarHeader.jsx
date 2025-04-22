import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, Sun, Moon, Settings, User, Cross, X, CheckCircle, XCircle } from "lucide-react";
import { useTheme } from "@/components/ui/ThemeProvider";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/redux/slices/authSlice";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ColorThemeSelector } from "@/components/ui/ColorThemeSelector";
import { useNavigate } from "react-router-dom";
import { backendurl, imgurl } from "@/server";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { toast } from "sonner";

export function SidebarHeader() {
  const { theme, setTheme } = useTheme();
  const { user  } = useSelector((state) => state.auth);
  const { notifications  } = useSelector((state) => state.userNotification );
  console.log(notifications,"see")
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  // const [notifications, setNotifications] = useState([]);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleNotificationToggle = async () => {
    setIsNotificationOpen(!isNotificationOpen);

    if (!isNotificationOpen && unreadCount > 0) {
      try {
        // Mark all notifications as read
        await axios.put(`${backendurl}/notification/notifications/mark-all-read/${user?._id}`);

        // Optional: Mark all as read in Redux directly (optimistic update)
        dispatch({
          type: "NOTIFICATION_FETCH_SUCCESS",
          payload: notifications.map((notification) =>
            notification.userId === user?._id
              ? { ...notification, read: true }
              : notification
          )
        });

        toast.success("All notifications marked as read");
      } catch (error) {
        console.error("Failed to mark notifications as read:", error);
      }
    }
  };

  useEffect(() => {
    const fetchNotifications = async () => {
      if (user && user._id) {
        try {
          const response = await axios.get(`${backendurl}/notification/notifications/${user?._id}`);
          dispatch({ type: "NOTIFICATION_FETCH_SUCCESS", payload: response.data.notifications });
        } catch (error) {
          console.error("Error fetching notifications:", error);
        }
      }
    };
  
    fetchNotifications();
  }, [user, dispatch]);

  return (
    <div className="flex justify-between md:justify-end items-center p-4 border-b pr-10 border-gray-200 dark:border-gray-700 bg-white dark:bg-stone-950">
    {/* Logo visible only on small screens */}
    <h1 className="text-lg font-bold text-gray-800 dark:text-white md:hidden">
      Jewel<span className="text-[var(--primary-color)]">Craft</span>Hub
    </h1>
  
    {/* Right-side Icons */}
    <div className="flex items-center gap-3">
     

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="cursor-pointer">
                  <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                  <span className="sr-only">Toggle theme</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="p-2">
                <DropdownMenuItem onClick={() => setTheme("light")} className="cursor-pointer">Light</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")} className="cursor-pointer">Dark</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")} className="cursor-pointer">System</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

  
      {/* Notifications Button */}
      <Button variant="ghost" size="icon" onClick={handleNotificationToggle} className="relative cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800">
        <Bell className="w-5 h-5 text-gray-800 dark:text-white" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 w-4 h-4 text-[8px] p-1 font-[500] text-white bg-red-500 rounded-full flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </Button>
  
      {/* Settings Button */}
      <Button variant="ghost" size="icon" className="hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer" onClick={()=>{navigate("/user-profile")}}>
        <Settings className="w-5 h-5 text-gray-800 dark:text-white" />
      </Button>
  
      {/* User Avatar Dropdown */}

      <Popover>
        <PopoverTrigger asChild>
            <Avatar className="cursor-pointer">
            {user?.avatar ? (
                <AvatarImage src={`${imgurl}${user.avatar}`} alt="User Profile" />
            ) : user?.name ? (
                <AvatarFallback className="bg-gray-500 dark:bg-gray-700 text-xs text-white uppercase">
                {user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()}
                </AvatarFallback>
            ) : (
                <AvatarFallback className="bg-gray-500 dark:bg-gray-700 text-white">
                <User className="w-5 h-5" />
                </AvatarFallback>
            )}
            </Avatar>
        </PopoverTrigger>

        <PopoverContent className="w-64 mr-10 p-0 bg-white dark:bg-neutral-900 border border-gray-300 dark:border-neutral-700 shadow-lg rounded-lg">
  <div className="p-4">
    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
      {user?.name}
    </p>
    <p className="text-xs text-gray-600 dark:text-gray-400 mb-4">
      {user?.email}
    </p>

    {/* View Profile Button - Enhanced for Dark Mode */}
   <Button
  className="w-full mb-2 cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-900
             dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:text-white font-medium py-2 px-4 rounded-md"
  onClick={() => {
    navigate("/user-profile");
  }}
>
  View Profile
</Button>


    {/* Logout Button - Styled for Destructive Action */}
    <Button
      variant="destructive"
      className="w-full cursor-pointer bg-red-500 hover:bg-red-600 text-white 
                 dark:bg-red-600 dark:hover:bg-red-500 dark:text-gray-100 font-medium py-2 px-4 rounded-md"
      onClick={() => {
        dispatch(logout());
      }}
    >
      Logout
    </Button>
  </div>
</PopoverContent>

      </Popover>



 {/* Notification Overlay */}
 {isNotificationOpen && (
  <>
    {/* Dark background overlay */}
    <div className="fixed inset-0 bg-black opacity-50 z-40" />
    
    {/* Sliding notification sidebar */}
    <motion.div
      className="fixed right-0 top-0 w-96 h-full bg-white dark:bg-neutral-800 z-50 flex flex-col"
      initial={{ x: '100%' }}  // Initially off-screen to the right
      animate={{ x: 0 }}        // Slide in on-screen
      exit={{ x: '100%' }}      // Slide out on close
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}  // Smooth animation
    >
      {/* Notification Header with Close Icon */}
      <div className="p-4 flex justify-between items-center border-b border-neutral-200 dark:border-neutral-600">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Notifications</h3>
        <X
          className="text-gray-600 dark:text-gray-400 cursor-pointer hover:text-gray-800 dark:hover:text-white"
          onClick={handleNotificationToggle}
          size={24}
        />
      </div>

      {/* Scrollable Notification List (Hidden Scrollbar) */}
      <div className="flex-1 overflow-y-auto p-4 scrollbar-hidden">
        {notifications.length > 0 ? (
          <ul className="space-y-4">
            {notifications.map((notification) => (
              <motion.li
                key={notification?._id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center space-x-3 p-3 rounded-lg bg-neutral-50 border border-neutral-100 dark:border-neutral-600 dark:bg-neutral-700 hover:bg-gray-200 dark:hover:bg-gray-700 transition duration-200 ease-in-out"
              >
                {notification.icon === "check" && <CheckCircle className="text-green-500 dark:text-green-400" size={20} />}
                {notification.icon === "danger" && <XCircle className="text-red-500 dark:text-red-400" size={20} />}
                {notification.icon === "info" && <Bell className="text-gray-500 dark:text-gray-300" size={20} />}
                
                <div className="flex-1">
                  <p className="text-sm text-gray-700 dark:text-gray-300">{notification.message}</p>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {notification.createdAt
                      ? new Date(notification.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                      : "Date not available"}
                  </span>
                </div>
              </motion.li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">No new notifications.</p>
        )}
      </div>

      {/* Close Button */}
      <div className="p-4  border-gray-300 dark:border-neutral-600">
        <Button
          variant="outline"
          className="cursor-pointer w-full border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 dark:bg-neutral-800 dark:border-neutral-600 dark:text-gray-300 dark:hover:bg-neutral-700"
          onClick={handleNotificationToggle}
        >
          Close
        </Button>
      </div>
    </motion.div>
  </>
)}

    </div>
  </div>
  

  );
}
