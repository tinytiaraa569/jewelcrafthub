import { Card, CardContent } from '@/components/ui/card';
import { backendurl } from '@/server';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Title,
} from 'chart.js';
import { FaRegSadTear } from 'react-icons/fa';
import { useTheme } from '@/components/ui/ThemeProvider';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend, Title);

const Dashboardwithdrawal = () => {
  const [withdrawals, setWithdrawals] = useState([]);
  const { user } = useSelector((state) => state.auth);
  const { theme } = useTheme();

  const fetchWithdrawals = async () => {
    try {
      const res = await axios.get(`${backendurl}/withdrawal/user/${user._id}/get-withdrawals`);
      setWithdrawals(res.data.withdrawals || []);
    } catch (err) {
      console.error('Failed to fetch withdrawals:', err);
    }
  };

  useEffect(() => {
    if (user?._id) {
      fetchWithdrawals();
    }
  }, [user?._id]);

  const chartData = {
    labels: withdrawals.map((item) => new Date(item.createdAt).toLocaleDateString()),
    datasets: [
      {
        label: 'Withdrawal Points',
        data: withdrawals.map((item) => item.amount),
        fill: true,
        borderColor: '#3b82f6',
        backgroundColor: theme === 'dark' ? 'rgba(96,165,250,0.1)' : 'rgba(37,99,235,0.1)',
        tension: 0.4,
        pointRadius: 5,
        pointHoverRadius: 7,
        pointBackgroundColor: theme === 'dark' ? '#60a5fa' : '#3b82f6',
        pointBorderColor: '#ffffff',
        pointHoverBorderWidth: 2,
      },
    ],
  };

  const fontColor = theme === 'dark' ? '#e5e7eb' : '#1f2937';
  const secondaryColor = theme === 'dark' ? '#cbd5e1' : '#475569';

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: fontColor,
          font: {
            family: 'Poppins',
            size: 14,
          },
        },
      },
     
      tooltip: {
        callbacks: {
          label: function (context) {
            const status = withdrawals[context.dataIndex]?.status || 'Unknown';
            const amount = context.parsed.y;
            return ` ${amount} Points - Status: ${status}`;
          },
        },
        backgroundColor: theme === 'dark' ? '#1e293b' : '#f8fafc',
        titleColor: fontColor,
        bodyColor: fontColor,
        borderColor: theme === 'dark' ? '#334155' : '#cbd5e1',
        borderWidth: 1,
        bodyFont: {
          family: 'Poppins',
        },
        titleFont: {
          family: 'Poppins',
          weight: '600',
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Date',
          color: fontColor,
          font: {
            family: 'Poppins',
            size: 14,
            weight: '600',
          },
        },
        ticks: {
          color: secondaryColor,
          font: {
            family: 'Poppins',
          },
        },
        grid: {
          color: theme === 'dark' ? '#334155' : '#e2e8f0',
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 5,
          color: secondaryColor,
          font: {
            family: 'Poppins',
          },
        },
        grid: {
          color: theme === 'dark' ? '#334155' : '#e2e8f0',
        },
        title: {
          display: true,
          text: 'Points',
          color: fontColor,
          font: {
            family: 'Poppins',
            size: 14,
            weight: '600',
          },
        },
      },
    },
  };

  return (
    <div className="w-[98%]">
      <Card className="w-full bg-white dark:bg-neutral-900 shadow-xl rounded-xl !py-0 !pt-1 !pb-4 font-poppins">
        <CardContent className="p-4 space-y-6">
          <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-800 dark:text-blue-500 font-poppins">
                Withdrawal Status
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-300 font-poppins">
                Overview of your withdrawal history
              </p>
            </div>
          </div>

          {withdrawals.length > 0 ? (
            <div className="w-full h-[315px] dark:bg-neutral-800 dark:rounded-[10px] dark:px-3 dark:py-3 ">
              <Line data={chartData} options={chartOptions} />
            </div>
          ) : (
            <div className="w-full h-[315px] dark:bg-neutral-800 dark:rounded-[10px] dark:px-3 dark:py-3 flex flex-col items-center justify-center text-center py-16 text-slate-600 dark:text-slate-300 font-poppins">
              <FaRegSadTear size={40} className="mb-4 text-blue-500" />
              <p className="text-lg font-medium">No withdrawal requests yet</p>
              <p className="text-sm">Kindly submit a withdrawal request to view it here.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboardwithdrawal;
