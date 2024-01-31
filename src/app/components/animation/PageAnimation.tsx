import { AnimatePresence, m } from "framer-motion";
import React, { type PropsWithChildren } from "react";

interface PageAnimationProps extends PropsWithChildren {
  className?: string;
}

const PageAnimation: React.FC<PageAnimationProps> = ({
  children,
  className,
}) => {
  return (
    <AnimatePresence initial={true}>
      <m.div
        viewport={{ once: true }}
        initial={{ y: 20 }}
        animate={{ y: 0, opacity: 100 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className={className}
      >
        {children}
      </m.div>
    </AnimatePresence>
  );
};

export default PageAnimation;
