import React, { type PropsWithChildren } from "react";
import { type IconType } from "react-icons-all-files";
import { MdBrowserNotSupported } from "react-icons-all-files/md/MdBrowserNotSupported";

interface EmptyStateProps extends PropsWithChildren {
  title: string;
  description: string;
  icon?: IconType;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon: Icon = MdBrowserNotSupported as IconType,
  children,
}) => {
  return (
    <div className="grid place-items-center gap-4">
      <div className="flex flex-col items-center gap-5">
        {Icon && <Icon className="h-8 w-8 text-neutral-600" />}
        <h4 className="font-barlowCondensed font-semibold">{title}</h4>
        <p className="text-center text-neutral-600">{description}</p>
      </div>

      {children && <div className="flex justify-center">{children}</div>}
    </div>
  );
};

export default EmptyState;
