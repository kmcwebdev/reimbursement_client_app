import React, { type PropsWithChildren } from "react";
import { barlow_Condensed } from "~/styles/fonts/barlowCondensed";
import { karla } from "~/styles/fonts/karla";
import { classNames } from "~/utils/classNames";

const FullPageLayout: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <div
      className={classNames(
        `${karla.variable} ${barlow_Condensed.variable} h-screen w-screen flex-1 overflow-y-auto bg-neutral-200 font-karla`,
      )}
    >
      <div className="grid h-full w-full place-items-center">{children}</div>
    </div>
  );
};

export default FullPageLayout;
