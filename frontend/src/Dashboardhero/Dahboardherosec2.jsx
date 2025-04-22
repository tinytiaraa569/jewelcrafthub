import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { backendurl } from "@/server";
import { toast } from "sonner";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { Card, CardContent } from "@/components/ui/card";
import { useTheme } from "@/components/ui/ThemeProvider";
import { FaRegSadTear } from "react-icons/fa";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboardherosec2 = () => {
  const [monthlyData, setMonthlyData] = useState([]);
  const { user } = useSelector((state) => state.auth);
      const { theme, setTheme } = useTheme();
  

  useEffect(() => {
    fetchUserDesigns();
  }, []);

  const fetchUserDesigns = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token || !user?._id) {
        toast.error("Please log in to view your designs.");
        return;
      }

      const res = await axios.get(
        `${backendurl}/userdesign/user-design/my-designs/${user._id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const allDesigns = res.data.designs || [];

      const countsByMonth = {};
      allDesigns.forEach((design) => {
        const createdAt = new Date(design.createdAt);
        const key = `${createdAt.toLocaleString("default", {
          month: "short",
        })}-${createdAt.getFullYear()}`;

        const fileCount = design?.files?.length || 0;
        const approvedCount = design?.files?.filter(f => f.status === "approved")?.length || 0;

        if (!countsByMonth[key]) {
          countsByMonth[key] = { uploaded: 0, approved: 0 };
        }

        countsByMonth[key].uploaded += fileCount;
        countsByMonth[key].approved += approvedCount;
      });

      const current = new Date();
      const labels = [];
      for (let i = -2; i <= 3; i++) {
        const d = new Date(current.getFullYear(), current.getMonth() + i, 1);
        const label = `${d.toLocaleString("default", {
          month: "short",
        })}-${d.getFullYear()}`;
        labels.push(label);
      }

      const data = labels.map((label) => ({
        label,
        uploaded: countsByMonth[label]?.uploaded || 0,
        approved: countsByMonth[label]?.approved || 0,
      }));

      setMonthlyData(data);
    } catch (err) {
      console.log("Error fetching designs:", err);
    }
  };

  const totalUploaded = monthlyData.reduce((sum, item) => sum + item.uploaded, 0);
  const totalApproved = monthlyData.reduce((sum, item) => sum + item.approved, 0);
  const maxValue = Math.max(...monthlyData.map((item) => item.uploaded), 10);
  const roundedMax = Math.ceil(maxValue / 10) * 10;

  const chartData = {
    labels: monthlyData.map((item) => item.label),
    datasets: [
      {
        label: "Files Uploaded",
        data: monthlyData.map((item) => item.uploaded),
        backgroundColor: "#2563eb", // Tailwind blue-500
        barThickness: 20,
        borderRadius: 8,
      },
      {
        label: "Files Approved",
        data: monthlyData.map((item) => item.approved),
        backgroundColor: "#10b981",
        barThickness: 20,
        borderRadius: 8,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        labels: {
          color: theme === "dark" ? "#f3f4f6" : "#4B5563", // light: gray-600, dark: gray-100
          font: {
            family: "Poppins",
          },
        },
      },
      tooltip: {
        backgroundColor: theme === "dark" ? "#111827" : "#1f2937", // darker in dark mode
        titleColor: "#fbbf24",
        bodyColor: "#ffffff",
        cornerRadius: 10,
        padding: 12,
        titleFont: {
          family: "Poppins",
        },
        bodyFont: {
          family: "Poppins",
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Months",
          color: theme === "dark" ? "#f3f4f6" : "#4B5563",
          font: {
            size: 14,
            weight: "bold",
            family: "Poppins",
          },
        },
        ticks: {
          color: theme === "dark" ? "#f3f4f6" : "#4B5563",
          font: {
            family: "Poppins",
          },
        },
        grid: {
          color: theme === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(148, 163, 184, 0.2)",
        },
      },
      y: {
        beginAtZero: true,
        min: 0,
        max: roundedMax,
        ticks: {
          stepSize: 10,
          color: theme === "dark" ? "#f3f4f6" : "#4B5563",
          font: {
            family: "Poppins",
          },
        },
        title: {
          display: true,
          text: "File Count",
          color: theme === "dark" ? "#f3f4f6" : "#4B5563",
          font: {
            size: 14,
            weight: "bold",
            family: "Poppins",
          },
        },
        grid: {
          color: theme === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(148, 163, 184, 0.2)",
        },
      },
    },
  };
  

  return (
    <div className="w-full">

    <Card className="!w-full bg-white dark:bg-neutral-900 shadow-xl rounded-xl !py-1 !pb-3 !font-poppins">
      <CardContent className="p-6 space-y-6">
        <div className="mb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-800 dark:text-blue-600">
                Upload Activity
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Design uploads over the past 6 months
              </p>
            </div>
          </div>

          <div className="mt-2 flex flex-col sm:flex-row items-center gap-6 sm:gap-10">
            <div className="text-center">
              <p className="text-md font-medium text-yellow-500">
                Total Files Uploaded:
                <span className="ml-2 text-md font-semibold text-slate-900 dark:text-slate-200">
                  {totalUploaded}
                </span>
              </p>
            </div>
            <div className="text-center">
              <p className="text-md font-medium text-green-500">
                Total Files Approved:
                <span className="ml-2 text-md font-semibold text-slate-900 dark:text-slate-200">
                  {totalApproved}
                </span>
              </p>
            </div>
          </div>
        </div>

        {
          monthlyData.length === 0 ? (
              <>
               <div className="w-full h-[360px] dark:bg-neutral-800 dark:rounded-[10px] px-4 flex flex-col items-center justify-center text-center py-16 text-slate-600 dark:text-slate-300 font-poppins">
                <FaRegSadTear size={40} className="mb-4 text-blue-500" />
                <p className="text-lg font-semibold">Start Uploading</p>
                <p className="text-sm mt-1">Once you start uploading your designs, they will appear here for tracking.</p>
              </div>

              
              </>
          )
          :
          <>
            <div className="w-full h-[360px] dark:bg-neutral-800 p-4 rounded-xl shadow-inner">
            <Bar data={chartData} options={chartOptions} />
          </div>
          </>
          
        }

       
      </CardContent>
    </Card>
    </div>

  );
};

export default Dashboardherosec2;
