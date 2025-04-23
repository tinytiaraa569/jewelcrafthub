import { motion } from "framer-motion";
import { RiCheckFill } from "react-icons/ri"; // Adding a checkmark icon
import { useNavigate } from "react-router-dom";

const Aboutsec4 = () => {
  const navigate = useNavigate();
  return (
    <div className="py-20 px-6 md:px-12 font-poppins overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12">

        {/* Left: Overlapping Images */}
        <motion.div
          className="relative w-full lg:w-1/2"
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: false, amount: 0.3 }}
        >
          <div className="relative w-full h-auto">
            {/* Main Background Image */}
            <motion.img
              src="https://lirp.cdn-website.com/e2788c22/dms3rep/multi/opt/ChatGPT+Image+Apr+4-+2025-+03_54_04+PM-1920w.png"
              alt="main"
              className="rounded-xl shadow-lg w-[90%] h-[45vh] md:h-[60vh] lg:h-[70vh] object-cover"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: false }}
            />

            {/* Overlapping Right Image */}
            <motion.img
              src="https://lirp.cdn-website.com/e2788c22/dms3rep/multi/opt/ChatGPT+Image+Apr+4-+2025-+03_53_06+PM-1920w.png"
              alt="overlap"
              className="h-[auto] sm:h-[300px] md:h-[auto] lg:h-[auto]  absolute top-[60%] right-0 transform -translate-y-1/2 w-2/3 md:w-1/2 rounded-xl shadow-2xl border-4 border-white"
              initial={{ opacity: 0, x: 40, scale: 0.95 }}
              whileInView={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: false }}
            />
          </div>
        </motion.div>

        {/* Right: Text Content */}
        <motion.div
          className="w-full lg:w-1/2"
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: false, amount: 0.3 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-6">Our Promise</h1>

          <p className="text-lg text-gray-700 mb-6">
            We exist to support and elevate emerging talent through meaningful collaboration.
          </p>

          <div className="space-y-6">
            {[
              'To honor your originality',
              'To respect your time and talent',
              'To keep the process fair, transparent, and secure',
              'To help you grow professionally and creatively',
              'We are here to create a movement, not just a marketplace.',
            ].map((line, idx) => (
              <motion.div
                key={idx}
                className="flex items-center space-x-4 text-base md:text-lg text-gray-800"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + idx * 0.15 }}
                viewport={{ once: false }}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.2 + idx * 0.15 }}
                  className="w-5 h-5 text-green-500"
                >
                  <RiCheckFill />
                </motion.div>
                <motion.p>{line}</motion.p>
              </motion.div>
            ))}

            <motion.button 
                onClick={() => navigate("/auth")}
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.94 }}
                className="cursor-pointer bg-[black] text-white font-semibold mt-3 px-8 py-3 rounded-full hover:bg-transparent hover:text-[black] border-2 border-[#000000] transition duration-300"
                        >
                          Start Designing
                        </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Aboutsec4;
