import React from "react";

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
    <div className="flex h-[120px] w-full flex-col gap-2 rounded border border-neutral-subtle bg-white p-4 md:w-[312px]">
      <span>{icon}</span>
      <p className="text-neutral-pressed">{label}</p>
      <div className="text-lg font-bold">
        {count} {totalCount && `/ ${totalCount}`}
      </div>
    </div>
  );
};

export default DashboardCard;
