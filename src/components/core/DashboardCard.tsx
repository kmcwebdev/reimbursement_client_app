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
    <div className="flex w-[312px] flex-col gap-4 rounded border border-neutral-subtle bg-white p-4">
      <span>{icon}</span>
      <p className="text-neutral-pressed">{label}</p>
      <div className="text-lg font-bold">
        {count} {totalCount && `/ ${totalCount}`}
      </div>
    </div>
  );
};

export default DashboardCard;
