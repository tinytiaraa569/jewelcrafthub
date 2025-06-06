import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { useTheme } from "@/components/ui/ThemeProvider";
import { backendurl } from "@/server";
import { toast } from "sonner";
import { CheckCircle, Loader2, UserPlus } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { verifyAuth } from "@/redux/slices/authSlice";
import { GoogleLogin } from "@react-oauth/google";
import { Eye, EyeOff } from "lucide-react";
import ForgotPasswordPopover from "./ForgotPasswordPopover";
import { createAdminNotification } from "@/redux/action/adminNotificationActions";
const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const { theme } = useTheme(); // Get the current theme (dark/light)
  const { token } = useSelector((state) => state.auth);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
        window.scrollTo(0, 0);
      }, []);


  const navigate = useNavigate()
  const dispatch = useDispatch()
  

  const onSubmit = async (data) => {
    const endpoint = isLogin ? "/auth/login" : "/auth/signup";

    if (!isLogin && !data.acceptTerms) {
      toast.error("You must accept the Terms & Conditions and Privacy Policy to sign up.");
      return;
    }
    setIsLoading(true); // Start loading
  
  try {
    const response = await fetch(`${backendurl}${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      credentials: "include", // ✅ Important: This allows cookies to be sent!
    });

    const result = await response.json();
    console.log(result);

    if (response.ok) {
      toast(
        <div className="flex items-center gap-x-3">
          {/* Icon */}
          {isLogin ? (
            <CheckCircle className="text-green-500" size={24} />
          ) : (
            <UserPlus className="text-blue-500" size={24} />
          )}
    
          {/* Text & Description in One Div */}
          <div>
            <span className="font-medium">
              {isLogin ? "Login Successful" : "Account Created"}
            </span>
            <p className="text-sm text-gray-500">
              {isLogin
                ? "You have successfully logged in!"
                : "Please check your email to activate your account."}
            </p>
          </div>
        </div>,
        {
          duration: 3000,
        }
      );

      if (isLogin) {
        dispatch(verifyAuth({ token: result.token, user: result.user }));  // ✅ Save in Redux
        localStorage.setItem("token", result.token);
        window.location.reload()
        navigate("/user-profile"); 
      } else {
        // If signup, switch to login form
         reset(); // Reset form fields
        setIsLogin(true);

        dispatch(
          createAdminNotification(
            result?.user?._id,
            "New User Signup",
            `Exciting news! ${result.user.name || "A new user"} has joined us with the email ${result.user.email}`,
            "check"
          )
        );
      }

     
    } else {
      alert(result.message);
    }
  } catch (error) {
    console.error("Error:", error);
  } finally {
    setIsLoading(false); // Stop loading
  }
  };

  

  return (
    <div className="flex justify-center items-center min-h-[90vh] bg-[#ecf3f2] bg-gradient-to-br from-[#ecf3f2] via-white to-[#ecf3f2]  p-4 transition-colors duration-300">
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <Card className="max-w-lg px-4 py-6 mx-auto shadow-xl rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
        <CardHeader>
          <CardTitle className="text-xl text-center font-semibold">
            {isLogin ? "Login" : "Sign Up"}
          </CardTitle>
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            {isLogin
              ? "Login to your JewelCraftHub account"
              : "Sign up for a JewelCraftHub account and get started!"}
          </p>
  
          {/* Google Sign-In Section */}
          <div className="mt-4">
            <GoogleLogin
              onSuccess={(credentialResponse) => {
                console.log(credentialResponse);
                fetch(`${backendurl}/auth/google-login`, {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({ token: credentialResponse.credential }),
                })
                  .then((res) => res.json())
                  .then((data) => {
                    if (data.success) {
                      toast.success(data.message || "Google login successful!");
                      dispatch(verifyAuth({ token: data.token, user: data.user }));
                      localStorage.setItem("token", data.token);
                      navigate("/user-dashboard");
                      window.location.reload();
                    } else {
                      toast.error("Google login failed. Try again.");
                    }
                  })
                  .catch((err) => console.error("Google Login Error:", err));
              }}
              onError={() => toast.error("Google login failed. Please try again.")}
            />
  
            <div className="flex items-center mt-6 mb-4">
              <div className="border-t border-gray-300 flex-grow"></div>
              <span className="px-2 text-sm text-gray-500 dark:text-gray-400">
                Or continue with
              </span>
              <div className="border-t border-gray-300 flex-grow"></div>
            </div>
          </div>
        </CardHeader>
  
        <CardContent>
          <motion.form
            key={isLogin ? "login" : "signup"}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.4 }}
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4 !gap-0"
          >
            {!isLogin && (
              <div>
                <Input
                  type="text"
                  placeholder="Full Name"
                  {...register("name", { required: !isLogin })}
                  className="dark:bg-gray-700 dark:text-white"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm  pl-1">Name is required</p>
                )}
              </div>
            )}
            <div>
              <Input
                type="email"
                placeholder="Email"
                {...register("email", { required: true })}
                className="dark:bg-gray-700 dark:text-white"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1 pl-1">Email is required</p>
              )}
            </div>
            <div className="space-y-1">
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"} // Toggle between text and password type
                  placeholder="Password"
                  {...register("password", { required: true, minLength: 6 })}
                  className="dark:bg-gray-700 dark:text-white pr-10" // Added padding for the icon
                />
                {/* Show appropriate icon */}
                <span
                  onClick={() => setShowPassword(!showPassword)} // Toggle password visibility on click
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </span>
              </div>
              
              {/* Error message */}
              {errors.password && (
                <p className="text-red-500 text-sm pl-1">{errors.password.message || "Password must be at least 6 characters"}</p>
              )}
            </div>

              {!isLogin && (
            <div className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
              <input
                type="checkbox"
                {...register("acceptTerms", { required: true })}
                className="mt-1 cursor-pointer accent-blue-600"
              />
              <label htmlFor="acceptTerms" className="flex flex-row">
                I accept the&nbsp;
                <span className="inline-flex gap-1">
                  <Link
                    to="/terms-condition"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Terms & Conditions
                  </Link>
                  and
                  <Link
                    to="/privacy-policy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Privacy Policy
                  </Link>
                </span>
              </label>
            </div>
          )}

          {errors.acceptTerms && (
            <p className="text-red-500 text-sm mt-1 pl-1">You must accept the terms and policy</p>
          )}
             
           

  
            <motion.div whileHover={{ scale: 1.01 }} >
            <Button type="submit" className="cursor-pointer w-full mt-1" disabled={isLoading}>
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Processing...</span>
                </div>
              ) : (
                isLogin ? "Login" : "Sign Up"
              )}
            </Button>

            </motion.div>
          </motion.form>

          {isLogin &&(

           <div className="mt-3">

          
            <div className="text-right text-sm">
            <ForgotPasswordPopover />
          </div>
        
          </div>
          )

        }
  
          {/* Switch between Login & Signup */}
          <p className="text-center text-sm mt-4 text-gray-500 dark:text-gray-400">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <span
              onClick={() => setIsLogin(!isLogin)}
              className="text-blue-600 dark:text-blue-400 cursor-pointer hover:underline"
            >
              {isLogin ? "Sign Up" : "Login"}
            </span>
          </p>
        </CardContent>
      </Card>
    </motion.div>
  </div>
  
  );
};

export default AuthForm;
