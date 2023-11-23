import React from "react";
import SkeletonLoading from "../SkeletonLoading";
interface TableSkeletonProps {
  length: number;
}

const TableSkeleton: React.FC<TableSkeletonProps> = ({ length }) => {
  return (
    <>
      {Array.from({ length: 10 }).map((_a, i) => (
        <tr key={`web-${i}`} className="hidden h-12 md:table-row">
          {Array.from({
            length,
          }).map((_a, index) => (
            <td key={`child-${index}-${i}`} className="px-2">
              <SkeletonLoading className="h-6 w-20 rounded-md" />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
};

export default TableSkeleton;
