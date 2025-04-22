import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { backendurl } from '@/server';
import { useTheme } from '@/components/ui/ThemeProvider';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Adminhero2 = () => {
  const [designsData, setDesignsData] = useState([]);
  const [chartData, setChartData] = useState(null);
  const [range, setRange] = useState('1m');
  const { theme } = useTheme();

  useEffect(() => {
    const fetchDesigns = async () => {
      try {
        const response = await axios.get(`${backendurl}/userdesign/user-design/all-designs`, {
          withCredentials: true
        });
        setDesignsData(response.data.designs);
      } catch (error) {
        console.error('Error fetching designs data:', error);
      }
    };
    fetchDesigns();
  }, []);

  useEffect(() => {
    if (designsData.length > 0) {
      const filtered = filterByRange(designsData, range);
      const formatted = formatDataForChart(filtered, range);
      setChartData(formatted);
    }
  }, [designsData, range]);

  const filterByRange = (designs, range) => {
    const now = new Date();
    let fromDate;
    switch (range) {
      case '1m':
        fromDate = new Date(now.setMonth(now.getMonth() - 1));
        break;
      case '3m':
        fromDate = new Date(now.setMonth(now.getMonth() - 3));
        break;
      case '6m':
        fromDate = new Date(now.setMonth(now.getMonth() - 6));
        break;
      default:
        fromDate = new Date(now.setMonth(now.getMonth() - 1));
    }
    return designs.filter((design) => new Date(design.createdAt) >= fromDate);
  };

  const formatDataForChart = (designs, range) => {
    const dateGroups = {};
    const endDate = new Date();
    let startDate = new Date();

    if (range === '1m') startDate.setMonth(startDate.getMonth() - 1);
    if (range === '3m') startDate.setMonth(startDate.getMonth() - 3);
    if (range === '6m') startDate.setMonth(startDate.getMonth() - 6);

    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const formatted = d.toISOString().split('T')[0];
      dateGroups[formatted] = 0;
    }

    designs.forEach((design) => {
      const date = new Date(design.createdAt).toISOString().split('T')[0];
      const fileCount = design.files?.length || 0;
      if (dateGroups[date] !== undefined) {
        dateGroups[date] += fileCount;
      }
    });

    return {
      labels: Object.keys(dateGroups),
      datasets: [
        {
          label: 'Designs Uploads per Day',
          data: Object.values(dateGroups),
          borderColor: '#4CAF50',
          backgroundColor: 'rgba(76, 175, 80, 0.1)',
          fill: true,
          tension: 0.4
        }
      ]
    };
  };

  return (
    <div className="w-[98%]">
      <Card className="w-full bg-white dark:bg-neutral-900 shadow-xl rounded-xl py-1 pb-3 font-poppins ">
        <CardContent className="p-6 space-y-6">
          <div className="mb-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-800 dark:text-neutral-100">
                  Design Status Distribution
                </h2>
                <p className="text-sm text-slate-600 dark:text-neutral-400">
                  Design uploads over the past {range === '1m' ? '1' : range === '3m' ? '3' : '6'} months
                </p>
              </div>
            </div>
          </div>

          <div
            className={`p-4 rounded-xl shadow-md w-full max-w-4xl mx-auto transition-colors duration-300   ${
              theme === 'dark' ? 'bg-neutral-800 text-white' : 'bg-white'
            }`}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Uploads Per Day</h2>

              <Select value={range} onValueChange={(val) => setRange(val)}>
                <SelectTrigger className="w-[150px] border border-gray-300 dark:border-neutral-600">
                  <SelectValue placeholder="Select Range" />
                </SelectTrigger>
                <SelectContent className="dark:bg-neutral-800">
                  <SelectItem value="1m">Last 1 Month</SelectItem>
                  <SelectItem value="3m">Last 3 Months</SelectItem>
                  <SelectItem value="6m">Last 6 Months</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {chartData ? (
                <div className="relative w-full h-[280px] sm:h-[300px] md:h-[300px] lg:h-[300px] font-poppins">
                    <Line
                    data={chartData}
                    options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                        legend: {
                            position: 'top',
                            labels: {
                            color: theme === 'dark' ? '#E0E0E0' : '#000',
                            font: {
                                family: 'Poppins'
                            }
                            }
                        },
                        title: { display: false }
                        },
                        scales: {
                        x: {
                            ticks: {
                            color: theme === 'dark' ? '#E0E0E0' : '#000',
                            maxTicksLimit: 12,
                            font: {
                                family: 'Poppins'
                            }
                            },
                            grid: {
                            color: theme === 'dark' ? '#444' : '#e0e0e0'
                            }
                        },
                        y: {
                            ticks: {
                            color: theme === 'dark' ? '#E0E0E0' : '#000',
                            stepSize: 10,
                            font: {
                                family: 'Poppins'
                            }
                            },
                            grid: {
                            color: theme === 'dark' ? '#444' : '#e0e0e0'
                            },
                            beginAtZero: true
                        }
                        }
                    }}
                    />
                </div>
                ) : (
                <div className="text-center text-sm text-gray-500 font-poppins">Loading chart...</div>
                )}

          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Adminhero2;
