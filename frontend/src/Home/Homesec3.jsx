import React from 'react';
import { FaShieldAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.4, // Increased timing between children
      delayChildren: 0.5,   // Start after delay
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 60, rotateX: -10 },
  show: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: {
      type: 'spring',
      stiffness: 80,
      damping: 20,    // Slows the bounce effect
      duration: 0.9,  // Explicit animation duration
    },
  },
};

const textVariants = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.2,
      type: 'spring',
      stiffness: 70,
      damping: 12,
    },
  },
};

const Homesec3 = () => {
  const navigate = useNavigate()
  return (
    <div className="bg-[#ecf3f2] w-full py-4 sm:py-4 md:py-6 lg:py-14">
      <div className="flex flex-col lg:flex-row justify-between items-start mx-auto max-w-screen-xl px-6 sm:px-8 py-10 sm:py-16 gap-10">
        
        {/* Left Section */}
        <motion.div 
          className="flex flex-col justify-center text-left w-full lg:w-2/5"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          <motion.div className="flex items-center gap-1 justify-start" variants={textVariants}>
            <div className="w-2.5 h-2.5 bg-black rounded-full"></div>
            <div className="w-8.5 h-2.5 bg-black rounded-[25px]"></div>
          </motion.div>

          <div className="space-y-6">
            <motion.div variants={textVariants}>
              <h1 className="text-4xl md:text-5xl font-[700] mt-5">
                Your skills deserve 
              </h1>
              <h1 className="text-4xl md:text-5xl font-[700]">
                more than a 
              </h1>
              <h1 className="text-4xl md:text-5xl font-[700]">sketchbook.</h1>
            </motion.div>

            <motion.p 
              className="text-base md:text-lg text-gray-700 mt-4 max-w-lg"
              variants={textVariants}
            >
              Our next-generation mobile application offers a seamless and secure platform for making payments, managing accounts, and monitoring transactions.
            </motion.p>

            <motion.button 
              onClick={() => navigate("/auth")}
              variants={textVariants}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.94 }}
              className="cursor-pointer bg-[black] text-white font-semibold mt-3 px-8 py-3 rounded-full hover:bg-transparent hover:text-[black] border-2 border-[#000000] transition duration-300"
            >
              Start Designing
            </motion.button>
          </div>
        </motion.div>

        {/* Right Section (Grid of Boxes) */}
        <motion.div 
          className="w-full lg:w-3/5 grid grid-cols-1 sm:grid-cols-2 gap-6 px-2 sm:px-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {[
            { bg: 'bg-white', iconBg: '#cbe8e6', text: 'Join a growing community of creative minds', textColor: 'text-black' },
            { bg: 'bg-[#101010]', iconBg: '#e8fb55', text: 'Submit designs as per live briefs', textColor: 'text-white' },
            { bg: 'bg-white', iconBg: '#cbe8e6', text: 'Showcase your creativity with confidence', textColor: 'text-black' },
            { bg: 'bg-white', iconBg: '#cbe8e6', text: 'Earn recognition for your design talent', textColor: 'text-black' },
          ].map((item, index) => (
            <motion.div
              key={index}
              className={`flex flex-col justify-between items-start ${item.bg} rounded-[25px] p-8 h-64 relative bg-cover bg-center shadow-lg cursor-pointer`}
              variants={cardVariants}
              whileHover={{
                y: -6,
                boxShadow: '0px 12px 20px rgba(0, 0, 0, 0.1)',
              }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
            >
              <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: item.iconBg }}>
                <span className="text-2xl"><FaShieldAlt /></span>
              </div>
              <h4 className={`text-lg font-[700] ${item.textColor}`}>{item.text}</h4>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default Homesec3;
