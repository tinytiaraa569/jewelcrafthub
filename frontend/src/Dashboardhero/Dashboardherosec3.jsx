import { backendurl } from '@/server';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip as ChartTooltip,
  Legend as ChartLegend,
} from 'chart.js';
import { Card, CardContent } from '@/components/ui/card';
import { useTheme } from '@/components/ui/ThemeProvider';
import { FaRegSadTear } from 'react-icons/fa';

// Register Chart.js
ChartJS.register(ArcElement, ChartTooltip, ChartLegend);

const Dashboardherosec3 = () => {
  const { user } = useSelector((state) => state.auth);
  const [designs, setDesigns] = useState([]);
    const { theme, setTheme } = useTheme();
  

  useEffect(() => {
    fetchUserDesigns();
  }, []);

  const fetchUserDesigns = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token || !user?._id) return;

      const res = await axios.get(
        `${backendurl}/userdesign/user-design/my-designs/${user._id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setDesigns(res.data.designs);
    } catch {
      console.log('not working');
    }
  };

  const statusMap = {};
  designs.forEach((d) => {
    statusMap[d.status] = (statusMap[d.status] || 0) + 1;
  });

  const statusLabels = Object.keys(statusMap);
  const statusValues = Object.values(statusMap);
  const statusColors = [
    '#60A5FA', // blue-400
    '#FBBF24', // yellow-400
    '#34D399', // green-400
    '#F87171', // red-400
    '#A78BFA', // purple-400
    '#F472B6', // pink-400
  ];

  const pieData = {
    labels: statusLabels,
    datasets: [
      {
        label: 'Design Status',
        data: statusValues,
        backgroundColor: statusColors,
        borderColor: '#111827', // dark border (gray-900)
        borderWidth: 1,
      },
    ],
  };

  const pieOptions = {
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
            color: theme === 'dark' ? '#e5e5e5' : '#334155',
          font: { size: 13, family: "Poppins" },
          padding: 20,
          
        },
      },
      
      tooltip: {
        backgroundColor: '#1f2937',
        titleColor: '#fff',
        bodyColor: '#f3f4f6',
        font: { family: "Poppins" },
        callbacks: {
          label: function (context) {
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const value = context.raw;
            const percentage = ((value / total) * 100).toFixed(1);
            return `${context.label}: ${value} designs (${percentage}%)`;
          },
        },
      },
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div className="w-[98%]">
      <Card className="!w-full bg-white dark:bg-neutral-900 shadow-xl rounded-xl !py-1 !pb-3 !font-poppins">
        <CardContent className="p-6 space-y-6">
          <div className="mb-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-800 dark:text-blue-600">
                  Design Status Distribution
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Design uploads over the past 6 months
                </p>
              </div>
            </div>
          </div>

          <div className='mt-6.5'>
            {designs.length > 0 ? (
              <div className="w-full max-w-3xl mx-auto h-[380px]">
                <Pie data={pieData} options={pieOptions} />
              </div>
            ) : (
              <div className="w-full h-[380px] dark:bg-neutral-800 dark:rounded-[10px] px-4 flex flex-col items-center justify-center text-center py-16 text-slate-600 dark:text-slate-300 font-poppins">
              <FaRegSadTear size={40} className="mb-4 text-blue-500" />
              <p className="text-lg font-semibold">No Design Status to Show</p>
              <p className="text-sm mt-1">You haven’t uploaded any designs yet.</p>
              <p className="text-sm">Once designs are submitted, their approval status will be visualized here.</p>
            </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboardherosec3;
