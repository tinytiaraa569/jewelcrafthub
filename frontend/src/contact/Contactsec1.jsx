import React from 'react';
import { motion } from 'framer-motion';
import contact1bg from './images/contact1img.webp';

import grad1img from './images/contactgrad01.webp';
import grad2img from './images/contactgrad02.webp';
import grad3img from './images/contactgrad01.webp'; // Replace with a third image if available

const fadeIn = (direction = 'up', delay = 0) => {
  const variants = {
    hidden: {
      opacity: 0,
      y: direction === 'up' ? 40 : 0,
      x: direction === 'left' ? -40 : 0,
    },
    show: {
      opacity: 1,
      y: 0,
      x: 0,
      transition: {
        duration: 0.8,
        delay,
        ease: 'easeInOut',
      },
    },
  };
  return variants;
};

const containerStagger = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const Contactsec1 = () => {
  const cards = [
    {
      title: 'Contact Us',
      desc: "Let's explore how we can collaborate to optimize your business financials.",
      action: 'Request a Demo',
      bgimg: grad1img,
    },
    {
      title: 'Get help from support',
      desc: "We’re here to assist you with any platform questions. Please take a look at our FAQ’s.",
      action: 'Ask the Team',
      bgimg: grad2img,
    },
    {
      title: 'Make a media inquiry',
      desc: 'For all media inquiries direct them to our dedicated media team via email.',
      action: 'Email Us',
      bgimg: grad3img,
    },
  ];

  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      className="relative w-full min-h-[90vh] bg-cover bg-center bg-fixed flex flex-col-reverse lg:flex-row items-center justify-center px-6 md:px-14 py-20 font-poppins text-white"
      style={{ backgroundImage: `url(${contact1bg})` }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 z-0" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col items-start justify-between gap-10">
        {/* Heading Section */}
        <motion.div
          variants={fadeIn('left', 0.1)}
          className="w-full lg:w-2/3 space-y-4"
        >
          <motion.h4
            className="text-[#e8fb55] text-sm uppercase tracking-widest font-semibold"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            Contact
          </motion.h4>
          <motion.h1
            className="text-4xl md:text-5xl font-bold"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            Let’s Collaborate.
          </motion.h1>
          <motion.h1
            className="text-4xl md:text-5xl font-bold"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
          >
            Connect. Create.
          </motion.h1>
        </motion.div>

        {/* Card Grid */}
        <motion.div
          variants={containerStagger}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full"
        >
          {cards.map((card, idx) => (
            <motion.div
              key={idx}
              variants={fadeIn('up', 0.3 + idx * 0.2)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="flex flex-col justify-start items-start p-8 min-h-[210px] rounded-2xl border border-white/20 backdrop-blur-md bg-white/10 shadow-lg transition-all duration-300 hover:shadow-2xl hover:border-white/40"
              style={{
                backgroundImage: `url(${card.bgimg})`,
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
              }}
            >
              <motion.h5 className="text-xl font-semibold mb-4 text-black">
                {card.title}
              </motion.h5>
              <motion.p className="text-sm text-black mb-6">
                {card.desc}
              </motion.p>
              <motion.h3 className="text-lg font-bold text-black cursor-pointer hover:underline">
                {card.action}
              </motion.h3>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Contactsec1;
