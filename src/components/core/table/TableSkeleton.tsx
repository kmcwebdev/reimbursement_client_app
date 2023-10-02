import React from "react";
import SkeletonLoading from "../SkeletonLoading";
interface TableSkeletonProps {
  length: number;
}

const TableSkeleton: React.FC<TableSkeletonProps> = ({ length }) => {
  return (
    <>
      {Array.from({ length: 10 }).map((_a, i) => (
        <>
          <tr key={i} className="hidden h-12 md:table-row">
            <>
              {Array.from({
                length,
              }).map((_a, i) => (
                <td key={i} className="px-2">
                  <SkeletonLoading className="h-6 w-20 rounded-md" />
                </td>
              ))}
            </>
          </tr>
          <tr key={i} className="table-row h-16 md:hidden">
            <td key={i} className="px-4" colSpan={length}>
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
        </>
      ))}
    </>
  );
};

export default TableSkeleton;
