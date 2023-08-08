import React, { type PropsWithChildren } from "react";
import { type IconType } from "react-icons-all-files";

interface EmptyStateProps extends PropsWithChildren {
  title: string;
  description: string;
  icon?: IconType;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon: Icon,
  children,
}) => {
  return (
    <div className="grid place-items-center gap-4">
      <div className="flex flex-col items-center gap-2">
        {Icon && <Icon className="h-8 w-8 text-neutral-subtle-active" />}
        <p className="font-semibold">{title}</p>
        <p className="text-neutral-normal">{description}</p>
      </div>

      <div className="flex justify-center">{children}</div>
    </div>
  );
};

export default EmptyState;
