import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { ArrowRight, Eye, EyeOff } from "lucide-react";
import axios from "axios";
import { backendurl } from "@/server";
import { useNavigate } from "react-router-dom";

const AdminSignup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate()
  
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: { name: "", email: "", password: "", role: "admin" },
  });

  const onSubmit = async (data) => {
    try {
      const response = await axios.post(`${backendurl}/admin/admin-signup`, data);
  
      if (response.status === 201) {
        reset()
        toast.success("Admin signed up successfully!");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };
  

  return (
    <div 
      className="flex min-h-screen items-center justify-center p-6 relative bg-cover bg-center"
      style={{ backgroundImage: "url('https://images.pexels.com/photos/1050321/pexels-photo-1050321.jpeg?auto=compress&cs=tinysrgb&w=1920')" }} 
    >
      {/* Overlay for better contrast */}
      <div className="absolute inset-0 bg-black/50 dark:bg-black/80"></div>

      <Card className="w-full max-w-md px-1 py-5 pb-9 shadow-xl border border-gray-100 dark:border-gray-700 rounded-xl bg-white dark:bg-neutral-900 relative z-10">
        <CardHeader>
          <CardTitle className="text-center text-xl mb-2 font-bold text-gray-800 dark:text-white">
            Admin Signup
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Name Field */}
            <div>
              <Label className="dark:text-gray-300 text-gray-700 mb-1 block">Name</Label>
              <Input
                type="text"
                {...register("name", { required: "Name is required" })}
                placeholder="Enter your name"
                className="bg-white dark:bg-neutral-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700 focus:border-gray-500 dark:focus:border-gray-500 focus:ring-1 focus:ring-gray-400 dark:focus:ring-gray-500 rounded-lg px-3 py-2 w-full"
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
            </div>

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

            {/* Role Selection */}
            <div>
              <Label className="dark:text-gray-300 text-gray-700 mb-1 block">Role</Label>
              <Select onValueChange={(value) => setValue("role", value)} defaultValue="admin">
                <SelectTrigger className="bg-white dark:bg-neutral-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700 focus:border-gray-500 dark:focus:border-gray-500 focus:ring-1 focus:ring-gray-400 dark:focus:ring-gray-500 rounded-lg px-3 py-2 w-full">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent className="dark:bg-neutral-800 dark:text-white">
                  <SelectItem value="superadmin">Super Admin</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="moderator">Moderator</SelectItem>
                </SelectContent>
              </Select>
              {errors.role && <p className="text-red-500 text-sm mt-1">{errors.role.message}</p>}
            </div>

            {/* Submit Button */}
            <Button type="submit" className="w-full mt-1 cursor-pointer dark:bg-neutral-800 dark:border  dark:border-gray-700 text-white font-semibold py-2 rounded-lg">
              Sign Up
            </Button>

            {/* Go to Dashboard Button */}
            <Button 
            type="button" 
            onClick={() => navigate("/admin-dashboard")} 
            className="cursor-pointer flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg shadow-md transition-all duration-300"
          >
            Go to Dashboard
            <ArrowRight className="w-5 h-5" />
          </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSignup;
