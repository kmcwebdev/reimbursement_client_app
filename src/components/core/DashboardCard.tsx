import React from "react";
import SkeletonLoading from "./SkeletonLoading";

interface DashboardCardProps {
  icon: JSX.Element;
  label: string;
  count: number;
  totalCount?: number;
}

const DashboardCard: React.FC<DashboardCardProps> = ({
  icon,
  label,
  count,
  totalCount,
}) => {
  return (
    <div className="flex h-[120px] w-full flex-col gap-2 rounded border border-neutral-300 bg-white p-4 md:w-[312px]">
      <span>{icon}</span>
      <p className="text-neutral-800">{label}</p>
      <div className="text-lg font-bold text-neutral-900">
        {count} {totalCount && `/ ${totalCount}`}
      </div>
    </div>
  );
};

export default DashboardCard;

export const DashboardCardSkeleton: React.FC = () => {
  return (
    <div className="flex h-[120px] w-full flex-col gap-2 rounded border border-neutral-300 bg-white p-4 md:w-[312px]">
      <SkeletonLoading className="h-5 w-5 rounded-md" />
      <SkeletonLoading className="h-5 w-44 rounded-md" />
      <SkeletonLoading className="h-7 w-16 rounded-md" />
    </div>
  );
};
