import React from "react";
import SkeletonLoading from "../core/SkeletonLoading";

const ReimbursementViewSkeleton: React.FC = () => {
  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-1 flex-col gap-8 p-4">
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2">
            <SkeletonLoading className="h-5 w-20 rounded" />
            <SkeletonLoading className="h-5 w-40 rounded" />
          </div>
          <div className="grid grid-cols-2">
            <SkeletonLoading className="h-5 w-20 rounded" />
            <SkeletonLoading className="h-5 w-40 rounded" />
          </div>
          <div className="grid grid-cols-2">
            <SkeletonLoading className="h-5 w-20 rounded" />
            <SkeletonLoading className="h-5 w-40 rounded" />
          </div>
          <div className="grid grid-cols-2">
            <SkeletonLoading className="h-5 w-20 rounded" />
            <SkeletonLoading className="h-5 w-40 rounded" />
          </div>
          <div className="grid grid-cols-2">
            <SkeletonLoading className="h-5 w-20 rounded" />
            <SkeletonLoading className="h-5 w-40 rounded" />
          </div>
          <div className="grid grid-cols-2">
            <SkeletonLoading className="h-5 w-20 rounded" />
            <SkeletonLoading className="h-5 w-40 rounded" />
          </div>
        </div>
        <div className="space-y-4">
          <SkeletonLoading className="h-5 w-40 rounded" />
          <SkeletonLoading className="h-10 w-full rounded" />
        </div>

        <div className="space-y-4">
          <SkeletonLoading className="h-5 w-40 rounded" />
          <SkeletonLoading className="h-10 w-full rounded" />
        </div>

        <div className="space-y-4">
          <SkeletonLoading className="h-5 w-40 rounded" />
          <SkeletonLoading className="h-10 w-full rounded" />
        </div>

        <div className="space-y-4">
          <SkeletonLoading className="h-5 w-40 rounded" />
          <SkeletonLoading className="h-10 w-full rounded" />
        </div>
      </div>

      <div className="grid h-[72px] grid-cols-2 gap-2 border-t px-4 pt-4">
        <SkeletonLoading className="h-10 w-full rounded" />
        <SkeletonLoading className="h-10 w-full rounded" />
      </div>
    </div>
  );
};

export default ReimbursementViewSkeleton;
