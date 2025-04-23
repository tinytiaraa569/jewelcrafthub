import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import img from './404.gif'

const NotFound = () => {
  return (
    <div className="font-poppins flex flex-col items-center justify-center min-h-[90vh]  px-6 text-center">
      <motion.h1 
        className="text-7xl font-bold text-gray-800"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        404
      </motion.h1>
      <p className="text-xl text-gray-600 mt-4">
        Oops! The page you’re looking for doesn’t exist.
      </p>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <img 
        src={img} 
        alt="Page Not Found" 
        className="w-full h-[400px]"
        />

      </motion.div>
      <motion.div 
  initial={{ opacity: 0, y: 20 }} 
  animate={{ opacity: 1, y: 0 }} 
  transition={{ duration: 0.6, ease: "easeOut" }}
>
<Link
        to="/"
        className="mt-6 px-6 py-3 text-white bg-gray-800 rounded-lg shadow-md hover:bg-gray-600 transition-all duration-300"
      >
        Back to Home
      </Link>
</motion.div>

    </div>
  );
};

export default NotFound;
