import React from "react";
import { useAppDispatch, useAppSelector } from "~/app/hook";
import { setPageTableFilters } from "~/features/state/table-state.slice";
import { type IResponsePagination } from "~/types/global-types";
import { Button } from "../Button";
import SkeletonLoading from "../SkeletonLoading";

interface PaginationProps {
  data: IResponsePagination;
  currentPageLength: number;
}

const Pagination: React.FC<PaginationProps> = ({ data, currentPageLength }) => {
  const dispatch = useAppDispatch();
  const { filters } = useAppSelector((state) => state.pageTableState);

  const handleNext = () => {
    const currentPage = filters.page;
    dispatch(
      setPageTableFilters({
        ...filters,
        page: currentPage ? currentPage + 1 : 2,
      }),
    );
  };

  const handlePrevious = () => {
    const currentPage = filters.page;
    dispatch(
      setPageTableFilters({
        ...filters,
        page:
          currentPage === 2
            ? undefined
            : currentPage
              ? currentPage - 1
              : undefined,
      }),
    );
  };

  return (
    <div className="flex items-center justify-between gap-2 border-t border-neutral-300 bg-white px-2 py-4 lg:px-0 lg:pb-0 lg:pt-5">
      {data && (
        <>
          <div className="flex items-center gap-2 text-neutral-800">
            Showing{" "}
            {filters.page
              ? filters.page > 1
                ? filters.page + (filters.page - 1) * 9
                : 1
              : 1}{" "}
            to{" "}
            {filters.page
              ? (filters.page - 1) * 10 + currentPageLength
              : currentPageLength}{" "}
            of {data.count} results
          </div>
          <div className="flex items-center gap-2">
            <Button
              buttonType="outlined"
              variant="neutral"
              disabled={!data.previous}
              onClick={handlePrevious}
            >
              Previous
            </Button>
            <Button
              buttonType="outlined"
              variant="neutral"
              disabled={!data.next}
              onClick={handleNext}
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

export const PaginationSkeletonLoading: React.FC = () => {
  return (
    <div className=" flex items-center justify-between gap-2 border-t border-neutral-300 bg-white px-2 py-4 lg:px-0 lg:pb-0 lg:pt-5">
      <SkeletonLoading className="h-5 w-48 rounded-md" />
      <div className="flex items-center gap-2">
        <Button buttonType="outlined" variant="neutral" disabled={true}>
          Previous
        </Button>
        <Button buttonType="outlined" variant="neutral" disabled={true}>
          Next
        </Button>
      </div>
    </div>
  );
};
