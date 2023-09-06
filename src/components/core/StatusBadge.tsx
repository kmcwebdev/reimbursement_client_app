import { cva } from "class-variance-authority";
import React from "react";
import { classNames } from "~/utils/classNames";

export type StatusType =
  | "processing"
  | "pending"
  | "approved"
  | "rejected"
  | "credited"
  | "default";

type StatusBadgeProps = {
  status: StatusType;
  label?: string;
};

const statusVariant = cva(
  "h-6 max-w-[77px] rounded text-sm border border-opacity-10 grid place-items-center px-2",
  {
    variants: {
      status: {
        processing: "bg-[#F5F3FF] text-[#7C3AED] border-[#7C3AED]",
        pending: "bg-orange-50 text-orange-600 border-orange-600",
        approved: "bg-green-50 text-green-600 border-green-600",
        rejected: "bg-red-50 text-red-600 border-red-600",
        credited: "bg-blue-50 text-blue-600 border-blue-600",
        default: "bg-neutral-50 text-neutral-600 border-neutral-600",
      },
    },
  },
);

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, label }) => {
  return (
    <div className={classNames("capitalize", statusVariant({ status }))}>
      {label ? label : status}
    </div>
  );
};

export default StatusBadge;
