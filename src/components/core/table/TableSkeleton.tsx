import React from "react";
import SkeletonLoading from "../SkeletonLoading";

const TableSkeleton: React.FC = () => {
  return (
    <div className="relative flex flex-col gap-4 overflow-hidden">
      <div className="min-h-[300px] overflow-x-auto bg-white">
        <div className=" w-full whitespace-nowrap bg-white">
          <div className="flex h-12 items-center justify-evenly border-b border-neutral-300 text-xs">
            <SkeletonLoading className="h-5 w-14 rounded-md" />
            <SkeletonLoading className="h-5 w-14 rounded-md" />
            <SkeletonLoading className="h-5 w-14 rounded-md" />
            <SkeletonLoading className="h-5 w-14 rounded-md" />
            <SkeletonLoading className="h-5 w-14 rounded-md" />
            <SkeletonLoading className="h-5 w-14 rounded-md" />
            <SkeletonLoading className="h-5 w-14 rounded-md" />
          </div>
          <div className="min-h-[calc(300px-3rem)]">
            {Array.from({ length: 10 }).map((_a, i) => (
              <div
                key={i}
                className="flex h-12 items-center justify-evenly border-b"
              >
                <SkeletonLoading className="h-5 w-14 rounded-md" />
                <SkeletonLoading className="h-5 w-14 rounded-md" />
                <SkeletonLoading className="h-5 w-14 rounded-md" />
                <SkeletonLoading className="h-5 w-14 rounded-md" />
                <SkeletonLoading className="h-5 w-14 rounded-md" />
                <SkeletonLoading className="h-5 w-14 rounded-md" />
                <SkeletonLoading className="h-5 w-14 rounded-md" />
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* <Pagination table={table} /> */}
    </div>
  );
};

export default TableSkeleton;
