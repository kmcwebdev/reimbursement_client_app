/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { zodResolver } from "@hookform/resolvers/zod";
import { type ColumnDef } from "@tanstack/react-table";
import dynamic from "next/dynamic";
import React, { useEffect, useMemo, useState, type ChangeEvent } from "react";
import { useForm } from "react-hook-form";
import { AiOutlinePlusCircle } from "react-icons-all-files/ai/AiOutlinePlusCircle";
import { MdSearch } from "react-icons-all-files/md/MdSearch";
import { Button } from "~/app/components/core/Button";
import Table from "~/app/components/core/table";
import { useAppDispatch, useAppSelector } from "~/app/hook";
import { appApiSlice } from "~/app/rtkQuery";
import { useGetRequestQuery } from "~/features/api/reimbursement-api-slice";
import { useMyRequestsQuery } from "~/features/api/user-api-slice";
import {
  clearReimbursementForm,
  toggleCancelDialog,
  toggleFormDialog,
} from "~/features/state/reimbursement-form-slice";
import { setSelectedItems } from "~/features/state/table-state.slice";
import { useDebounce } from "~/hooks/use-debounce";
import { useDialogState } from "~/hooks/use-dialog-state";
import {
  ReimbursementTypeSchema,
  type ReimbursementFormType,
} from "~/schema/reimbursement-type.schema";
import {
  type IReimbursementRequest,
  type IReimbursementsFilterQuery,
} from "~/types/reimbursement.types";
import { classNames } from "~/utils/classNames";
import SkeletonLoading from "../core/SkeletonLoading";
import Input from "../core/form/fields/Input";
import TableCell from "../core/table/TableCell";
import MemberAnalytics from "./analytics/MemberAnalytics";
import ReimburseForm from "./reimburse-form";

const ReimbursementsCardView = dynamic(
  () => import("~/app/components/reimbursement-view"),
);
const Dialog = dynamic(() => import("~/app/components/core/Dialog"));
const SideDrawer = dynamic(() => import("~/app/components/core/SideDrawer"));
const StatusFilter = dynamic(
  () => import("~/app/components/core/table/filters/StatusFilter"),
);
const ExpenseTypeFilter = dynamic(
  () => import("~/app/components/core/table/filters/ExpenseTypeFilter"),
);
const ReimbursementTypeFilter = dynamic(
  () => import("~/app/components/core/table/filters/ReimbursementTypeFilter"),
);
const DateFiledFilter = dynamic(
  () => import("~/app/components/core/table/filters/DateFiledFilter"),
);

const MyReimbursements: React.FC = () => {
  const {
    formDialogIsOpen,
    cancelDialogIsOpen,
    reimbursementFormValues,
    activeStep,
    particularDetailsFormIsVisible,
    selectedAttachmentMethod,
  } = useAppSelector((state) => state.reimbursementForm);
  const { selectedItems, filters } = useAppSelector(
    (state) => state.pageTableState,
  );

  const [searchParams, setSearchParams] = useState<IReimbursementsFilterQuery>({
    search: undefined,
    expense_type__name: undefined,
    request_type__name: undefined,
    created_at_before: undefined,
    created_at_after: undefined,
  });

  const debouncedSearchText = useDebounce(searchParams.search, 500);
  const [isSearching, setIsSearching] = useState<boolean>(false);

  const dispatch = useAppDispatch();

  const setSelectedItemsState = (value: number[]) => {
    dispatch(setSelectedItems(value));
  };

  const [focusedReimbursementId, setFocusedReimbursementId] =
    useState<number>();

  const { isFetching, data } = useMyRequestsQuery({
    ...filters,
    search: debouncedSearchText,
  });

  const {
    isFetching: focusedReimbursementDataIsFetching,
    isError: focusedReimbursementDataIsError,
    currentData: focusedReimbursementData,
  } = useGetRequestQuery(
    { id: focusedReimbursementId! },
    { skip: !focusedReimbursementId },
  );

  const { isVisible, open, close } = useDialogState();

  const columns = React.useMemo<ColumnDef<IReimbursementRequest>[]>(() => {
    const defaultColumns: ColumnDef<IReimbursementRequest, unknown>[] = [
      {
        id: "request_status",
        accessorKey: "request_status",
        header: "Status",
        filterFn: (row, value: string) => {
          return value.includes(row.original.request_status.name);
        },
        meta: {
          filterComponent: StatusFilter,
        },
      },
      {
        id: "reference_no",
        accessorKey: "reference_no",
        header: "R-ID",
      },
      {
        id: "request_type",
        accessorKey: "request_type",
        header: "Type",
        filterFn: (row, value: string) => {
          return value.includes(row.original.request_type.name);
        },
        meta: {
          filterComponent: ReimbursementTypeFilter,
        },
      },
      {
        id: "particulars",
        accessorKey: "particulars",
        header: "Expense",
        filterFn: (row, id, value: string) => {
          return value.includes(row.original.particulars[0].expense_type.name);
        },
        meta: {
          filterComponent: ExpenseTypeFilter,
        },
        size: 30,
      },
      {
        id: "created_at",
        accessorKey: "created_at",
        header: "Filed",
        filterFn: (row, id, value: string) => {
          return value.includes(row.getValue(id));
        },
        meta: {
          filterComponent: DateFiledFilter,
        },
      },
      {
        id: "total_amount",
        accessorKey: "total_amount",
        header: "Total",
      },
      {
        id: "actions",
        accessorKey: "id",
        header: "",
        setFocusedReimbursementId: setFocusedReimbursementId,
        openDrawer: open,
      },
    ];

    defaultColumns.forEach((a) => {
      a.cell = TableCell;
    });

    return defaultColumns;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  //Form return for reimbursement type selection
  const useReimbursementTypeFormReturn = useForm<ReimbursementFormType>({
    resolver: useMemo(() => {
      if (activeStep === 0) {
        return zodResolver(ReimbursementTypeSchema);
      }
    }, [activeStep]),
    defaultValues: useMemo(() => {
      if (reimbursementFormValues.request_type) {
        return {
          request_type: reimbursementFormValues.request_type,
        };
      }
    }, [reimbursementFormValues]),
    mode: "onChange",
  });

  /***Closes the form and open cancel dialog */
  const handleOpenCancelDialog = () => {
    const selectedReimbursementType =
      useReimbursementTypeFormReturn.getValues("request_type");
    dispatch(toggleFormDialog());

    if (selectedReimbursementType) {
      dispatch(toggleCancelDialog());
    }
  };

  /**Continue reimbursement request cancellation */
  const handleConfirmCancellation = () => {
    dispatch(clearReimbursementForm());
    useReimbursementTypeFormReturn.reset();
    dispatch(toggleCancelDialog());
  };

  /**Aborts reimbursement request cancellation */
  const handleAbortCancellation = () => {
    dispatch(toggleCancelDialog());
    dispatch(
      appApiSlice.util.invalidateTags([
        {
          type: "ExpenseTypes",
          id: useReimbursementTypeFormReturn.getValues("request_type"),
        },
      ]),
    );
    dispatch(toggleFormDialog());
  };

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setIsSearching(true);
    const searchValue = e.target.value;
    setSearchParams({ ...searchParams, search: searchValue });
  };

  useEffect(() => {
    if (isSearching && !isFetching) {
      setIsSearching(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFetching]);

  return (
    <>
      <div className="grid bg-neutral-50 md:gap-y-4 lg:p-5">
        <MemberAnalytics />

        <div className="flex items-center justify-between p-4 lg:p-0">
          <h4>Reimbursements</h4>
          {!isSearching && isFetching ? (
            <SkeletonLoading className="h-5 w-5 rounded-full md:h-10 md:w-[5rem] md:rounded" />
          ) : (
            <>
              <div
                className={classNames(
                  "flex flex-col gap-2 md:flex-row md:items-center",
                )}
              >
                <Input
                  name="searchFilter"
                  placeholder="Find anything..."
                  loading={isFetching && isSearching}
                  className="w-full md:w-64"
                  icon={MdSearch}
                  defaultValue={filters.search}
                  onChange={handleSearch}
                />

                <Button
                  className="hidden md:block"
                  onClick={() => dispatch(toggleFormDialog())}
                >
                  Reimburse
                </Button>

                <Button
                  buttonType="text"
                  className="block md:hidden"
                  onClick={() => dispatch(toggleFormDialog())}
                >
                  <AiOutlinePlusCircle className="h-5 w-5" />
                </Button>
              </div>
            </>
          )}
        </div>

        <Table
          type="reimbursements"
          loading={isFetching}
          data={data?.results}
          columns={columns}
          handleMobileClick={(e: number) => {
            setFocusedReimbursementId(e);
            open();
          }}
          tableState={{
            filters,
            selectedItems,
          }}
          tableStateActions={{
            setSelectedItems: setSelectedItemsState,
          }}
          pagination={{
            count: data?.count!,
            next: data?.next!,
            previous: data?.previous!,
          }}
        />
      </div>

      <Dialog
        title={
          activeStep === 0
            ? "Reimbursement Type"
            : activeStep === 1 && !particularDetailsFormIsVisible
              ? "Add Particulars"
              : activeStep === 1 && particularDetailsFormIsVisible
                ? "Particular"
                : activeStep === 2 && !selectedAttachmentMethod
                  ? "File a Reimbursements"
                  : activeStep === 2 && selectedAttachmentMethod === "capture"
                    ? "Take Photo"
                    : "Upload Files"
        }
        isVisible={formDialogIsOpen}
        close={handleOpenCancelDialog}
        hideCloseIcon
      >
        <ReimburseForm
          formReturn={useReimbursementTypeFormReturn}
          handleOpenCancelDialog={handleOpenCancelDialog}
        />
      </Dialog>

      <Dialog
        title="Cancel Reimbursements?"
        isVisible={cancelDialogIsOpen}
        close={handleAbortCancellation}
        hideCloseIcon
      >
        <div className="flex flex-col gap-8 pt-8">
          <p className="text-neutral-800">
            Are you sure you want to cancel reimbursement request?
          </p>

          <div className="flex items-center gap-4">
            <Button
              variant="neutral"
              buttonType="outlined"
              className="w-1/2"
              onClick={handleAbortCancellation}
            >
              No
            </Button>
            <Button
              variant="danger"
              className="w-1/2"
              onClick={handleConfirmCancellation}
            >
              Yes, Cancel
            </Button>
          </div>
        </div>
      </Dialog>

      <SideDrawer
        title={
          !focusedReimbursementDataIsFetching && focusedReimbursementData
            ? focusedReimbursementData.reference_no
            : focusedReimbursementDataIsError
              ? "Error"
              : "..."
        }
        isVisible={isVisible}
        closeDrawer={close}
      >
        <ReimbursementsCardView
          closeDrawer={close}
          isLoading={focusedReimbursementDataIsFetching}
          isError={focusedReimbursementDataIsError}
          data={focusedReimbursementData}
          setFocusedReimbursementId={setFocusedReimbursementId}
        />
      </SideDrawer>
    </>
  );
};

export default MyReimbursements;
