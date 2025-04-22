import React from 'react'
import { motion } from 'framer-motion'
import aboutsec3img from './images/aboutsec3.webp'

const highlightedWords = [
  "verified brands",
  "emerging designers",
  "real briefs",
  "transparent rewards",
  "intellectual property",
  "credible, growing portfolio"
]

const highlightText = (text) => {
  let replacedText = text
  highlightedWords.forEach(word => {
    const regex = new RegExp(`(${word})`, "gi")
    replacedText = replacedText.replace(
      regex,
      `<span class='highlight'>$1</span>`
    )
  })
  return replacedText
}

const Aboutsec3 = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 py-14 font-poppins ">
      <div className="flex flex-col-reverse lg:flex-row items-center gap-12">
        {/* Left Content */}
        <motion.div
          className="w-full lg:w-1/2"
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, amount: 0.4 }}
        >
          <motion.h1
            className="text-3xl md:text-4xl font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
          >
            Why We Exist
          </motion.h1>

          {[
            "Designers often sketch in silence, with limited avenues to be seen, heard, or paid fairly. Brands, on the other hand, are constantly searching for fresh, original designs but often miss out on hidden talent.",
            "This platform bridges the gap.",
          ].map((para, idx) => (
            <motion.p
              key={idx}
              className="text-base md:text-lg mb-4 text-gray-700"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 + idx * 0.2 }}
              viewport={{ once: true }}
            >
              {para}
            </motion.p>
          ))}

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              "We bring verified brands and emerging designers into one collaborative space.",
              "We ensure intellectual property stays protected.",
              "We provide real briefs, clear guidelines, and transparent rewards.",
              "We reward selected designers and help them build a credible, growing portfolio.",
            ].map((text, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + idx * 0.2 }}
                viewport={{ once: true, amount: 0.2 }}
                className="flex items-start gap-3 text-base md:text-lg text-gray-700"
              >
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.3 + idx * 0.2 }}
                  className="w-2 h-2 mt-3 bg-black rounded-full flex-shrink-0"
                />
                <p
                  dangerouslySetInnerHTML={{
                    __html: highlightText(text),
                  }}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Right Image */}
        <motion.div
          className="w-full flex justify-center lg:w-1/2"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true, amount: 0.3 }}
        >
            <img
            src={aboutsec3img}
            alt="about"
            className="w-full max-w-md md:max-w-lg lg:max-w-xl h-80 md:h-96 lg:h-[28rem] rounded-xl shadow-lg object-cover"
          />
          
        </motion.div>
      </div>

      {/* Styling for highlighted words */}
      <style>
        {`
          .highlight {
            
            font-weight: 600;
          }
        `}
      </style>
    </div>
  )
}

export default Aboutsec3
