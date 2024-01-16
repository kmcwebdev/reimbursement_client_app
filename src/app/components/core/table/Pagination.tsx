import React from "react";
import { type IResponsePagination } from "~/types/global-types";
import { Button } from "../Button";

interface PaginationProps {
  data: IResponsePagination;
}

const Pagination: React.FC<PaginationProps> = ({ data }) => {
  return (
    <div className="flex items-center justify-between gap-2 border-t border-neutral-300 bg-white px-2 py-4 lg:px-0 lg:pb-0 lg:pt-5">
      {data && (
        <>
          <div className="flex items-center gap-2 text-neutral-800">
            Showing Page 1 to {data.count < 10 ? data.count : 10} of{" "}
            {data.count} results
          </div>
          <div className="flex items-center gap-2">
            <Button
              buttonType="outlined"
              variant="neutral"
              disabled={!data.previous}
            >
              Previous
            </Button>
            <Button
              buttonType="outlined"
              variant="neutral"
              disabled={!data.next}
            >
              Next
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default Pagination;
