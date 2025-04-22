import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { backendurl } from "@/server";
import axios from "axios";
import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, CheckCircle, XCircle, Loader2, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { FaRegSadTear } from "react-icons/fa";
import { MdHourglassEmpty } from "react-icons/md";
import { PiPackageLight } from "react-icons/pi";

const statusIcons = {
  pending: <Loader2 className="w-3 h-3 animate-spin" />,
  approved: <CheckCircle className="w-3 h-3 text-green-500" />,
  rejected: <XCircle className="w-3 h-3 text-red-500" />,
};

const Dashboarduploadsshort = () => {
  const { user } = useSelector((state) => state.auth);
  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showScrollIndicator, setShowScrollIndicator] = useState(false);
  const scrollRef = useRef(null);


  const navigate = useNavigate()

  const fetchUserDesigns = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Please log in to view your designs.");
        return;
      }

      if (!user || !user._id) {
        toast.error("User ID is missing. Please log in again.");
        return;
      }

      const response = await axios.get(
        `${backendurl}/userdesign/user-design/my-designs/${user._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setDesigns(response.data.designs.slice(0, 5));
    } catch (error) {
      console.error("Error fetching user designs:", error);
      // toast.error(error.response?.data?.error || "Failed to fetch designs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserDesigns();
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const handleScroll = () => {
      const threshold = 5;
      const isAtBottom = el.scrollHeight - el.scrollTop - el.clientHeight < threshold;
      setShowScrollIndicator(!isAtBottom);
    };

    el.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => {
      el.removeEventListener("scroll", handleScroll);
    };
  }, [designs]);

  const handleScrollClick = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollTop + 100,
        behavior: "smooth",
      });
    }
  };

  return (
    <Card className="w-full !py-0 !pt-2 !pb-6 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-lg shadow-sm">
      <CardContent className="p-4">
       

        <div className="mb-5 px-5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-800 dark:text-blue-600">
                  Latest Uploads
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                Recent design submissions
                </p>
              </div>
            </div>
          </div>

        {loading ? (
          <div className="flex justify-center items-center h-32">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : designs.length === 0 ? (
          <div className="w-full h-[300px] dark:bg-neutral-800 dark:rounded-[10px] px-4 flex flex-col items-center justify-center text-center py-16 text-slate-600 dark:text-slate-300 font-poppins">
          <PiPackageLight size={48} className="mb-4 text-blue-500" />
          <p className="text-lg font-semibold">No Designs Available</p>
          <p className="text-sm mt-1">You haven’t submitted any withdrawal requests yet.</p>
          <p className="text-sm">Once your designs are uploaded and approved, they’ll be listed here for review.</p>
        </div>
        ) : (
          <div className="relative">
            <div
              className="overflow-y-auto max-h-[300px] scrollbar-hidden pr-2"
              ref={scrollRef}
            >
              <div className="space-y-6 relative pl-8">
                <div
                  className="absolute left-4 top-0 bottom-0 w-0.5 
                    bg-gradient-to-b 
                    from-slate-300 via-slate-400 to-slate-500 
                    dark:from-neutral-600 dark:via-neutral-700 dark:to-neutral-800"
                />

                <AnimatePresence>
                  {designs.map((design, index) => (
                    <motion.div
                      key={design._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{
                        opacity: 1,
                        y: 0,
                        transition: {
                          type: "spring",
                          stiffness: 100,
                          damping: 10,
                          delay: index * 0.1,
                        },
                      }}
                      className="relative"
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{
                          scale: 1,
                          transition: {
                            delay: index * 0.1 + 0.2,
                            type: "spring",
                            stiffness: 200,
                          },
                        }}
                        className="absolute left-[-15px] top-2.5 h-3 w-3 rounded-full bg-blue-500 dark:bg-blue-400 shadow-sm -translate-x-1/2 z-10"
                      >
                        <motion.div
                          animate={{
                            scale: [1, 1.5, 1],
                            opacity: [0.5, 0, 0.5],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: index * 0.1,
                          }}
                          className="absolute inset-0 rounded-full bg-blue-300 dark:bg-blue-500"
                        />
                      </motion.div>

                      <motion.div
                        initial={{ x: -20, opacity: 0 }}
                        animate={{
                          x: 0,
                          opacity: 1,
                          transition: {
                            delay: index * 0.15 + 0.3,
                            type: "spring",
                            stiffness: 120,
                          },
                        }}
                        className="cursor-pointer bg-white dark:bg-neutral-800 border border-gray-100 dark:border-neutral-700 rounded-md p-3 pl-4 shadow-xs"
                        onClick={()=>{
                          navigate("/user-designupload")
                        }}
                      >
                        <div className="flex justify-between items-start gap-2">
                          <h3 className="text-sm font-medium text-gray-800 dark:text-white truncate flex-1">
                            {design.selectedBrief.name}
                          </h3>
                          <Badge
                            variant="outline"
                            className="text-xs py-0.5 px-2 h-5 flex items-center gap-1"
                          >
                            {statusIcons[design.status]}
                            {design.status}
                          </Badge>
                        </div>

                        <div className="flex items-center mt-1 text-xs text-gray-500 dark:text-gray-400">
                          <Clock className="w-2.5 h-2.5 mr-1" />
                          <span>
                            {new Date(design.createdAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                        </div>

                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{
                            height: "auto",
                            opacity: 1,
                            transition: {
                              delay: index * 0.2 + 0.4,
                            },
                          }}
                          className="overflow-hidden"
                        >
                          {design.status === "pending" && (
                            <p className="text-xs mt-1 text-yellow-600 dark:text-yellow-400">
                              Under review
                            </p>
                          )}
                          {design.status === "approved" && (
                            <p className="text-xs mt-1 text-green-600 dark:text-green-400">
                              Approved
                            </p>
                          )}
                          {design.status === "rejected" && (
                            <p className="text-xs mt-1 text-red-600 dark:text-red-400">
                              Needs revision
                            </p>
                          )}
                        </motion.div>

                        <motion.div
                          initial={{ scale: 0.9, opacity: 0 }}
                          animate={{
                            scale: 1,
                            opacity: 1,
                            transition: {
                              delay: index * 0.25 + 0.5,
                            },
                          }}
                          className="mt-2"
                        >
                          <Badge
                            variant="outline"
                            className="text-xs py-0.5 px-2 h-5 bg-gray-50 dark:bg-neutral-700"
                          >
                            {design.category}
                          </Badge>
                        </motion.div>
                      </motion.div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            {/* Scroll Indicator */}
            {designs.length >= 3 && showScrollIndicator && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  transition: { delay: 0.5 },
                }}
                className="absolute left-1/2 bottom-2 transform -translate-x-1/2 z-50 cursor-pointer"
                onClick={handleScrollClick}
              >
                <motion.div
                  animate={{
                    y: [0, 5, 0],
                    opacity: [0.6, 1, 0.6],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className=" flex justify-center"
                >
                  <ChevronDown className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                </motion.div>
                <motion.p
                  className="text-xs text-gray-500 dark:text-gray-400 mt-1"
                  animate={{
                    opacity: [0.8, 0.4, 0.8],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                  }}
                >
                  Scroll for more
                </motion.p>
              </motion.div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Dashboarduploadsshort;
