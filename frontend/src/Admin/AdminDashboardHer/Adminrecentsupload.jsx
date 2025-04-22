import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { Card, CardContent } from '@/components/ui/card';
import { backendurl, imgurl } from '@/server';
import { useTheme } from '@/components/ui/ThemeProvider';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { FaCheck, FaClock } from 'react-icons/fa6';
import { FaTimes } from 'react-icons/fa';

const Adminrecentsupload = () => {
  const [recentDesigns, setRecentDesigns] = useState([]);
  const [userDetails, setUserDetails] = useState({});
  const [isAtBottom, setIsAtBottom] = useState(false);
  const { theme } = useTheme();
  const scrollRef = useRef(null);
  console.log(recentDesigns,'recents desing ')

  useEffect(() => {
    const fetchRecentDesigns = async () => {
      try {
        const res = await axios.get(`${backendurl}/userdesign/user-design/all-designs`, {
          withCredentials: true,
        });

        const sorted = res.data.designs
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 5);

        setRecentDesigns(sorted);

        const uniqueUserIds = [...new Set(sorted.map((d) => d.user))];
        const userInfoMap = {};

        await Promise.all(
          uniqueUserIds.map(async (userId) => {
            try {
              const userRes = await axios.get(`${backendurl}/admin/get-user-ID/${userId}`, {
                withCredentials: true,
              });
              userInfoMap[userId] = userRes.data.user;
            } catch (err) {
              console.error('User fetch failed', err);
              userInfoMap[userId] = { name: 'Unknown', email: '' };
            }
          })
        );

        setUserDetails(userInfoMap);
      } catch (error) {
        console.error('Failed to fetch designs:', error);
      }
    };

    fetchRecentDesigns();
  }, []);

  // Detect if user has reached the end of scroll
  useEffect(() => {
    const container = scrollRef.current;

    const handleScroll = () => {
      if (container) {
        const isBottom =
          container.scrollTop + container.clientHeight >= container.scrollHeight - 5;
        setIsAtBottom(isBottom);
      }
    };

    container?.addEventListener('scroll', handleScroll);
    return () => container?.removeEventListener('scroll', handleScroll);
  }, []);

  const handleScrollClick = () => {
    if (scrollRef.current) {
      const cardHeight = scrollRef.current.querySelector('div > div')?.clientHeight || 100;
      scrollRef.current.scrollBy({
        top: cardHeight + 16,
        behavior: 'smooth',
      });
    }
  };

  const handleScrollUpClick = () => {
    if (scrollRef.current) {
      const cardHeight = scrollRef.current.querySelector('div > div')?.clientHeight || 100;
      scrollRef.current.scrollBy({
        top: -cardHeight - 16,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="w-full font-poppins relative">
      <Card className="w-full bg-white dark:bg-neutral-900 shadow-xl rounded-xl !py-0 pb-6  ">
        <CardContent className="p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-800 dark:text-neutral-100">
                Latest Design Uploads
              </h2>
              <p className="text-sm text-slate-600 dark:text-neutral-400">
                Showing the 5 most recent design uploads
              </p>
            </div>
          </div>

          <div
            ref={scrollRef}
            className="max-h-[400px] overflow-y-auto space-y-4 scrollbar-hidden"
          >
            {recentDesigns.length > 0 ? (
              recentDesigns.map((design, idx) => {
                const user = userDetails[design.user] || {};
                return (
                  <div
                    key={design._id}
                    className={`rounded-lg p-4 border ${
                      theme === 'dark'
                        ? 'bg-neutral-800 border-neutral-700 text-white'
                        : 'bg-gray-50 border-gray-200 text-gray-800'
                    } shadow-md`}
                  >
                    <div className="flex !flex-col sm:flex-row justify-between gap-4">
                      <div>

                      <div className="flex justify-between items-center">
                        <h3 className="text-sm font-semibold  text-gray-900 dark:text-neutral-100">
                          {design.selectedBrief.name || 'Untitled Design'}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Uploaded on: {new Date(design.createdAt).toLocaleDateString()}
                        </p>
                      </div>

                      {/* icons */}
                      <div className="flex items-center gap-2 my-1 text-[8px]">
                      <p
                        className={`flex items-center gap-1 font-medium px-1.5 py-0.5 rounded-full border ${
                          design.status === "pending"
                            ? "text-yellow-500 border-yellow-500" // Yellow for Pending
                            : design.status === "approved"
                            ? "text-green-500 border-green-500" // Green for Approved
                            : design.status === "rejected"
                            ? "text-red-500 border-red-500" // Red for Rejected
                            : "text-gray-500 border-gray-500"
                        }`}
                      >
                        {/* Icon */}
                        {design.status === "pending" && <FaClock className="text-[12px]" />}
                        {design.status === "approved" && <FaCheck className="text-[12px]" />}
                        {design.status === "rejected" && <FaTimes className="text-[12px]" />}
                        {design.status}
                      </p>
                    </div>


                      </div>
                     
                      

                      {design.files && design.files.length > 0 && (
                        <div className="flex justify-center items-center gap-2 overflow-x-auto max-w-full sm:max-w-full">
                          {/* Display first 2 files */}
                          {design?.files.slice(0, 2).map((file, i) => (
                            <img
                              key={i}
                              src={`${imgurl}${file.url}`}
                              alt={`Design file ${i + 1}`}
                              className="w-16 h-16 rounded-md object-cover border border-gray-300 shadow-sm"
                            />
                          ))}

                          {/* Show + remaining if there are more than 2 files */}
                          {design?.files.length > 2 && (
                            <div className="flex items-center justify-center text-xs font-medium bg-gray-200 text-gray-700 rounded-full px-2 py-1 shadow-sm">
                              +{design.files.length - 2} remaining
                            </div>
                          )}
                        </div>
                      )}

                      <div className="text-left text-sm flex items-center gap-2">
                        <p className="font-medium text-gray-900 dark:text-neutral-100">
                          {user.name || 'Unknown User'}
                        </p>{' '}
                        -{' '}
                        <p className="text-xs text-gray-400">{user.email || ''}</p>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-center text-gray-500 dark:text-gray-400 text-sm">
                No recent designs uploaded.
              </p>
            )}
          </div>
        </CardContent>

        {/* Scroll icon at bottom */}
        {recentDesigns.length > 2 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{
              opacity: 1,
              y: 0,
              transition: { delay: 0.5 },
            }}
            className="absolute left-1/2 bottom-2 transform -translate-x-1/2 z-50 cursor-pointer"
            onClick={isAtBottom ? handleScrollUpClick : handleScrollClick}
          >
            <motion.div
              animate={{
                y: isAtBottom ? [5, 0, 5] : [0, 5, 0],
                opacity: [0.6, 1, 0.6],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="flex justify-center"
            >
              <ChevronDown
                className={`w-4 h-4 text-gray-500 dark:text-gray-400 transform ${
                  isAtBottom ? 'rotate-180' : ''
                }`}
              />
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
              {isAtBottom ? 'Scroll up' : 'Scroll for more'}
            </motion.p>
          </motion.div>
        )}
      </Card>
    </div>
  );
};

export default Adminrecentsupload;
