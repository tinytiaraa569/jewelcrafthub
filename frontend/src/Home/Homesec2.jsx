import React from 'react';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.3,
      delayChildren: 0.5,
    },
  },
};

const fadeInUpVariant = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 25,
      duration: 1.2,
    },
  },
};

const Homesec2 = () => {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      variants={containerVariants}
      className="w-full py-16 px-4 text-center font-poppins"
    >
      <motion.h1
        variants={fadeInUpVariant}
        className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
      >
        We provide the brief. You bring the brilliance.
      </motion.h1>

      <motion.p
        variants={fadeInUpVariant}
        className="text-base md:text-lg text-gray-600 max-w-3xl mx-auto"
      >
        Submit your hand-drawn designs based on real-time briefs from Unity Jewels. Get discovered. Get selected. Get paid.
      </motion.p>
    </motion.div>
  );
};

export default Homesec2;
