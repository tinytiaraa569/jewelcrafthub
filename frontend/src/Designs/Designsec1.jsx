import React from 'react'
import { motion } from 'framer-motion'
import design1bg from './images/design1.webp'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.3, duration: 0.6, ease: 'easeOut' }
  })
}

const Designsec1 = () => {
  const navigate = useNavigate();
  return (
    <motion.div
         initial={{ opacity: 0 }}
         animate={{ opacity: 1 }}
         transition={{ duration: 1.2, ease: 'easeInOut' }}
         className="w-full min-h-[90vh] bg-cover bg-center bg-fixed flex items-center justify-center px-6 md:px-14 font-poppins"
         style={{
           backgroundImage: `url(${design1bg})`,
         }}
       >

      {/* Content Container */}
      <div className="relative z-10 flex flex-col items-center text-white w-full max-w-7xl">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight drop-shadow-xl">
            Pick What Suits You
          </h1>
        </motion.div>

        {/* Cards
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full mb-16">
          {[
            {
              title: 'Browse Available Briefs',
              description:
                'Each brief comes with all design specs and rewards clearly stated.',
              image: 'https://lirp.cdn-website.com/e2788c22/dms3rep/multi/opt/2-1920w.png'
            },
            {
              title: 'Choose and Accept Brief',
              description:
                'Pick a project that resonates with your skills and accept the challenge.',
              image: 'https://lirp.cdn-website.com/e2788c22/dms3rep/multi/opt/pexels-photo-5076509-1920w.jpeg'
            },
            {
              title: 'Submit Design Before Deadline',
              description:
                'Once submitted, you can track the status from your dashboard.',
              image: 'https://lirp.cdn-website.com/e2788c22/dms3rep/multi/opt/3-1920w.png'
            }
          ].map((card, i) => (
            <motion.div
              key={i}
              custom={i}
              initial="hidden"
              animate="visible"
              variants={cardVariants}
              className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl shadow-lg text-center hover:scale-105 transition-all duration-300"
            >
              <img
                src={card.image}
                alt={card.title}
                className="w-full h-48 object-cover rounded-xl mb-4"
              />
              <h3 className="text-xl font-semibold mb-2">{card.title}</h3>
              <p className="text-sm text-white/80">{card.description}</p>
            </motion.div>
          ))}
        </div> */}

        {/* Button */}
        <Button onClick={() => navigate("/auth")} className="cursor-pointer bg-[#e8fb55] text-black font-semibold hover:bg-transparent hover:text-[#e8fb55] border-2 border-transparent hover:border-[#e8fb55] transition duration-300 px-10 py-5 text-lg rounded-full shadow-md">
          Get Started
        </Button>
      </div>
    </motion.div>
  )
}

export default Designsec1
