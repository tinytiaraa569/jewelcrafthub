import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Popover, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner"; // for showing success/error notifications
import { X } from "lucide-react";
import axios from "axios"; // Axios for HTTP requests
import { backendurl } from "@/server";

const ForgotPasswordPopover = () => {
  const { register, handleSubmit, reset } = useForm();
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handlePasswordReset = async (data) => {
    const { email } = data;
    console.log(email, "from frontend");
    setLoading(true);

    try {
      // Call the backend API to send the reset link
      await axios.post(`${backendurl}/auth/forgot-password`, { email });
      toast.success("Password reset link sent to your email."); // Notify the user
      reset(); // Reset form fields
      setIsOpen(false); // Close the popover
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to send password reset link.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <button className="text-blue-600 dark:text-blue-400 cursor-pointer underline">
            Forgot Password?
          </button>
        </PopoverTrigger>

        <AnimatePresence>
          {isOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.3 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="fixed inset-0 bg-black z-70 dark:bg-black/70"
                onClick={() => setIsOpen(false)}
              />
              <motion.div
                className="fixed inset-0 flex items-center justify-center z-100"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <form
                  onSubmit={handleSubmit(handlePasswordReset)}
                  className="bg-white dark:bg-gray-800 p-6 rounded-lg w-[450px] max-w-full shadow-lg dark:shadow-xl"
                >
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Forgot Password</h3>
                    <button
                      type="button"
                      onClick={() => setIsOpen(false)}
                      className="text-gray-500 dark:text-gray-400 cursor-pointer"
                    >
                      <X size={18} />
                    </button>
                  </div>

                  <p className="text-sm text-left mb-4 text-gray-600 dark:text-gray-300">
                    Enter your email to receive a reset link:
                  </p>
                  <Input
                    type="email"
                    placeholder="Email"
                    {...register("email", { required: true })}
                    className="mb-4 bg-white dark:bg-gray-700 dark:text-gray-100"
                  />
                  <Button type="submit" disabled={loading} className="w-full cursor-pointer">
                    {loading ? "Sending..." : "Send Reset Link"}
                  </Button>
                </form>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </Popover>
    </div>
  );
};

export default ForgotPasswordPopover;
