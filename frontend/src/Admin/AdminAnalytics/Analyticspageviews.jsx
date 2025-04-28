import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { backendurl } from '@/server';

const Analyticspageviews = () => {
  const [pageViewData, setPageViewData] = useState([]);
  const [filter, setFilter] = useState('1month');  // Default filter for 1 month
  const [currentPage, setCurrentPage] = useState(1);  // Track current page for pagination
  const itemsPerPage = 5;  // Show 5 items per page

  const frontendUrl = 'https://jewelcrafthub.vercel.app'; // Get the frontend URL from environment variable

  useEffect(() => {
    // Fetch page views for all pages when the component mounts or filter changes
    const fetchPageViews = async () => {
      try {
        const response = await axios.get(`${backendurl}/analytics/get-all-page-views`, {
          params: {
            filter: filter,  // Send the filter as a query parameter
          },
        });
        if (response.data.success) {
          setPageViewData(response.data.data);  // Set the page view data from the response
        } else {
          console.error('Error fetching page view data:', response.data.error);
        }
      } catch (error) {
        console.error('Error fetching page view data:', error);
      }
    };

    fetchPageViews();
  }, [filter, frontendUrl]);  // Dependency array - re-run effect when filter changes

  // Paginate the data
  const indexOfLastPage = currentPage * itemsPerPage;
  const indexOfFirstPage = indexOfLastPage - itemsPerPage;
  const currentPageData = pageViewData.slice(indexOfFirstPage, indexOfLastPage);

  // Handle page change
  const handlePageChange = (direction) => {
    if (direction === 'next' && currentPage * itemsPerPage < pageViewData.length) {
      setCurrentPage(currentPage + 1);
    } else if (direction === 'prev' && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="w-[98%] mx-auto">
    
    <div className="overflow-hidden bg-white dark:bg-neutral-900 shadow-xl rounded-2xl p-4 md:p-6 font-poppins border border-gray-200 dark:border-neutral-800">
      <h2 className="text-xl font-bold text-slate-800 dark:text-neutral-100 mb-1">
        Page View Analytics
      </h2>

      {/* Filter Dropdown */}
        <div className="mt-1 mb-5 flex items-center gap-5">
        <label htmlFor="filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 ">
            Select Time Period:
        </label>
        <select
            id="filter"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border border-gray-300 rounded-md shadow-sm dark:bg-neutral-700 dark:text-white p-1.5 text-sm transition-all ease-in-out duration-200"
        >
            <option value="1month">1 Month</option>
            <option value="3months">3 Months</option>
            <option value="6months">6 Months</option>
        </select>
        </div>


      {/* Table to display page view data */}
      <div className="overflow-x-auto shadow-md rounded-lg bg-white dark:bg-neutral-800 mb-6">
        <table className="min-w-full table-auto border-separate border-spacing-0">
            <thead className="bg-gray-100 dark:bg-neutral-700 text-left">
            <tr>
                <th className="px-4 py-3 text-sm font-medium text-gray-700 dark:text-white border-b">Page URL</th>
                <th className="px-4 py-3 text-sm font-medium text-gray-700 dark:text-white border-b">Page Views</th>
            </tr>
            </thead>
            <tbody>
            {currentPageData.length === 0 ? (
                <tr>
                <td colSpan="2" className="px-4 py-4 text-center text-sm text-gray-500 dark:text-gray-300">
                    No data available
                </td>
                </tr>
            ) : (
                currentPageData.map((data, index) => (
                <tr key={index} className="border-t hover:bg-gray-50 dark:hover:bg-neutral-600 transition-all duration-200">
                    {/* Apply classes to control width and text overflow */}
                    <td className="px-4 py-4 text-sm text-gray-800 dark:text-gray-200 max-w-xs overflow-hidden text-ellipsis whitespace-nowrap">
                    {frontendUrl}{data.pageUrl}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-800 dark:text-gray-200">{data.pageViews} views</td>
                </tr>
                ))
            )}
            </tbody>
        </table>
        </div>



      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-6">
        <button
          onClick={() => handlePageChange('prev')}
          disabled={currentPage === 1}
          className="cursor-pointer px-3.5 py-1.5 bg-gray-300 text-gray-900 rounded-lg disabled:opacity-50 dark:bg-neutral-700 dark:text-white hover:bg-gray-400 transition-all duration-200"
        >
          &lt; Previous
        </button>
        <div className="text-sm text-gray-700 dark:text-gray-300">
          Page {currentPage} of {Math.ceil(pageViewData.length / itemsPerPage)}
        </div>
        <button
          onClick={() => handlePageChange('next')}
          disabled={currentPage * itemsPerPage >= pageViewData.length}
          className="cursor-pointer px-3.5 py-1.5 bg-gray-300 text-gray-900 rounded-lg disabled:opacity-50 dark:bg-neutral-700 dark:text-white hover:bg-gray-400 transition-all duration-200"
        >
          Next &gt;
        </button>
      </div>
    </div>
    </div>

  );
};

export default Analyticspageviews;
