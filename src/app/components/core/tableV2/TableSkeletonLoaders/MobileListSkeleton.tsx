import React from "react";
import SkeletonLoading from "../../SkeletonLoading";

interface MobileListSkeletonProps {}

const MobileListSkeleton: React.FC<MobileListSkeletonProps> = () => {
  return (
    <>
      {Array.from({ length: 4 }).map((_a, i) => (
        <tr
          key={`mobileSkeleton-${i}`}
          className="table-row h-[120px] border-b md:hidden"
        >
          <td className="h-full px-4">
            <div className="flex flex-col justify-between gap-2 py-4">
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <SkeletonLoading className="h-5 w-20 rounded-md" />
                  <SkeletonLoading className="h-5 w-20 rounded-md" />
                </div>

                <div className="flex items-center justify-between">
                  <SkeletonLoading className="h-5 w-40 rounded-md" />
                  <SkeletonLoading className="h-5 w-20 rounded-md" />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <SkeletonLoading className="h-5 w-20 rounded-md" />
                <SkeletonLoading className="h-5 w-20 rounded-md" />
                <SkeletonLoading className="h-5 w-20 rounded-md" />
              </div>
            </div>
          </td>
        </tr>
      ))}
    </>
  );
};

export default MobileListSkeleton;
