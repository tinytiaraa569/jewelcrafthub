import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { backendurl } from '@/server';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { toast } from 'sonner';

const ActivateAccount = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState("Activating your account...");
  const [success, setSuccess] = useState(null);
  const [countdown, setCountdown] = useState(null);

  useEffect(() => {
    const activateUser = async () => {
      try {
        await axios.post(`${backendurl}/auth/activation`, {
          activation_token: token,
        });
        toast.success("Account activated successfully!")
        setMessage("Account activated successfully!");
        setSuccess(true);
        setCountdown(3);
      } catch (error) {
        setMessage("Activation link is invalid or expired.");
        setSuccess(false);
        setCountdown(5);
        console.error(error);
      }
    };

    if (token) {
      activateUser();
    }
  }, [token]);

  useEffect(() => {
    if (countdown !== null && countdown >= 0) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev === 1) {
            clearInterval(timer);
            navigate("/auth");
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [countdown, navigate]);

  return (
    <div className="min-h-[90vh] flex items-center justify-center bg-gray-100 px-4">
      <Card className="w-full max-w-md shadow-xl border border-gray-200">
        <CardHeader className="flex flex-col items-center text-center space-y-2">
          {success === null && (
            <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
          )}
          {success === true && (
            <CheckCircle2 className="h-10 w-10 text-green-500" />
          )}
          {success === false && (
            <XCircle className="h-10 w-10 text-red-500" />
          )}
          <CardTitle className={`text-xl font-semibold ${success === true ? 'text-green-600' : success === false ? 'text-red-600' : 'text-blue-600'}`}>
            {message}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-sm text-gray-500">
            {success === null && "Processing activation..."}
            {success === true && "You’ll be redirected shortly."}
            {success === false && "Please try signing up again or contact support."}
          </p>
          {countdown !== null && (
            <p className="mt-2 text-sm font-medium text-gray-700">
              Redirecting in <span className="font-bold">{countdown}s</span>...
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ActivateAccount;
