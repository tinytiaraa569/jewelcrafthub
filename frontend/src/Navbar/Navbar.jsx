// import React, { useState } from "react";
// import { motion } from "framer-motion";
// import { Link, useLocation, useNavigate } from "react-router-dom";
// import { Button } from "@/components/ui/button";
// import { Sun, Moon, Menu, X, UserCircle, User } from "lucide-react";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { useTheme } from "@/components/ui/ThemeProvider";
// import { useDispatch, useSelector } from "react-redux";
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
// import { logout } from "@/redux/slices/authSlice";

// const Navbar = () => {
//   const { theme, setTheme } = useTheme();
//   const [isOpen, setIsOpen] = useState(false);
//   const navigate = useNavigate();
//   const location = useLocation();

//   const dispatch = useDispatch()
//   const { user ,isAuthenticated } = useSelector((state) => state.auth);


//   const menuLinks = [
//     { name: "Home", path: "/" },
//     { name: "About", path: "/about" },
//     { name: "Contact", path: "/contact" },
//   ];

//   return (
//     <nav className="w-full bg-white dark:bg-gray-900 shadow-md sticky top-0 left-0 z-50">
//       <div className="max-w-7xl mx-auto px-6 lg:px-10">
//         <div className="flex justify-between items-center h-16">
//           {/* Logo */}
//           <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
//             <h1
//               className="text-2xl font-bold text-gray-800 dark:text-white cursor-pointer"
//               onClick={() => navigate("/")}
//             >
//               Jewel<span className="text-[var(--primary-color)]">Craft</span>Hub
//             </h1>
//           </motion.div>

//           {/* Desktop Menu */}
//           <div className="hidden md:flex space-x-6">
//             {menuLinks.map((item, index) => (
//               <motion.div
//                 key={index}
//                 initial={{ opacity: 0, y: -10 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: index * 0.1 }}
//                 className="transition duration-300"
//               >
//                 <Link
//                   to={item.path}
//                   className={`${
//                     location.pathname === item.path ? "text-[var(--primary-color)] font-semibold" : "text-[var(--text-color)] dark:text-[var(--text-color-dark)]"
//                   } hover:text-[var(--primary-color)] transition duration-300`}
//                 >
//                   {item.name}
//                 </Link>
//               </motion.div>
//             ))}
//           </div>

//           {/* Toggle Buttons */}
//           <div className="flex items-center space-x-2">
//             {/* Dark Mode Toggle */}
//             <DropdownMenu>
//               <DropdownMenuTrigger asChild>
//                 <Button variant="outline" size="icon">
//                   <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
//                   <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
//                   <span className="sr-only">Toggle theme</span>
//                 </Button>
//               </DropdownMenuTrigger>
//               <DropdownMenuContent align="end">
//                 <DropdownMenuItem onClick={() => setTheme("light")}>Light</DropdownMenuItem>
//                 <DropdownMenuItem onClick={() => setTheme("dark")}>Dark</DropdownMenuItem>
//                 <DropdownMenuItem onClick={() => setTheme("system")}>System</DropdownMenuItem>
//               </DropdownMenuContent>
//             </DropdownMenu>

//             {/* Login Button */}
            

//             {isAuthenticated ? (
//               <Popover>
//                 <PopoverTrigger asChild>
//                   <Button variant="ghost" size="icon" className="cursor-pointer">
//                     <User className=" w-6 h-6 text-gray-800 dark:text-white" />
//                   </Button>
//                 </PopoverTrigger>

//                 <PopoverContent align="end" className="w-44 p-2 ">
//                   <ul className="space-y-2 ">
//                     <li onClick={()=>{navigate("/user-dashboard")}}>
//                       <Button variant="ghost" className="w-full justify-start cursor-pointer">
//                         Dashboard
//                       </Button>
//                     </li>
//                     <li onClick={()=>{navigate("/user-profile")}}>
//                       <Button variant="ghost" className="w-full justify-start cursor-pointer">
//                         Profile
//                       </Button>
//                     </li>
//                     <li>
//                       <Button variant="ghost" className="w-full justify-start text-red-600 cursor-pointer"
//                       onClick={() => dispatch(logout())} // Call logout function
//                       >
//                         Logout
//                       </Button>
//                     </li>
//                   </ul>
//                 </PopoverContent>
//               </Popover>
//             )
//             :(
//               <motion.button
//                     className="hidden md:block px-5 py-2 bg-[var(--primary-color)] cursor-pointer text-white rounded-lg shadow-md hover:bg-[var(--primary-hover-color)] transition-all duration-300"
//                     onClick={() => navigate("/auth")}
//                   >
//                     Login
//                   </motion.button>
//             )
//             }

//             {/* Mobile Menu Toggle */}
//             <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
//               {isOpen ? <X className="w-6 h-6 text-gray-800 dark:text-white" /> : <Menu className="w-6 h-6 text-gray-800 dark:text-white" />}
//             </Button>
//           </div>
//         </div>
//       </div>

//       {/* Mobile Menu */}
//       <motion.div
//         initial={{ opacity: 0, y: -10 }}
//         animate={{ opacity: isOpen ? 1 : 0, y: isOpen ? 0 : -10 }}
//         transition={{ duration: 0.3 }}
//         className={`absolute top-16 left-0 w-full bg-white dark:bg-gray-900 shadow-lg transition duration-300 py-4 px-6 space-y-3 ${
//           isOpen ? "block" : "hidden"
//         }`}
//       >
//         {menuLinks.map((item, index) => (
//           <motion.div
//             key={index}
//             initial={{ opacity: 0, x: -20 }}
//             animate={{ opacity: 1, x: 0 }}
//             exit={{ opacity: 0, x: -20 }}
//             transition={{ duration: 0.3, delay: index * 0.1 }}
//           >
//             <Link
//               to={item.path}
//               className={`block ${
//                 location.pathname === item.path ? "text-[var(--primary-color)] font-semibold" : "text-[var(--text-color)] dark:text-[var(--text-color-dark)]"
//               } hover:text-[var(--primary-color)] transition duration-300`}
//               onClick={() => setIsOpen(false)}
//             >
//               {item.name}
//             </Link>
//           </motion.div>
//         ))}

//         {/* Mobile Login Button */}
//         <motion.button
//           className="w-full px-5 py-2 bg-[var(--primary-color)] text-white rounded-lg shadow-md hover:bg-[var(--primary-hover-color)] transition-all duration-300"
//           onClick={() => {
//             setIsOpen(false);
//             navigate("/auth");
//           }}
//         >
//           Login
//         </motion.button>
//       </motion.div>
//     </nav>
//   );
// };

// export default Navbar;


import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiMenu, FiX } from 'react-icons/fi';
import logo from './logo.webp';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { User } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { logout } from '@/redux/slices/authSlice';



const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'About Us', href: '/about' },
  { label: 'Design Brief', href: '/designs' },
  { label: 'Contact', href: '/contact' },
];

const linkVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1 + 0.2,
      duration: 0.4,
      ease: 'easeOut',
    },
  }),
};

const menuVariants = {
  hidden: { opacity: 0, y: '-100%' },
  visible: {
    opacity: 1,
    y: '0%',
    transition: { duration: 0.5, ease: 'easeInOut' },
  },
  exit: {
    opacity: 0,
    y: '-100%',
    transition: { duration: 0.4, ease: 'easeInOut' },
  },
};

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user ,isAuthenticated } = useSelector((state) => state.auth);

  const toggleMenu = () => setIsOpen((prev) => !prev);
  const isActive = (href) => location.pathname === href;

  // Auto-close mobile menu on window resize (if switching to desktop)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isOpen]);

  return (
    <div className="bg-black text-white sticky top-0 left-0 w-full z-50 shadow-md font-normal">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <motion.img
          src={logo}
          alt="logo"
          className="h-14 cursor-pointer"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}

          onClick={()=>{navigate("/")}}
        />

        {/* Desktop Nav */}
        <ul className="hidden md:flex space-x-6 relative">
          {navLinks.map((link, index) => (
            <li key={index} className="relative group">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                to={link.href}
                className={`transition-colors duration-300 ${
                  isActive(link.href) ? 'text-[#e8fb55]' : 'text-white'
                } hover:text-[#e8fb55]`}
              >
                {link.label}
              </Link>
            </motion.div>
          
            {/* Underline Animation */}
            <motion.div
              className={`absolute bottom-[-4px] left-0 h-[2px] bg-[#e8fb55] origin-left transition-all duration-300 ${
                isActive(link.href)
                  ? 'w-full'
                  : 'w-0 group-hover:w-full'
              }`}
            />
          </li>
          
          ))}
        </ul>


        {isAuthenticated ? (
          <Popover >
            <PopoverTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="hidden md:block cursor-pointer p-2 rounded-full transition duration-300 ease-in-out hover:bg-gray-700 hover:text-white"
              >
                {/* User Icon with hover effect */}
                <User className="w-10 h-10 text-white transition-all duration-200 ease-in-out group-hover:text-[#e8fb55]" />
              </Button>
            </PopoverTrigger>

            <PopoverContent align="end" className="w-44 p-2">
              <ul className="space-y-2">
                <li onClick={() => { navigate("/user-dashboard") }}>
                  <Button variant="ghost" className="w-full justify-start cursor-pointer">
                    Dashboard
                  </Button>
                </li>
                <li onClick={() => { navigate("/user-profile") }}>
                  <Button variant="ghost" className="w-full justify-start cursor-pointer">
                    Profile
                  </Button>
                </li>
                <li>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start text-red-600 cursor-pointer"
                    onClick={() => dispatch(logout())}
                  >
                    Logout
                  </Button>
                </li>
              </ul>
            </PopoverContent>
          </Popover>
        ) : (
          <motion.button
            onClick={() => navigate("/auth")}
            transition={{ duration: 0.3 }}
            className=" cursor-pointer hidden md:block px-8 py-2 rounded-full bg-[#e8fb55] text-black font-medium transition duration-300 ease-in-out hover:bg-black hover:text-[#e8fb55] border-2 border-transparent hover:border-[#e8fb55]"
          >
            Get Started
          </motion.button>
        )}



        {/* Desktop Get Started Button
        <motion.button
          transition={{ duration: 0.3 }}
          className="cursor-pointer hidden md:block px-8 py-2 rounded-full bg-[#e8fb55] text-black font-medium transition duration-300 ease-in-out hover:bg-black hover:text-[#e8fb55] border-2 border-transparent hover:border-[#e8fb55]"
        >
          Get Started
        </motion.button> */}

        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <button onClick={toggleMenu} className="text-white text-2xl cursor-pointer">
            {isOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay */}
            <motion.div
              className="fixed top-0 left-0 w-full h-full bg-black/80 backdrop-blur-sm z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* Menu Panel */}
            <motion.div
              className="fixed top-0 left-0 w-full h-full bg-black text-white z-50 px-6 flex flex-col justify-center items-center"
              variants={menuVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {/* Close Icon */}
              <button
                onClick={toggleMenu}
                className="absolute top-4 right-4 text-[#e8fb55] cursor-pointer text-3xl z-50"
              >
                <FiX />
              </button>

              {/* Nav Links + Button */}
              <ul className="flex flex-col items-center space-y-6 text-xl font-semibold text-center">
                {navLinks.map((link, index) => (
                  <motion.li
                    key={link.href}
                    className="relative group inline-block w-fit"
                    custom={index}
                    initial="hidden"
                    animate="visible"
                    variants={linkVariants}
                  >
                    <Link
                      to={link.href}
                      onClick={() => setIsOpen(false)}
                      className={`transition-colors duration-300 ${
                        isActive(link.href) ? 'text-[#e8fb55]' : 'text-white'
                      } hover:text-[#e8fb55]`}
                    >
                      {link.label}
                    </Link>
                    <motion.div
                      layoutId="underline-mobile"
                      className={`absolute bottom-[-2px] left-0 h-[2px] bg-[#e8fb55] origin-left transition-transform duration-300 scale-x-0 group-hover:scale-x-100 ${
                        isActive(link.href) ? 'scale-x-100 w-full' : 'w-full'
                      }`}
                    />
                  </motion.li>
                ))}

                {/* Mobile Version */}
                {isAuthenticated ? (
                <Popover>
                  <PopoverTrigger asChild>
                  <div className="block md:hidden flex items-center gap-2 px-4 py-2 rounded-full bg-gray-900 hover:bg-gray-700 transition-all duration-300 shadow-md cursor-pointer">
                    <User className="w-5 h-5 text-[#e8fb55]" />
                    <span className="text-white font-medium text-sm truncate max-w-[120px]">
                      {user?.name || "User"}
                    </span>
                  </div>
                  </PopoverTrigger>

                  <PopoverContent align="start" className="w-44 p-2 shadow-lg rounded-lg bg-white dark:bg-gray-900">
                    <ul className="space-y-1">
                      <li onClick={() => navigate("/user-dashboard")}>
                        <Button variant="ghost" className="w-full justify-start text-sm font-medium text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800">
                          Dashboard
                        </Button>
                      </li>
                      <li onClick={() => navigate("/user-profile")}>
                        <Button variant="ghost" className="w-full justify-start text-sm font-medium text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800">
                          Profile
                        </Button>
                      </li>
                      <li>
                        <Button 
                          variant="ghost" 
                          onClick={() => dispatch(logout())}
                          className="w-full justify-start text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900"
                        >
                          Logout
                        </Button>
                      </li>
                    </ul>
                  </PopoverContent>
                </Popover>
                  ) : (
                    <motion.li
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="block md:hidden w-full"
                    >
                      <button
                        onClick={() => navigate("/auth")}
                        className="w-full mt-4 px-6 py-2 bg-[#e8fb55] text-black rounded-full font-medium text-sm transition duration-300 hover:bg-black hover:text-[#e8fb55] border-2 border-transparent hover:border-[#e8fb55]"
                      >
                        Get Started
                      </button>
                    </motion.li>
                  )}


                {/* Get Started */}
                {/* <motion.li
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <button
                    className="mt-4 px-8 py-2 bg-[#e8fb55] text-black rounded-full font-medium transition duration-300 hover:bg-black hover:text-[#e8fb55] border-2 border-transparent hover:border-[#e8fb55]"
                  >
                    Get Started
                  </button>
                </motion.li> */}
              </ul>

              {/* Contact Info at bottom */}
              <div className="absolute bottom-10 left-0 right-0 flex flex-col items-center space-y-2 text-sm text-gray-400">
                <div className='text-center mb-2'>
                  <h2 className="text-white font-medium">+555 5555 555</h2>
                  <p>Support Hotline</p>
                </div>
                <div className='text-center'>
                  <h2 className="text-white font-medium">mymail@mailservice.com</h2>
                  <p>Support Email</p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Navbar;
