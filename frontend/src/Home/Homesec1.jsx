import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import hero1bg from './images/hero1.webp'; // Make sure the path is correct
import hero2bg from './images/hero2.webp'; // Make sure the path is correct
import { useNavigate } from 'react-router-dom';


const Homesec1 = () => {
  const navigate = useNavigate()
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2, ease: 'easeInOut' }}
      className="w-full min-h-[90vh] bg-cover bg-center bg-fixed flex items-center justify-center px-6 md:px-14 font-poppins"
      style={{
        backgroundImage: `url(${hero1bg})`,
      }}
    >
      <div className="flex flex-col-reverse lg:flex-row items-center justify-between gap-8 md:gap-10 lg:gap-16 w-full max-w-7xl">
        {/* Left Side - Text Content */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 1, ease: 'easeOut' }}
          className="text-white max-w-2xl space-y-5 text-center lg:text-left"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
            Design. Upload.
          </h1>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold">
            Earn. Repeat.
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-200 leading-relaxed">
            Welcome to the only platform built for manual jewelry designers, by jewelry industry pioneers.
            A creative space where your talent meets opportunity.
          </p>
          <Button onClick={() => navigate("/auth")} className="cursor-pointer bg-[#e8fb55] text-black font-[500] hover:bg-transparent hover:text-[#e8fb55] border-2 border-transparent hover:border-[#e8fb55] transition duration-300 px-10 py-6 text-lg rounded-full">
            Get Started
          </Button>
        </motion.div>

        {/* Right Side - Image */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.6, duration: 1, ease: 'easeOut' }}
          className="w-full lg:w-[55%]"
        >
          <img
            src={hero2bg}
            alt="Design Showcase"
            className="w-full h-[270px] md:h-[260px] xl:h-[550px] object-contain"
             loading="lazy"
          />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Homesec1;
