import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent } from '@/components/ui/card';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { toast } from 'sonner';
import { backendurl } from '@/server';
import { useTheme } from '@/components/ui/ThemeProvider';

// Register chart components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AdminuserTracking = () => {
  const [users, setUsers] = useState([]);
  const [designsData, setDesignsData] = useState([]);
  const [userRank, setUserRank] = useState([]);
  const [loading, setLoading] = useState(false);

  const { theme } = useTheme();

  // Fetch all users
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${backendurl}/admin/all-users`, {
        withCredentials: true,
      });
      // Filter only approved users
      const approvedUsers = data.filter((user) => user.status === 'Approved');
      setUsers(approvedUsers);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch users.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch all designs
  useEffect(() => {
    const fetchDesigns = async () => {
      try {
        const response = await axios.get(`${backendurl}/userdesign/user-design/all-designs`, {
          withCredentials: true,
        });
        setDesignsData(response.data.designs);
      } catch (error) {
        console.error('Error fetching designs data:', error);
      }
    };
    fetchDesigns();
  }, []);

  // Fetch user rank
  const fetchUserRank = async () => {
    try {
      const response = await axios.patch(`${backendurl}/userdesign/all-user-rank`);
      setUserRank(response.data.rank);
    } catch (error) {
      console.error('Error fetching user rank:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchUserRank();
  }, []);

  // Get the designs uploaded by the users and calculate approved designs
  const usersWithDesigns = users.map((user) => {
    const userDesigns = designsData.filter((design) => design.user === user._id);
    const approvedDesigns = userDesigns.reduce((total, design) => {
      const approvedFiles = design.files.filter((file) => file.status === 'approved');
      return total + approvedFiles.length;
    }, 0);
    return { ...user, approvedDesigns: approvedDesigns || 0 }; // If no approved designs, show 0
  });

  // Sort users by the number of approved designs (descending order)
  usersWithDesigns.sort((a, b) => b.approvedDesigns - a.approvedDesigns);

  // Assign rank based on the sorted order
  const rankedUsers = usersWithDesigns.map((user, index) => ({
    ...user,
    rank: index + 1, // Rank starts from 1
  }));

  const userLabels = rankedUsers.map((user) => {
    const rankLabel = `Rank ${user.rank}`;
    return `${user.name} (${rankLabel})`;
  });

  const uploadedData = rankedUsers.map((user) =>
    designsData
      .filter((design) => design.user === user._id)
      .reduce((total, design) => total + design.files.length, 0)
  );

  const approvedData = rankedUsers.map((user) =>
    designsData
      .filter((design) => design.user === user._id)
      .reduce((total, design) => {
        const approvedFiles = design.files.filter((file) => file.status === 'approved');
        return total + approvedFiles.length;
      }, 0)
  );

  const uploadApprovalChart = {
    labels: userLabels,
    datasets: [
      {
        label: 'Uploaded Files',
        data: uploadedData,
        backgroundColor: '#4CAF50', // Green for uploaded
        borderColor: '#388E3C',
        borderWidth: 1,
        borderRadius: 10, // Rounded bars
      },
      {
        label: 'Approved Files',
        data: approvedData,
        backgroundColor: '#FF9800', // Orange for approved
        borderColor: '#F57C00',
        borderWidth: 1,
        borderRadius: 10, // Rounded bars
      },
    ],
  };

  return (
    <div className="w-[98%] mx-auto ">
      <Card className="bg-white dark:bg-neutral-900 shadow-xl rounded-2xl py-6 font-poppins ">
        <CardContent className="space-y-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-neutral-100">
              User Tracking
            </h2>
            <p className="text-sm text-slate-600 dark:text-neutral-400">
              Track design uploads, approvals, and user ranking (approved only).
            </p>
          </div>

          {/* Uploaded vs Approved */}
          <div className="w-full h-[360px] dark:bg-neutral-800  p-4 rounded-xl shadow-inner">
            {loading ? (
              <p className="text-sm text-gray-500">Loading...</p>
            ) : (
              <div className="relative w-full h-[340px] rounded-lg overflow-hidden shadow-lg">
                <Bar
                  data={uploadApprovalChart}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false, // Allow custom height
                    plugins: {
                      legend: {
                        position: 'top',
                        labels: {
                          color: theme === 'dark' ? '#FFF' : '#444', // Adjust legend color based on theme
                        },
                      },
                    },
                    scales: {
                      x: {
                        ticks: {
                          color: theme === 'dark' ? '#FFF' : '#666', // Dark theme: white ticks
                          font: {
                            size: 10,
                            family: 'Poppins, sans-serif', // Set font to Poppins
                          },
                        },
                        grid: {
                          display: false,
                        },
                        title: {
                          display: true,
                          text: 'Users (Rank)',
                          font: {
                            size: 14,
                            family: 'Poppins, sans-serif', // Set font to Poppins
                            weight: 'bold',
                          },
                          color: theme === 'dark' ? '#FFF' : '#333',
                        },
                      },
                      y: {
                        beginAtZero: true,
                        ticks: {
                          color: theme === 'dark' ? '#FFF' : '#666', // Dark theme: white ticks
                          font: {
                            size: 10,
                            family: 'Poppins, sans-serif', // Set font to Poppins
                          },
                        },
                        grid: {
                          color: theme === 'dark' ? '#444' : '#ddd', // Dark theme: darker grid lines
                        },
                        title: {
                          display: true,
                          text: 'Files Count',
                          font: {
                            size: 14,
                            family: 'Poppins, sans-serif', // Set font to Poppins
                            weight: 'bold',
                          },
                          color: theme === 'dark' ? '#FFF' : '#333',
                        },
                      },
                    },
                  }}
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminuserTracking;
