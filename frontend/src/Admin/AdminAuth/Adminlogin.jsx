import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";
import axios from "axios";
import { backendurl } from "@/server";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { checkAdminAuth } from "@/redux/slices/adminAuthSlice";
import { useSelector } from "react-redux";

const AdminLogin = () => {
  const { adminUser, isAuthenticated } = useSelector((state) => state.adminAuth);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();



  // ✅ Check admin authentication when component loads
  useEffect(() => {
    dispatch(checkAdminAuth());
  }, [dispatch]);

  // ✅ Redirect admin to dashboard if already logged in
  useEffect(() => {
    if (isAuthenticated && adminUser) {
      navigate("/admin-dashboard", { replace: true });
    }
  }, [isAuthenticated, adminUser, navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data) => {
    try {
      const response = await axios.post(
        `${backendurl}/admin/admin-login`,
        data ,
        {
          withCredentials: true, // ✅ Ensures secure cookies are sent & received
        }// Ensures secure cookies are sent
      );

      console.log(response,'resposne')

      if (response.status === 200) {
        dispatch(checkAdminAuth());
        navigate("/admin-dashboard")
        toast.success("Admin logged in successfully!");
      }
    } catch (error) {
      console.error("Login Error:", error.response?.data?.message || error.message);
      toast.error(error.response?.data?.message || "Invalid email or password");
    }
  };

  return (
    <div
      className="flex min-h-[91vh] items-center justify-center p-6 relative bg-cover bg-center"
      style={{ backgroundImage: "url('https://images.pexels.com/photos/1050321/pexels-photo-1050321.jpeg?auto=compress&cs=tinysrgb&w=1920')" }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 dark:bg-black/80"></div>

      <Card className="w-full max-w-md px-6 pt-5 pb-8 shadow-xl border border-gray-100 dark:border-gray-700 rounded-xl bg-white dark:bg-neutral-900 relative z-10">
        <CardHeader>
          <CardTitle className="text-center text-xl font-bold text-gray-800 dark:text-white">
            Admin Login
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email Field */}
            <div>
              <Label className="dark:text-gray-300 text-gray-700 mb-1 block">Email</Label>
              <Input
                type="email"
                {...register("email", { required: "Email is required" })}
                placeholder="Enter your email"
                className="bg-white dark:bg-neutral-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700 focus:border-gray-500 dark:focus:border-gray-500 focus:ring-1 focus:ring-gray-400 dark:focus:ring-gray-500 rounded-lg px-3 py-2 w-full"
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
            </div>

            {/* Password Field */}
            <div className="relative">
              <Label className="dark:text-gray-300 text-gray-700 mb-1 block">Password</Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  {...register("password", { required: "Password is required" })}
                  placeholder="Enter your password"
                  className="bg-white dark:bg-neutral-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700 focus:border-gray-500 dark:focus:border-gray-500 focus:ring-1 focus:ring-gray-400 dark:focus:ring-gray-500 rounded-lg px-3 py-2 pr-14 w-full"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400"
                >
                  {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
            </div>

            {/* Submit Button */}
            <Button type="submit" className="w-full mt-2 cursor-pointer dark:bg-neutral-800 dark:border  dark:border-gray-700 text-white font-semibold py-2 rounded-lg">
              Login
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;
