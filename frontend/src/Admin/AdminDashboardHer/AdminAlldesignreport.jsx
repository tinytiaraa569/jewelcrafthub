import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import axios from 'axios';
import { backendurl } from '@/server';
import { Card, CardContent } from '@/components/ui/card';
import { useTheme } from '@/components/ui/ThemeProvider';

ChartJS.register(ArcElement, Tooltip, Legend);

const AdminAlldesignreport = () => {
  const [designsData, setDesignsData] = useState([]);
  const { theme } = useTheme();

  useEffect(() => {
    const fetchDesigns = async () => {
      try {
        const response = await axios.get(`${backendurl}/userdesign/user-design/all-designs`, {
          withCredentials: true,
        });
        setDesignsData(response.data.designs || []);
      } catch (error) {
        console.error('Error fetching designs data:', error);
      }
    };
    fetchDesigns();
  }, []);

  // Count approved, pending, and rejected files
  const approved = designsData.flatMap(design => design.files || []).filter(file => file.status === 'approved').length;
  const pending = designsData.flatMap(design => design.files || []).filter(file => file.status === 'pending').length;
  const rejected = designsData.flatMap(design => design.files || []).filter(file => file.status === 'rejected').length;

  const borderColor = theme === 'dark'
  ? ['#3f3f46', '#3f3f46', '#3f3f46'] // neutral-700 for dark
  : ['#e2e8f0', '#e2e8f0', '#e2e8f0'];
  const data = {
    labels: ['Approved', 'Pending', 'Rejected'],
    datasets: [
      {
        label: 'File Status',
        data: [approved, pending, rejected],
        backgroundColor: ['#22c55e', '#facc15', '#ef4444'],
        borderColor: "#111827", // Simple white borders
        borderWidth: 1, // Thicker border for visibility
        // hoverOffset: 10, // Optional: adds nice spacing on hover
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: theme === 'dark' ? '#e2e8f0' : '#334155', // slate-100 vs slate-700
          font: {
            size: 14,
            family: 'Poppins',
          },
        },
      },
    },
  };

  return (
    <div className="w-[98%] mx-auto ">
      <Card className="bg-white dark:bg-neutral-900 shadow-xl rounded-2xl py-6 font-poppins ">
              <CardContent className="space-y-4">
                <div className='!mb-2'>
                  <h2 className="text-2xl font-bold text-slate-800 dark:text-neutral-100">
                    Design Status
                  </h2>
                  <p className="text-sm text-slate-600 dark:text-neutral-400">
                  View file approvals, pending, and rejections.
                  </p>
                </div>



                {/* Stats Summary */}
                <div className="flex justify-end items-center gap-8 text-center">
                <div className='flex gap-2'>
                  <p className="text-sm text-slate-500 dark:text-neutral-400">Approved : </p>
                  <p className="text-green-600 text-sm font-semibold">{approved}</p>
                </div>
                <div  className='flex gap-2'>
                  <p className="text-sm text-slate-500 dark:text-neutral-400">Pending : </p>
                  <p className="text-yellow-500 text-sm font-semibold">{pending}</p>
                </div>
                <div  className='flex gap-2'>
                  <p className="text-sm text-slate-500 dark:text-neutral-400">Rejected : </p>
                  <p className="text-red-500 text-sm font-semibold">{rejected}</p>
                </div>
              </div>
          
                <div className="flex justify-center items-center w-full max-w-lg mx-auto max-h-[390px]  dark:bg-neutral-800 py-1.5  rounded-xl shadow-inner">
                    <Pie data={data} options={options} />
                </div>
          
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAlldesignreport;
