import React from 'react';
import { motion } from 'framer-motion';

const Button = ({ text }) => {
  return (
    <div className="relative overflow-hidden" style={{ width: "200px", height: "40px" }}>
      <motion.div
        initial={{ y: "0%" }}
        whileHover={{ y: "-100%" }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="flex flex-col"
      >
        <span>{text}</span>
        <span>{text}</span>
      </motion.div>
    </div>
  );
};

export default Button;
