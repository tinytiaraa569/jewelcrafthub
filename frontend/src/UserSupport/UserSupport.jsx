import React from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Mail, Phone, MapPin, Gem, User, PencilLine, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { FaWhatsapp } from 'react-icons/fa6';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';
import axios from 'axios';
import { backendurl } from '@/server';
import { useDispatch } from 'react-redux';
import { createNotification } from '@/redux/action/usernotification';
import { createAdminNotification } from '@/redux/action/adminNotificationActions';

const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

const fadeInItem = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const UserSupport = () => {
  const { user } = useSelector((state) => state.auth);

  const dispatch = useDispatch()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    let payloadsub = {...data,user}
    try {
        const response = await axios.post(`${backendurl}/usersupport/user-support/create`, payloadsub); // adjust URL if different
        

        // Optional: Show a success message to the user
        toast.success("Your message has been sent! We'll get back to you soon.");


        dispatch(createNotification(user?._id, "Contact Submitted", "Thank you for reaching out! Your message has been successfully submitted. Our team will get back to you shortly.", "check"));


        dispatch(
        createAdminNotification(
            user?._id,
            "New Contact Submission",
            `A new message has been submitted by ${user?.name || "a user"}. Please review and respond to their inquiry.`,
            "info"
        )
        );

    
        reset(); // clear form
      } catch (error) {
        console.error('Error submitting support request:', error);
        toast.error('Something went wrong. Please try again.');
      }
  };

  return (
    <div className="py-6 px-4 sm:px-6 flex justify-center items-center dark:bg-[#0f0f0f]">
      <motion.div
        initial="hidden"
        animate="show"
        variants={fadeIn}
        className="w-full max-w-6xl"
      >
        <Card className="!py-0 shadow-xl border border-neutral-200/50 dark:border-neutral-700/50 bg-white dark:bg-neutral-900 rounded-3xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 text-sm">
            {/* Left Side - Contact Form */}
            <div className="px-8 py-4 sm:p-10">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="flex items-center justify-center mb-1"
              >
                <Gem className="h-8 w-8 text-blue-500 dark:text-blue-400 mr-2" />
                <h1 className="text-xl font-bold text-neutral-800 dark:text-white">
                  JewelCraftHub
                </h1>
              </motion.div>

              <motion.p
                className="text-center text-neutral-600 dark:text-neutral-300 mb-4 text-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                Transform your imagination into income by showcasing your exquisite jewelry designs.
              </motion.p>

              <motion.form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-4"
                variants={staggerContainer}
                initial="hidden"
                animate="show"
              >
                <motion.div variants={fadeInItem}>
                  <Label htmlFor="name" className="text-neutral-700 dark:text-neutral-200 flex items-center text-sm">
                    <User className="h-4 w-4 mr-2 text-blue-500" />
                    Name
                  </Label>
                  <Input
                    id="name"
                    placeholder="Your name"
                    className="mt-1 text-sm"
                    {...register("name", { required: true })}
                  />
                  {errors.name && <span className="text-red-500 text-xs">Name is required</span>}
                </motion.div>

                <motion.div variants={fadeInItem}>
                  <Label htmlFor="email" className="text-neutral-700 dark:text-neutral-200 flex items-center text-sm">
                    <Mail className="h-4 w-4 mr-2 text-blue-500" />
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    className="mt-1 text-sm"
                    {...register("email", { required: true })}
                  />
                  {errors.email && <span className="text-red-500 text-xs">Email is required</span>}
                </motion.div>

                <motion.div variants={fadeInItem}>
                  <Label htmlFor="subject" className="text-neutral-700 dark:text-neutral-200 flex items-center text-sm">
                    <PencilLine className="h-4 w-4 mr-2 text-blue-500" />
                    Subject
                  </Label>
                  <Input
                    id="subject"
                    placeholder="How can we help?"
                    className="mt-1 text-sm"
                    {...register("subject", { required: true })}
                  />
                  {errors.subject && <span className="text-red-500 text-xs">Subject is required</span>}
                </motion.div>

                <motion.div variants={fadeInItem}>
                  <Label htmlFor="message" className="text-neutral-700 dark:text-neutral-200 flex items-center text-sm">
                    <MessageCircle className="h-4 w-4 mr-2 text-blue-500" />
                    Message
                  </Label>
                  <Textarea
                    id="message"
                    placeholder="Describe your jewelry design needs..."
                    className="mt-1 min-h-[100px] text-sm"
                    {...register("message", { required: true })}
                  />
                  {errors.message && <span className="text-red-500 text-xs">Message is required</span>}
                </motion.div>

                <motion.div
                  variants={fadeInItem}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    type="submit"
                    className="w-full cursor-pointer
                    bg-gradient-to-r from-slate-500 to-slate-700 
                    dark:from-blue-600 dark:to-blue-800 
                    hover:from-slate-600 hover:to-slate-800 
                    dark:hover:from-blue-700 dark:hover:to-blue-900 
                    text-white font-semibold rounded-xl py-4 text-sm shadow-md"
                  >
                    Send Message
                  </Button>
                </motion.div>
              </motion.form>
            </div>

            {/* Right Side - Contact Info */}
            <div className=" dark:bg-neutral-800/60 p-8 sm:p-10 flex flex-col justify-center text-sm">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-xl font-semibold text-neutral-800 dark:text-neutral-100 mb-4 flex items-center">
                    <MessageCircle className="h-5 w-5 mr-2 text-blue-500" />
                    Our Contact Information
                  </h3>
                  <p className="text-neutral-600 dark:text-neutral-300">
                    Have questions about showcasing your jewelry designs? Reach out to our support team.
                  </p>
                </div>

                <div className="space-y-5">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 bg-blue-100 dark:bg-blue-900/50 p-2 rounded-full">
                      <Mail className="h-4 w-4 text-blue-600 dark:text-blue-300" />
                    </div>
                    <div className="ml-4">
                      <h4 className="font-medium text-neutral-600 dark:text-neutral-300">Email</h4>
                      <Link to="mailto:support@jewelcrafthub.com" className="text-blue-600 dark:text-blue-300">
                        support@jewelcrafthub.com
                      </Link>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex-shrink-0 bg-blue-100 dark:bg-blue-900/50 p-2 rounded-full">
                      <Phone className="h-4 w-4 text-blue-600 dark:text-blue-300" />
                    </div>
                    <div className="ml-4">
                      <h4 className="font-medium text-neutral-600 dark:text-neutral-300">Phone</h4>
                      <Link to="tel:+15551234567" className="text-blue-600 dark:text-blue-300">
                        +1 (555) 123-4567
                      </Link>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex-shrink-0 bg-blue-100 dark:bg-blue-900/50 p-2 rounded-full">
                      <MapPin className="h-4 w-4 text-blue-600 dark:text-blue-300" />
                    </div>
                    <div className="ml-4">
                      <h4 className="font-medium text-neutral-600 dark:text-neutral-300">Office</h4>
                      <p className="text-neutral-800 dark:text-neutral-100 leading-tight">
                        123 Jewelry Lane<br />
                        Design District, NY 10001
                      </p>
                    </div>
                  </div>
                </div>

                <motion.div
                  className="pt-6 border-t border-neutral-300 dark:border-neutral-700"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                >
                  <h4 className="font-medium text-neutral-800 dark:text-neutral-100 mb-2">Business Hours</h4>
                  <ul className="space-y-1 text-neutral-600 dark:text-neutral-300">
                    <li className="flex justify-between">
                      <span>Mon - Sat</span>
                      <span>9:00 AM - 6:00 PM</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Sunday</span>
                      <span>Closed</span>
                    </li>
                  </ul>
                </motion.div>

                <motion.div
                  className="pt-1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.0 }}
                >
                  <h4 className="font-medium text-neutral-800 dark:text-neutral-100 mb-2">
                    WhatsApp
                  </h4>
                  <Link
                    to="https://wa.me/15551234567"
                    target="_blank"
                    className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-medium px-4 py-2 rounded-lg shadow-md transition-transform duration-200 transform hover:scale-105"
                  >
                    <FaWhatsapp className="w-5 h-5" />
                    Chat with us on WhatsApp
                  </Link>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default UserSupport;
