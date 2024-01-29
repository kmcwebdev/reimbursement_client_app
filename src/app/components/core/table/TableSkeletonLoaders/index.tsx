import React from "react";
import MobileListSkeleton from "./MobileListSkeleton";
import TableSkeleton from "./TableSkeleton";

const TableSkeletonLoaders: React.FC<{ length: number }> = ({ length }) => {
  return (
    <>
      <TableSkeleton length={length} />
      <MobileListSkeleton />
    </>
  );
};

export default TableSkeletonLoaders;
