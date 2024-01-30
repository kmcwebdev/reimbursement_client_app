import { cva } from "class-variance-authority";
import React from "react";
import { classNames } from "~/utils/classNames";
import { type StatusType } from "./StatusBadge";

type StatusBadgeProps = {
  status: StatusType;
};

const statusVariant = cva("h-2 w-2 rounded-full", {
  variants: {
    status: {
      processing: "bg-[#7C3AED]",
      pending: "bg-yellow-600",
      approved: "bg-green-600",
      rejected: "bg-red-600",
      cancelled: "bg-red-600",
      "on-hold": "bg-neutral-600",
      credited: "bg-blue-600",
      default: "bg-neutral-600",
    },
  },
});

const StatusDot: React.FC<StatusBadgeProps> = ({ status }) => {
  return <div className={classNames(statusVariant({ status }))}></div>;
};

export default StatusDot;
