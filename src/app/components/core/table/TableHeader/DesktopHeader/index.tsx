import { flexRender, type HeaderGroup } from "@tanstack/react-table";
import React from "react";
import { FaSpinner } from "react-icons-all-files/fa/FaSpinner";
import { type IReimbursementRequest } from "~/types/reimbursement.types";
import { type CustomFilterMeta, type TableType } from "../..";
import FilterView from "./FilterView";

interface DesktopHeaderProps {
  isLoading: boolean;
  data?: IReimbursementRequest[];
  headerGroups: HeaderGroup<IReimbursementRequest>[];
  numberOfColumns: number;
  type: TableType;
}

const DesktopHeader: React.FC<DesktopHeaderProps> = ({
  isLoading,
  data,
  headerGroups,
  numberOfColumns,
  type,
}) => {
  return (
    <thead className="sticky top-0 z-[5] hidden h-12 w-full rounded-t-sm bg-white text-xs md:table-header-group">
      {isLoading && (
        <tr>
          <th colSpan={42} className="h-12 border-b text-left">
            <div className="flex items-center gap-4 px-4 text-neutral-600">
              <FaSpinner className="h-4 w-4 animate-spin" />
              <p>Fetching data. Please wait...</p>
            </div>
          </th>
        </tr>
      )}

      {!isLoading &&
        data &&
        headerGroups.map((headerGroup, i) => (
          <tr key={i} className="h-12">
            {headerGroup.headers.map((header, index) => {
              return (
                <th
                  key={`header-${index}`}
                  colSpan={header.colSpan}
                  style={{
                    width:
                      header.getSize() === Number.MAX_SAFE_INTEGER
                        ? "auto"
                        : header.getSize(),
                  }}
                >
                  <div className="flex items-center justify-between first:pl-4 last:pr-4">
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}

                    <div className="mt-1">
                      {header.column.columnDef?.meta &&
                        (header.column.columnDef?.meta as CustomFilterMeta)
                          .filterComponent &&
                        (
                          header.column.columnDef?.meta as CustomFilterMeta
                        ).filterComponent()}
                    </div>
                  </div>
                </th>
              );
            })}
          </tr>
        ))}

      <FilterView colSpan={numberOfColumns} type={type} />
    </thead>
  );
};

export default DesktopHeader;
