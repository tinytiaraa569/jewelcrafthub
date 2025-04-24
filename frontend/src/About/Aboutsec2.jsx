import React from 'react'
import { motion } from 'framer-motion'

const Aboutsec2 = () => {
  return (
    <div className=" flex flex-col lg:flex-row max-w-7xl mx-auto items-center justify-center py-16 px-6 md:px-14 font-poppins ">
      {/* Left Side */}
      <div className="left w-full lg:w-1/3 text-left mb-12 lg:mb-0">
        <motion.div 
          className="flex items-center gap-1 justify-start"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: 'easeInOut' }}
          viewport={{ once: true, amount: 0.2 }}
        >
          <div className="w-2.5 h-2.5 bg-black rounded-full"></div>
          <div className="w-8.5 h-2.5 bg-black rounded-[25px]"></div>
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          viewport={{ once: true, amount: 0.2 }}
          className="text-3xl md:text-4xl font-bold mt-4 text-left"
        >
          We believe in
        </motion.h1>
      </div>

      {/* Right Side */}
      <div className="right w-full lg:w-2/3 text-left">
        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          viewport={{ once: true, amount: 0.2 }}
          className="text-2xl md:text-3xl font-semibold mb-4"
        >
          This isn’t just a platform — it’s a revolution in the world of jewelry design.
        </motion.h3>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
          viewport={{ once: true, amount: 0.2 }}
          className="text-base md:text-lg mb-4"
        >
          We’re bringing back the glory of hand-drawn artistry in the digital age.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
          viewport={{ once: true, amount: 0.2 }}
          className="text-base md:text-lg"
        >
          In a world dominated by 3D tools and AI-generated templates, we believe that human creativity still shines the brightest. That’s why this platform was born — a first-of-its-kind initiative where manual jewelry designers can express their brilliance, respond to real briefs, and build a sustainable creative career.
        </motion.p>
      </div>
    </div>
  )
}

export default Aboutsec2
