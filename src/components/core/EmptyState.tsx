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
        {Icon && <Icon className="h-8 w-8 text-neutral-default" />}
        <h4 className="font-semibold">{title}</h4>
        <p className="text-neutral-default">{description}</p>
      </div>

      <div className="flex justify-center">{children}</div>
    </div>
  );
};

export default EmptyState;
