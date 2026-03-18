import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const NotFoundPage = () => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center min-h-[70vh]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md"
      >
        <h1 className="text-6xl md:text-8xl font-black text-advik-navy/10 mb-4 font-display">404</h1>
        <h2 className="text-3xl md:text-5xl font-display text-advik-navy mb-6 uppercase tracking-tight">
          Page Not Found
        </h2>
        <p className="text-gray-500 mb-10 text-lg">
          The page you're looking for doesn't exist or has been moved to another URL.
        </p>
        <Link 
          to="/" 
          className="inline-block bg-advik-navy text-white px-10 py-4 font-black uppercase tracking-[0.2em] text-xs hover:bg-advik-yellow hover:text-advik-navy transition-all duration-300 shadow-lg hover:shadow-advik-yellow/20"
        >
          Back to Home
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;
