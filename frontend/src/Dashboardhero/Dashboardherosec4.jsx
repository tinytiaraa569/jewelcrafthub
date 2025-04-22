'use client';

import { backendurl } from '@/server';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useTheme } from '@/components/ui/ThemeProvider';
import { Card, CardContent } from '@/components/ui/card';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboardherosec4 = () => {
  const [designs, setDesigns] = useState([]);
  const [briefs, setBriefs] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const { user } = useSelector((state) => state.auth);
  const { theme } = useTheme();

  useEffect(() => {
    fetchUserDesigns();
    fetchBriefs();
    fetchCategories();
  }, []);

  const fetchUserDesigns = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token || !user?._id) return;
      const res = await axios.get(
        `${backendurl}/userdesign/user-design/my-designs/${user._id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setDesigns(res.data.designs || []);
    } catch (err) {
      console.error('Error fetching user designs', err);
    }
  };

  const fetchBriefs = async () => {
    try {
      const { data } = await axios.get(`${backendurl}/brief/get-all-briefs`);
      setBriefs(data.briefs || []);
    } catch (err) {
      console.error('Error fetching briefs:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${backendurl}/category/all-categories`);
      const categoryList = res.data.categories || [];
      const names = categoryList.map((cat) => cat.categoryName);
      setCategoryOptions(['All', ...names]);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const filteredDesigns =
    selectedCategory === 'All'
      ? designs
      : designs.filter((design) => design.category === selectedCategory);

  const briefFileCounts = {};
  const briefDesignCounts = {};

  briefs.forEach((brief) => {
    const designsForBrief = filteredDesigns.filter(
      (design) => design.selectedBrief?._id === brief._id
    );
    const totalFiles = designsForBrief.reduce(
      (count, design) => count + (design.files?.length || 0),
      0
    );
    briefFileCounts[brief._id] = totalFiles;
    briefDesignCounts[brief._id] = designsForBrief.length;
  });

  const chartData = {
    labels: briefs.slice(0, 5).map((brief) => brief.name), // Show only top 5 briefs
    datasets: [
      {
        label: 'Uploaded Files',
        data: briefs.slice(0, 5).map((brief) => briefFileCounts[brief._id] || 0),
        backgroundColor: theme === 'dark' ? '#A3E635' : '#4CAF50',
        borderColor: theme === 'dark' ? '#65A30D' : '#388E3C',
        borderWidth: 2,
        hoverBackgroundColor: theme === 'dark' ? '#84CC16' : '#2E7D32',
        hoverBorderColor: theme === 'dark' ? '#4D7C0F' : '#1B5E20',
        barThickness: 30,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: {
          display: true,
          color: theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.1)',
        },
        title: {
          display: true,
          text: 'Brief Name',
          font: {
            size: 16,
            weight: 'bold',
            family: "'Poppins', sans-serif",
          },
          color: theme === 'dark' ? '#E5E7EB' : '#111827',
        },
        ticks: {
          font: { size: 12, family: "'Poppins', sans-serif" },
          color: theme === 'dark' ? '#D1D5DB' : '#374151',
        },
      },
      y: {
        grid: {
          display: true,
          color: theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.1)',
        },
        title: {
          display: true,
          text: 'Files Uploaded',
          font: {
            size: 16,
            weight: 'bold',
            family: "'Poppins', sans-serif",
          },
          color: theme === 'dark' ? '#E5E7EB' : '#111827',
        },
        ticks: {
          font: { size: 12, family: "'Poppins', sans-serif" },
          color: theme === 'dark' ? '#D1D5DB' : '#374151',
        },
      },
    },
    plugins: {
      title: {
        display: true,
        text: 'Uploaded Files per Brief',
        font: { size: 16, weight: 'bold', family: "'Poppins', sans-serif" },
        color: theme === 'dark' ? '#F3F4F6' : '#1F2937',
        padding:10
      },
      tooltip: {
        backgroundColor: theme === 'dark' ? '#1F2937' : '#F9FAFB',
        titleColor: theme === 'dark' ? '#F3F4F6' : '#111827',
        bodyColor: theme === 'dark' ? '#E5E7EB' : '#1F2937',
        borderColor: theme === 'dark' ? '#374151' : '#E5E7EB',
        borderWidth: 1,
      },
      legend: { display: false },
    },
  };

  return (
    <div className="w-[98%] ">
      <Card className=" dark:bg-neutral-900 shadow-lg rounded-xl py-6 px-4 font-poppins">
      <div className="mb-4 flex justify-center">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-800 dark:text-blue-500">
                    Design Distribution by Category
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                    Filter and view the designs uploaded by category over time.
                </p>
              </div>
            </div>
          </div>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Filter by Category:
              </label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[200px] border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-sm text-gray-900 dark:text-white rounded-md shadow-sm">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-neutral-800 text-gray-900 dark:text-white rounded-md">
                  {categoryOptions.map((cat) => (
                    <SelectItem
                      key={cat}
                      value={cat}
                      className="cursor-pointer hover:bg-gray-100 dark:hover:bg-neutral-700"
                    >
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {loading ? (
            <div className="space-y-4">
              <div className="w-1/3 h-6 bg-gray-300 dark:bg-neutral-700 animate-pulse rounded" />
              <div className="w-1/2 h-4 bg-gray-200 dark:bg-neutral-600 animate-pulse rounded" />
              <div className="w-full h-72 bg-gray-200 dark:bg-neutral-700 animate-pulse rounded" />
            </div>
          ) : (
            <div className="h-[400px] w-full dark:bg-neutral-800 dark:rounded-[10px]">
              <Bar data={chartData} options={chartOptions} />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboardherosec4;
