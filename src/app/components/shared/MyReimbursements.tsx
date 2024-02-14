/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import { zodResolver } from "@hookform/resolvers/zod";
import { type ColumnDef } from "@tanstack/react-table";
import dynamic from "next/dynamic";
import React, { useEffect, useMemo, useState, type ChangeEvent } from "react";
import { useForm } from "react-hook-form";
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
import {
  setFocusedReimbursementId,
  toggleSideDrawer,
} from "~/features/state/table-state.slice";
import { useDebounce } from "~/hooks/use-debounce";
import {
  ReimbursementTypeSchema,
  type ReimbursementFormType,
} from "~/schema/reimbursement-type.schema";
import {
  type IReimbursementRequest,
  type IReimbursementsFilterQuery,
} from "~/types/reimbursement.types";
import TableCell from "../core/table/TableCell";
import MemberAnalytics from "./analytics/MemberAnalytics";

const ReimbursementsCardView = dynamic(
  () => import("~/app/components/reimbursement-view"),
);
const CreateReimbursementDialog = dynamic(
  () => import("./dialogs/CreateReimbursementDialog"),
);

const CancelReimbursementCreationDialog = dynamic(
  () => import("./dialogs/CancelReimbursementCreationDialog"),
);

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
  const { reimbursementFormValues, activeStep } = useAppSelector(
    (state) => state.reimbursementForm,
  );

  const { filters, focusedReimbursementId } = useAppSelector(
    (state) => state.pageTableState,
  );

  const [searchParams, setSearchParams] = useState<IReimbursementsFilterQuery>({
    search: undefined,
    expense_type__id: undefined,
    request_type__id: undefined,
    created_at_before: undefined,
    created_at_after: undefined,
  });

  const debouncedSearchText = useDebounce(searchParams.search, 500);
  const [isSearching, setIsSearching] = useState<boolean>(false);

  const dispatch = useAppDispatch();

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
      <div className="grid bg-neutral-50 md:gap-y-4 md:p-5">
        <MemberAnalytics />

        <Table
          header={{
            isLoading: !isSearching && isFetching,
            title: "Reimbursements",
            button: "create",
            buttonClickHandler: () => dispatch(toggleFormDialog()),
            buttonIsVisible: true,
            handleSearch: handleSearch,
            searchIsLoading: isFetching,
          }}
          type="reimbursement"
          loading={isFetching}
          data={data?.results}
          columns={columns}
          handleMobileClick={(e: number) => {
            dispatch(setFocusedReimbursementId(e));
            dispatch(toggleSideDrawer());
          }}
          pagination={{
            count: data?.count!,
            next: data?.next!,
            previous: data?.previous!,
          }}
        />
      </div>

      <CreateReimbursementDialog
        formReturn={useReimbursementTypeFormReturn}
        onAbort={handleOpenCancelDialog}
      />

      <CancelReimbursementCreationDialog
        onAbort={handleAbortCancellation}
        onConfirm={handleConfirmCancellation}
      />

      <SideDrawer
        title={
          !focusedReimbursementDataIsFetching && focusedReimbursementData
            ? focusedReimbursementData.reference_no
            : focusedReimbursementDataIsError
              ? "Error"
              : "..."
        }
      >
        <ReimbursementsCardView
          isLoading={focusedReimbursementDataIsFetching}
          isError={focusedReimbursementDataIsError}
          data={focusedReimbursementData}
        />
      </SideDrawer>
    </>
  );
};

export default MyReimbursements;
