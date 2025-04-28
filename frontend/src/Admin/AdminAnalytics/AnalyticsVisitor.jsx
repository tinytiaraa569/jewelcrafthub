import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { backendurl } from '@/server'; // Ensure correct backend URL
import { useTheme } from '@/components/ui/ThemeProvider';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const AnalyticsVisitor = () => {
  const [visitorData, setVisitorData] = useState([]); // Stores the fetched visitor data
  const [loading, setLoading] = useState(true); // Loading state for the chart
  const [error, setError] = useState(null); // Error state for handling failures
  const [activeUsers, setActiveUsers] = useState(0); // Active users count
  const [filter, setFilter] = useState('1month'); // Default filter set to "1month"
  const { theme } = useTheme();

  // Fetch data when filter changes
  useEffect(() => {
    const fetchVisitorData = async () => {
      try {
        const response = await axios.get(`${backendurl}/analytics/get-daily-visitors?filter=${filter}`);
        console.log("Response Data:", response); // Log the response data

        if (response.data.success && response.data.data.length > 0) {
          setVisitorData(response.data.data);

          const totalActiveUserCount = response.data.data.reduce((total, row) => total + row.activeUsers, 0);
          setActiveUsers(totalActiveUserCount);
        } else {
          console.log('No data available for the selected filter');
        }

        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError('Failed to fetch data');
        setLoading(false);
      }
    };

    fetchVisitorData();
  }, [filter]); // Triggered when filter changes

  // Prepare chart data for rendering
  const chartData = {
    labels: visitorData.map(row => row.date), // Date already in YYYYMMDD format
    datasets: [
      {
        label: 'Active Users',
        data: visitorData.map(row => row.activeUsers),
        borderColor: theme === 'dark' ? '#FF6347' : '#FF4500', // Adjust border color for dark mode
        backgroundColor: theme === 'dark' ? 'rgba(255, 99, 71, 0.2)' : 'rgba(255, 99, 71, 0.3)', // Adjust background color for dark mode
        fill: true,
        tension: 0.4,  // Smooth curve for the line
      },
    ],
  };

  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false, // Ensures the height stays static
    plugins: {
      title: {
        display: true,
        text: 'Active Users Over Time',
        color: theme === 'dark' ? '#ffffff' : '#000000', // Title color for dark mode
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        callbacks: {
          label: function(tooltipItem) {
            return `${tooltipItem.dataset.label}: ${tooltipItem.raw}`;
          },
        },
      },
    },
    scales: {
      x: {
        type: 'category',
        title: {
          display: true,
          text: 'Date (YYYYMMDD)', // Axis title
          color: theme === 'dark' ? '#ffffff' : '#000000', // Axis title color for dark mode
        },
        ticks: {
          autoSkip: true, // Skip labels to avoid overlap
          maxRotation: 90, // Rotate labels if necessary
          minRotation: 45, // Rotate labels if necessary
          color: theme === 'dark' ? '#ffffff' : '#000000', // Label color for dark mode
        },
      },
      y: {
        min: 0,
        ticks: {
          beginAtZero: true,
          callback: (value) => value.toLocaleString(), // Format y-axis numbers with commas (e.g., 1,000)
          color: theme === 'dark' ? '#ffffff' : '#000000', // Label color for dark mode
        },
      },
    },
  };

  // If data is still loading, show a loading spinner or skeleton loader
  if (loading) {
    return (
      <div className="space-y-4">
        <div className="w-1/3 h-6 bg-gray-300 animate-pulse rounded"></div>
        <div className="w-1/2 h-4 bg-gray-200 animate-pulse rounded"></div>
        <div className="w-full h-72 bg-gray-200 animate-pulse rounded"></div>
      </div>
    );
  }

  // If an error occurred, show an error message
  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className={`w-[98%] px-5 pt-2 pb-4 bg-white ${theme === 'dark' ? 'dark:bg-neutral-900' : ''} shadow-xl rounded-[10px] border ${theme === 'dark' ? 'dark:border-neutral-800' : 'border-gray-200'}`}>
      <div className="mb-1 mt-2">
        <h2 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-700'}`}>
          🌐 Visitors Report
        </h2>
      </div>

      {/* Report Details Section */}
      <div className="flex items-center space-x-6 text-gray-700 mb-3">
        <div className="flex items-center space-x-2">
          <span className="text-green-500">•</span>
          <h4 className="text-sm font-medium dark:text-neutral-600">Active Users:</h4>
          <span className="text-sm font-semibold text-green-600">{activeUsers}</span>
        </div>
      </div>

      {/* Filter Section */}
      <div className="mb-3">
        <label htmlFor="filter" className="mr-2">Select Time Period:</label>
        <select
          id="filter"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border px-2 py-1 rounded dark:bg-neutral-800 dark:text-neutral-200"
        >
          <option value="1month">1 Month</option>
          <option value="3months">3 Months</option>
          <option value="6months">6 Months</option>
        </select>
      </div>

      {/* Chart */}
      <div className="w-full h-[330px] mt-2 cursor-pointer">
        <Line data={chartData} options={chartOptions} height={320} />
      </div>
    </div>
  );
};

export default AnalyticsVisitor;
