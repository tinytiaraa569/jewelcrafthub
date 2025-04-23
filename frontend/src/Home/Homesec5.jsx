import React from 'react';
import { motion } from 'framer-motion';
import hero5bg from './images/hero5.webp';
import { useNavigate } from 'react-router-dom';

const containerVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: 'easeOut',
      when: 'beforeChildren',
      staggerChildren: 0.3,
    },
  },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.2 }, // add a shorter duration for each item
    },
  };

const Homesec5 = () => {
  const navigate = useNavigate();
  const backgroundUrl = `url(${hero5bg})`;

  return (
    <div
      className="relative w-full h-[50vh] min-h-[320px] bg-cover bg-center bg-fixed flex items-center justify-center"
      style={{ backgroundImage: backgroundUrl }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-[#0000003f] bg-opacity-60 z-0" />

      {/* Animated Content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }} // triggers when 50% of the component is in view
        className="relative z-10 flex flex-col items-center justify-center text-center gap-6 px-4 md:px-10"
      >
        <motion.img
          variants={itemVariants}
          src="https://lirp.cdn-website.com/e2788c22/dms3rep/multi/opt/1-9d205bfc-1920w.png"
          alt="Design Highlight"
          className="w-[123px] md:w-[123px] !h-[130px] object-contain"
        />

        <motion.h2
          variants={itemVariants}
          className="text-white text-lg md:text-2xl font-bold max-w-5xl"
        >
          Your design deserves the limelight. We’re just making sure it gets there.
        </motion.h2>

        <motion.div variants={itemVariants}>
          <button onClick={() => navigate("/auth")} className="cursor-pointer bg-[#e8fb55] text-black font-medium hover:bg-transparent hover:text-[#e8fb55] border-2 border-transparent hover:border-[#e8fb55] transition duration-300 px-8 py-2 text-base md:text-lg rounded-full shadow-lg">
            Get Started
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Homesec5;
