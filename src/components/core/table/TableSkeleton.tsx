import React from "react";
import SkeletonLoading from "../SkeletonLoading";
interface TableSkeletonProps {
  length: number;
}

const TableSkeleton: React.FC<TableSkeletonProps> = ({ length }) => {
  return (
    <div className="h-[30rem] overflow-hidden">
      <table className="w-full whitespace-nowrap">
        <tbody className="h-full rounded-b-sm bg-white shadow-sm">
          {Array.from({ length: 10 }).map((_a, i) => (
            <tr key={i} className="h-12">
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
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableSkeleton;
