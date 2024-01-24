import { cva } from "class-variance-authority";
import React from "react";
import { classNames } from "~/utils/classNames";

export type StatusType =
  | "processing"
  | "pending"
  | "approved"
  | "rejected"
  | "credited"
  | "cancelled"
  | "on-hold"
  | "default";

type StatusBadgeProps = {
  status: StatusType;
  label?: string;
};

const statusVariant = cva(
  "h-6 max-w-[92px] rounded text-sm border border-opacity-20 px-2 flex items-center justify-center select-none",
  {
    variants: {
      status: {
        processing: "bg-[#F5F3FF] text-[#7C3AED] border-[#7C3AED]",
        pending: "bg-yellow-50 text-yellow-600 border-yellow-600",
        approved: "bg-green-50 text-green-600 border-green-600",
        rejected: "bg-red-50 text-red-600 border-red-600",
        cancelled: "bg-red-50 text-red-600 border-red-600",
        "on-hold": "bg-neutral-50 text-neutral-900 border-neutral-600",
        credited: "bg-blue-50 text-blue-600 border-blue-600",
        default: "bg-neutral-50 text-neutral-900 border-neutral-900",
      },
    },
  },
);

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, label }) => {
  return (
    <div
      className={classNames(
        "text-xs capitalize md:text-sm",
        status === "default" &&
          label &&
          label.length >= 25 &&
          "block min-w-[150px]",
        statusVariant({ status }),
      )}
    >
      <p
        className={classNames(
          status === "default" && label && label.length >= 25
            ? "block truncate"
            : "",
        )}
      >
        {label ? label : status}
      </p>
    </div>
  );
};

export default StatusBadge;
