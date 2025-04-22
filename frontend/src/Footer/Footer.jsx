import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import logo from '../Navbar/logo.webp';

const Footer = () => {
  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'About Us', href: '/about' },
    { label: 'Design Brief', href: '/design-brief' },
    { label: 'Contact', href: '/contact' },
  ];

  return (
    <footer className="!overflow-hidden px-6 md:px-16 py-12 mt-16 text-gray-700 bg-[#fdfdfd]">
      {/* Top Section */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start justify-between gap-10 flex-wrap">
        
        {/* Tagline */}
        <div className="w-full md:w-1/2">
          <motion.div
            className="flex items-center gap-1 mb-3"
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-2.5 h-2.5 bg-black rounded-full" />
            <div className="w-8 h-2.5 bg-black rounded-[25px]" />
          </motion.div>

          <motion.h2
            className="text-xl md:text-3xl font-semibold text-[#101010] leading-10"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            Whether you’re a student with passion, a freelancer with flair, or a designer who never had a stage — you now have a place to shine.
          </motion.h2>
        </div>

        {/* Navigation Links */}
        <motion.div
          className=" flex flex-col gap-3 "
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h1 className="text-xl font-bold mb-2">Company</h1>
          {navLinks.map((link, index) => (
            <motion.div
              key={link.label}
              whileHover={{ x: 5 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <Link
                to={link.href}
                className="text-md font-medium hover:text-black transition-colors duration-300"
              >
                {link.label}
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Socials */}
        <motion.div
          className="flex flex-col gap-3"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.3 }}
        >
          <h2 className="text-xl font-bold mb-2">Socials</h2>
          {['Facebook', 'Instagram'].map((platform, index) => (
            <motion.div
              key={platform}
              whileHover={{ x: 5 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <a href="#" className="text-md font-medium hover:text-black transition-colors duration-300">
                {platform}
              </a>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Bottom Section */}
      <div className="max-w-7xl mx-auto mt-12 border-t pt-6 text-sm text-gray-500 flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Left Info */}
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8 text-center sm:text-left">
          <p>&copy; {new Date().getFullYear()} Jewel Craft Hub. All rights reserved.</p>
          <Link to="/privacy-policy" className="hover:text-black transition-colors duration-300">
            Privacy Policy
          </Link>
        </div>

        {/* Logo */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <img src={logo} alt="logo" className="h-12 md:h-14 object-contain" />
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
