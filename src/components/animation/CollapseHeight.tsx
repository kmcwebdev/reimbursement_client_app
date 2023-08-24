import { AnimatePresence, motion, type HTMLMotionProps } from "framer-motion";
import React, { type PropsWithChildren } from "react";

interface Props extends HTMLMotionProps<"div"> {
  isVisible: boolean;
  yOffset?: number;
  className?: string;
}

const CollapseHeightAnimation: React.FC<PropsWithChildren<Props>> = ({
  isVisible,
  children,
  className,
  ...rest
}) => {
  return (
    <AnimatePresence initial={false}>
      {isVisible && (
        <motion.div
          {...rest}
          key="content"
          className={"overflow-hidden " + className}
          initial="collapsed"
          animate="open"
          exit="collapsed"
          variants={{
            open: { opacity: 1, height: "auto" },
            collapsed: { opacity: 0, height: 0 },
          }}
          transition={{ duration: 0.6, ease: [0.04, 0.62, 0.23, 0.98] }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CollapseHeightAnimation;
