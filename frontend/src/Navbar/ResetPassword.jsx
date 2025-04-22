import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import { backendurl } from "@/server";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { motion } from "framer-motion"; // For animations

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    if (data.newPassword !== data.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      const response = await axios.post(`${backendurl}/auth/reset-password`, {
        token,
        password: data.newPassword,
      });

      toast.success("Your password has been reset successfully!");

      // Delayed navigation to allow time for toast display
      setTimeout(() => {
        navigate("/auth");
        window.location.reload();
      }, 2000); // 2-second delay
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Invalid or expired token. Please request a new one."
      );
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[91vh] bg-gray-100 dark:bg-gray-800 font-poppins transition-all duration-300">
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        className="w-full max-w-md"
      >
        <Card className="shadow-xl bg-white dark:bg-gray-900 dark:text-white rounded-2xl">
          <CardHeader>
            <CardTitle className="text-2xl text-center dark:text-gray-200">
              Reset Your Password
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-4">
                <label className="block mb-2 text-gray-700 dark:text-gray-300">
                  New Password:
                </label>
                <Input
                  type="password"
                  {...register("newPassword", { required: "Password is required" })}
                  className="w-full dark:bg-gray-700 dark:border-gray-600"
                />
                {errors.newPassword && (
                  <p className="text-red-500 text-sm mt-1">{errors.newPassword.message}</p>
                )}
              </div>

              <div className="mb-4">
                <label className="block mb-2 text-gray-700 dark:text-gray-300">
                  Confirm Password:
                </label>
                <Input
                  type="password"
                  {...register("confirmPassword", { required: "Please confirm your password" })}
                  className="w-full dark:bg-gray-700 dark:border-gray-600"
                />
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
                )}
              </div>

              <Button type="submit" className="w-full cursor-pointer">
                Reset Password
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default ResetPassword;
