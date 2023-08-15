import { cva } from "class-variance-authority";
import React from "react";
import { classNames } from "~/utils/classNames";

export type StatusType =
  | "processing"
  | "pending"
  | "approved"
  | "rejected"
  | "credited";

interface StatusBadgeProps {
  status: StatusType;
}

const statusVariant = cva(
  "h-6 max-w-[77px] rounded text-sm border border-opacity-10 grid place-items-center",
  {
    variants: {
      status: {
        processing: "bg-[#F5F3FF] text-[#7C3AED] border-[#7C3AED]",
        pending: "bg-[#FEF8EC] text-[#D89B0D] border-[#D89B0D]",
        approved: "bg-[#F0FDF8] text-success-default border-success-default",
        rejected: "bg-[#FEF3F1] text-danger-default border-danger-default",
        credited:
          "bg-[#F0F5FD] text-informative-default border-informative-default",
      },
    },
  },
);

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  return (
    <div className={classNames("capitalize", statusVariant({ status }))}>
      {status}
    </div>
  );
};

export default StatusBadge;
