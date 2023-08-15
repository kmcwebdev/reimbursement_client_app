import { AnimatePresence, motion } from "framer-motion";
import React, { type PropsWithChildren } from "react";

const PageAnimation: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 20 }}
        animate={{ y: 0, opacity: 100 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default PageAnimation;
