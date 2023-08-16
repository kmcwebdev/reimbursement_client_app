import { type Table } from "@tanstack/react-table";
import React from "react";
import { type Reimbursement } from ".";
import { Button } from "../Button";

interface PaginationProps {
  table: Table<Reimbursement>;
}

const Pagination: React.FC<PaginationProps> = ({ table }) => {
  return (
    <div className="flex items-center justify-between gap-2 border-t border-[#F1F2F4] p-2">
      <div className="flex items-center gap-2 text-neutral-default">
        Showing Page {table.getState().pagination.pageIndex + 1} to{" "}
        {table.getState().pagination.pageIndex + 1 * 10} of{" "}
        {table.getPageCount() * 10} results
      </div>
      <div className="flex items-center gap-2">
        <Button
          buttonType="outlined"
          variant="neutral"
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          buttonType="outlined"
          variant="neutral"
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default Pagination;
