import React from "react";
import SkeletonLoading from "./SkeletonLoading";

interface DashboardCardProps {
  icon: JSX.Element;
  label: string;
  count?: string;
  totalCount?: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({
  icon,
  label,
  count,
  totalCount,
}) => {
  return (
    <>
      <div className="hidden h-[120px] w-full flex-col gap-2 rounded border border-neutral-300 bg-white p-4 sm:flex md:w-[312px]">
        <span>{icon}</span>
        <p className="text-sm text-neutral-800 md:text-base">{label}</p>
        <div className="text-md font-bold text-neutral-900 lg:text-lg">
          {count && count}
          {totalCount?.toString() ? "/" : ""}
          {totalCount && `${totalCount}`}
        </div>
      </div>
      <div className="flex h-[80px] w-full flex-col justify-between rounded border border-neutral-300 bg-white px-3 py-4 sm:hidden sm:h-[120px] md:w-[312px]">
        <div className="flex justify-between">
          <span>{icon}</span>
          <div className="text-md font-bold text-neutral-900 lg:text-lg">
            {count && count}
            {totalCount?.toString() && "/"}
            {totalCount && `${totalCount}`}
          </div>
        </div>
        <p className="truncate text-sm text-neutral-800 md:text-base">
          {label}
        </p>
      </div>
    </>
  );
};

export default DashboardCard;

export const DashboardCardSkeleton: React.FC = () => {
  return (
    <div className="flex h-[80px] w-full flex-col justify-between gap-2 rounded border border-neutral-300 bg-white px-3 py-4 md:h-[120px] md:w-[312px] md:px-4">
      <div className="flex justify-between">
        <SkeletonLoading className="h-5 w-5 rounded-md" />
        <SkeletonLoading className="h-5 w-5 rounded-md md:hidden" />
      </div>
      <SkeletonLoading className="h-5 w-20 rounded-md md:w-44" />
      <SkeletonLoading className="hidden h-7 w-12 rounded-md md:flex" />
    </div>
  );
};
