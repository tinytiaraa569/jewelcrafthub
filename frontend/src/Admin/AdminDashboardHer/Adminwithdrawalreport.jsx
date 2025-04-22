import { Card, CardContent } from '@/components/ui/card';
import { backendurl } from '@/server';
import axios from 'axios';
import React, { useEffect, useState } from 'react';

const Adminwithdrawalreport = () => {
  const [allwithdrawals, setAllWithdrawals] = useState([]);

  const fetchWithdrawals = async () => {
    try {
      const response = await axios.get(
        `${backendurl}/withdrawal/admin/get-all-withdrawals`,
        { withCredentials: true }
      );
      setAllWithdrawals(response.data.withdrawals);
    } catch (error) {
      console.error("Error fetching withdrawals:", error);
    }
  };

  useEffect(() => {
    fetchWithdrawals();
  }, []);

  const latestWithdrawals = allwithdrawals.slice(0, 4);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = date.toLocaleString('default', { month: 'short' });
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;

    return `${day} ${month} ${year}, ${formattedHours}:${minutes} ${ampm}`;
  };

  return (
    <div className="w-[98%] mx-auto">
      <Card className="bg-white dark:bg-neutral-900 shadow-xl rounded-2xl py-5 font-poppins">
        <CardContent className="space-y-6">
          <div className="!mb-2">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-neutral-100">
              Admin Withdrawal Dashboard
            </h2>
            <p className="text-sm text-slate-600 dark:text-neutral-400">
              View recent withdrawal requests and their statuses.
            </p>
          </div>

          <div className="space-y-3">
            {latestWithdrawals.map((withdrawal) => (
              <div
                key={withdrawal._id}
                className="flex justify-between items-center px-5 py-4 bg-slate-50 dark:bg-neutral-800 rounded-lg shadow-sm border border-slate-200 dark:border-neutral-700 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col gap-0.5">
                  <span className="text-base font-semibold text-slate-800 dark:text-neutral-100">
                     {withdrawal.amount} Credits 
                  </span>
                  <span className="text-sm text-slate-500 dark:text-neutral-400 capitalize">
                    {withdrawal.method}
                  </span>
                  <span className="text-xs text-slate-400 dark:text-neutral-500">
                    {formatDate(withdrawal.createdAt)}
                  </span>
                </div>

                <div className="flex flex-col items-end gap-1">
                  <span className="text-sm font-medium text-slate-700 dark:text-neutral-100">
                    {withdrawal.user?.name}
                  </span>
                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded-full ${
                      withdrawal.status === 'approved'
                        ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300'
                        : withdrawal.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-300'
                        : 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300'
                    }`}
                  >
                    {withdrawal.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Adminwithdrawalreport;
