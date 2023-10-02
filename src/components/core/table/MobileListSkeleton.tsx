import React from "react";
import SkeletonLoading from "../SkeletonLoading";

interface MobileListSkeletonProps {}

const MobileListSkeleton: React.FC<MobileListSkeletonProps> = () => {
  return (
    <>
      {Array.from({ length: 10 }).map((_a, i) => (
        <tr key={`mobileSkeleton-${i}`} className="table-row h-16 md:hidden">
          <td className="px-4" colSpan={length}>
            <div className="flex flex-col gap-2 py-4">
              <div className="flex items-center justify-between">
                <SkeletonLoading className="h-6 w-20 rounded-md" />
                <SkeletonLoading className="h-6 w-20 rounded-md" />
              </div>

              <div className="flex items-center justify-between">
                <SkeletonLoading className="h-6 w-40 rounded-md" />
                <SkeletonLoading className="h-6 w-20 rounded-md" />
              </div>

              <div className="flex items-center justify-between">
                <SkeletonLoading className="h-6 w-20 rounded-md" />
                <SkeletonLoading className="h-6 w-20 rounded-md" />
                <SkeletonLoading className="h-6 w-20 rounded-md" />
              </div>
            </div>
          </td>
        </tr>
      ))}
    </>
  );
};

export default MobileListSkeleton;
