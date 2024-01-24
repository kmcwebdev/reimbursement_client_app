import React from "react";
import SkeletonLoading from "../SkeletonLoading";
interface TableSkeletonProps {
  length: number;
}

const TableSkeleton: React.FC<TableSkeletonProps> = ({ length }) => {
  return (
    <>
      {Array.from({ length: 6 }).map((_a, i) => (
        <tr key={`web-${i}`} className="hidden h-16 border-b md:table-row">
          {Array.from({
            length,
          }).map((_a, index) => (
            <td key={`child-${index}-${i}`} className="px-4">
              <div className="justify-center">
                <SkeletonLoading className="h-5 w-full rounded-md" />
              </div>
            </td>
          ))}
        </tr>
      ))}
    </>
  );
};

export default TableSkeleton;
