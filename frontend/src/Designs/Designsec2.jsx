import React from 'react'
import { motion } from 'framer-motion'
import designsec2img from './images/design2.webp'
import { useNavigate } from 'react-router-dom'

const Designsec2 = () => {
  const navigate = useNavigate();
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 1 }}
      viewport={{ once: false }}
      className="w-full  py-20 px-6 md:px-12 flex justify-center bg-white overflow-hidden"
    >
      <div className="flex flex-col md:flex-row items-center max-w-6xl w-full gap-16">
        {/* Left Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: 'easeOut', delay: 0.2 }}
          viewport={{ once: false }}
          className="w-full md:w-1/2"
        >
          <motion.img
            src={designsec2img}
            alt="Secure design submission"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 1 }}
            className="rounded-xl w-full h-auto lg:h-[50vh] md:h-[40vh] object-cover shadow-2xl"
          />
        </motion.div>

        {/* Right Text */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          viewport={{ once: false }}
          className="w-full md:w-1/2 text-center md:text-left"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800 leading-tight">
            Fair, Transparent & Secure
          </h2>
          <p className="text-gray-600 text-lg leading-relaxed mb-6">
            Your designs are safe with us. All uploaded files are encrypted and accessible
            only by the concerned brand until results are declared.
          </p>
          <motion.button 
          onClick={() => navigate("/auth")}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.94 }}
            className="cursor-pointer bg-black text-white font-semibold px-8 py-3 rounded-full hover:bg-transparent hover:text-black border-2 border-black transition duration-300"
          >
            Start Designing
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default Designsec2
