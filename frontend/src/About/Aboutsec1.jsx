import React from 'react'
import { motion } from 'framer-motion'
import about1bg from './images/aboutbg.webp'
import about1img from './images/about1img.webp'

import { Button } from '@/components/ui/button'

const Aboutsec1 = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2, ease: 'easeInOut' }}
      className="relative w-full min-h-[90vh] bg-cover bg-center bg-fixed flex flex-col-reverse lg:flex-row items-center justify-center px-6 md:px-14 font-poppins"
      style={{
        backgroundImage: `url(${about1bg})`,
      }}
    >

      {/* Black opacity overlay */}
      <div className="absolute inset-0 bg-[#000000f6] opacity-40 z-0"></div>

      {/* Left Content */}
      <div className="text-white max-w-xl space-y-2 z-10 text-center lg:text-left px-4 mt-6">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="text-2xl md:text-4xl font-bold mb-2"
        >
          Two Giants. One Mission.
        </motion.h1>

        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="text-2xl md:text-4xl font-bold mb-2"
        >
          Unlimited Creativity.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="text-sm md:text-lg mb-2"
        >
          Born from the synergy of Unity Jewels’ deep jewelry industry insight and Secure Access Tech’s cutting-edge digital capabilities, this platform is the first of its kind – giving manual jewelry designers a space to showcase their artistry, work on real commercial briefs, and earn from their passion.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
        >
          <Button className="mt-3 cursor-pointer bg-[#e8fb55] text-black font-[500] hover:bg-transparent hover:text-[#e8fb55] border-2 border-transparent hover:border-[#e8fb55] transition duration-300 px-8 py-4 text-lg md:px-10 md:py-6 md:text-lg rounded-full">
            Get Started
          </Button>
        </motion.div>
      </div>

      {/* Right Image */}
      <div className="w-full md:w-1/2 flex justify-center md:justify-end z-10 mt-6 md:mt-0">
        <motion.img
          src={about1img}
          alt="About Image"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="w-[80%] max-w-[480px] h-[38vh]  md:h-[40vh] lg:h-[55vh] xl:h-[65vh] object-cover rounded-lg shadow-xl"
        />
      </div>
    </motion.div>
  )
}

export default Aboutsec1;
