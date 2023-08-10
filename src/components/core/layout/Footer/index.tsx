import React, { type PropsWithChildren } from "react";

const Footer: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="absolute bottom-0 flex h-16 w-full items-center justify-end border-t bg-white p-4 shadow-sm">
      {children}
    </div>
  );
};

export default Footer;
