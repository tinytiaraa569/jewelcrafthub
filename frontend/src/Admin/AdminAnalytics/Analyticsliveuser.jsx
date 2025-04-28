import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
} from 'chart.js';
import { backendurl } from '@/server';
import { Card, CardContent } from '@/components/ui/card';
import { useTheme } from '@/components/ui/ThemeProvider';

// Register chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

const Analyticsliveuser = () => {
  const [liveCount, setLiveCount] = useState(0); // Track live active users
  const [topCountries, setTopCountries] = useState([]); // Track top countries and active users
  const { theme } = useTheme();

  const [chartData, setChartData] = useState({
    labels: Array.from({ length: 30 }, (_, i) => `${30 - i} min ago`), // Default X-axis labels
    datasets: [
      {
        label: 'Active Users',
        data: Array(30).fill(0), // Default dataset
        backgroundColor: 'rgba(75, 192, 192, 0.6)', // Light mode color
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  });
  const [isLoading, setIsLoading] = useState(true); // Loading state

  // Fetch live active user data
  const getRealTimeActiveUsers = async () => {
    try {
      const response = await axios.get(`${backendurl}/analytics/getall-live-users`); // Assuming this is your endpoint
      const data = response.data.data; // Get the data from the response
      console.log('Response from server:', data); 

      const totalActiveUsers = data.liveUsers; // Directly get the liveUsers count
      const countries = data.liveUsersByCountry || []; // Ensure there's data for liveUsersByCountry

      setTopCountries(countries); // Set the countries with their active users
      setLiveCount(totalActiveUsers); // Set the live active users count
      setIsLoading(false); // Data has been loaded
      return totalActiveUsers; // Return the total active users at this moment
    } catch (error) {
      console.error('Error fetching real-time data:', error);
      setIsLoading(false); // Even on error, stop the loader
      return 0; // Return 0 on error
    }
  };

  useEffect(() => {
    const updateChartData = async () => {
      const activeUsers = await getRealTimeActiveUsers();

      setChartData((prevData) => {
        const updatedData = [...prevData.datasets[0].data.slice(1), activeUsers]; // Shift data to the left and add the new value

        return {
          labels: Array.from({ length: 30 }, (_, i) => `${30 - i} min ago`), // Keep the labels
          datasets: [
            {
              ...prevData.datasets[0],
              data: updatedData, // Update the dataset
            },
          ],
        };
      });
    };

    // Update data every minute
    updateChartData(); // Initial fetch
    const interval = setInterval(updateChartData, 60 * 1000);

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        title: {
          display: true,
          text: 'Time (Minutes Ago)',
          color: theme === 'dark' ? '#fff' : '#000',
          font: {
            family: 'Poppins',  // Apply Poppins font to x-axis labels
            size: 12,  // Adjust the font size
          }, // Adjust title color based on theme
        },
        ticks: {
          maxRotation: 0,
          autoSkip: true,
          maxTicksLimit: 30,
          color: theme === 'dark' ? '#ddd' : '#555', // Tick color based on theme
          
        },
      },
      y: {
        title: {
          display: true,
          text: 'Active Users',
          color: theme === 'dark' ? '#fff' : '#000',
          font: {
            family: 'Poppins',  // Apply Poppins font to x-axis labels
            size: 12,  // Adjust the font size
          }, // Adjust title color based on theme
        },
        beginAtZero: true,
        ticks: {
          stepSize: 5, // Interval of 5
          callback: (value) => value, // Show all values
          color: theme === 'dark' ? '#ddd' : '#555', // Tick color based on theme
        },
        max: Math.ceil(Math.max(...chartData.datasets[0].data) / 5) * 5, // Round up to the nearest 5
      },
    },
    plugins: {
      legend: {
        display: false, // Hide the legend
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => `${tooltipItem.raw} active users`,
          title: () => '', // Remove the title in the tooltip
        },
        font: {
            family: 'Poppins',  // Apply Poppins font to x-axis labels
            size: 12,  // Adjust the font size
          },
      },
    },
    elements: {
      bar: {
        borderRadius: 4,
      },
    },
    layout: {
      padding: {
        left: 10,
        right: 10,
        top: 10,
        bottom: 10,
      },
    },
    font: {
      size: 14, // Set font size to 14px
      family: 'Poppins', // Use Poppins font
    },
  };

  return (
    <div className="w-[98%] mx-auto">
      <Card className="bg-white dark:bg-neutral-900 shadow-xl rounded-2xl py-6 font-poppins">
        <CardContent className="space-y-4">
          <div className="!mb-2">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-neutral-100">
              Active Users
            </h2>
            <p className="text-sm text-slate-600 dark:text-neutral-400">
              Active Users in Last 30 Minutes
            </p>
          </div>

          {isLoading ? (
            <div className="border border-gray-100 dark:border-neutral-700 bg-white dark:bg-neutral-800 shadow-lg rounded-[10px] space-y-4 p-4">
              <div className="w-1/3 h-6 bg-gray-300 dark:bg-neutral-600 animate-pulse rounded"></div>
              <div className="w-1/2 h-4 bg-gray-200 dark:bg-neutral-600 animate-pulse rounded"></div>
              <div className="w-full h-72 bg-gray-200 dark:bg-neutral-600 animate-pulse rounded"></div>
            </div>
          ) : (
            <>
              {/* Live count display */}
              <div className="text-[18px] font-[500] text-slate-900 dark:text-[gray] mt-1 ml-2">{liveCount}</div>

              {/* Chart Section */}
              <div className="mt-4 w-full h-60 cursor-pointer">
                <Bar data={chartData} options={chartOptions} />
              </div>

              {/* Top Countries Section */}
              <div className="mt-1 border-t pt-4">
                <h4 className="text-[15px] font-semibold text-[#000] dark:text-neutral-100">
                  Top Countries
                </h4>
                <div className="mt-1 space-y-2">
                  {topCountries.length > 0 ? (
                    topCountries.map((country, index) => (
                      <div key={index} className="flex justify-between">
                        <span className="text-gray-700 font-medium text-[14px] dark:text-neutral-200">
                          {country.country}
                        </span>
                        <span className="text-gray-700 font-[400] text-[14px] dark:text-neutral-300">
                          {country.activeUsers}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="text-gray-500 dark:text-neutral-400">No data available</div>
                  )}
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Analyticsliveuser;
