import React, { type PropsWithChildren } from "react";
import { classNames } from "~/utils/classNames";

interface PlaceholderProps extends PropsWithChildren {
  hasError?: boolean;
}

const Placeholder: React.FC<PlaceholderProps> = ({ hasError, children }) => {
  return (
    <div
      className={classNames(
        "text-xs font-light",
        hasError ? "text-red-600" : "text-neutral-800",
      )}
    >
      {children}
    </div>
  );
};

export default Placeholder;
