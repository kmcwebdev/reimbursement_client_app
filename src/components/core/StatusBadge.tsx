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
}




const statusVariant = cva(
  "h-6 max-w-[77px] rounded text-sm border border-opacity-10 grid place-items-center px-2",
  {
    variants: {
      status: {
        processing: "bg-[#F5F3FF] text-[#7C3AED] border-[#7C3AED]",
        pending: "bg-[#FEF8EC] text-[#D89B0D] border-[#D89B0D]",
        approved: "bg-[#F0FDF8] text-success-default border-success-default",
        rejected: "bg-[#FEF3F1] text-danger-default border-danger-default",
        credited:
          "bg-[#F0F5FD] text-informative-default border-informative-default",

        default: "bg-neutral-50 text-neutral-default border-neutral-default",
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
