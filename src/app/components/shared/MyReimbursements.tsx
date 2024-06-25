/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import { zodResolver } from "@hookform/resolvers/zod";
import { type ColumnDef } from "@tanstack/react-table";
import dynamic from "next/dynamic";
import React, { useEffect, useMemo, useState, type ChangeEvent } from "react";
import { useForm } from "react-hook-form";
import SideDrawerService from "~/app/api/services/side-drawer-service";
import TableService from "~/app/api/services/table-service";
import { useAppDispatch, useAppSelector } from "~/app/hook";
import { appApiSlice } from "~/app/rtkQuery";
import {
  _setTempAttachedFiles,
  clearReimbursementForm,
  setReimbursementFormValues,
  toggleCancelDialog,
  toggleFormDialog,
} from "~/features/state/reimbursement-form-slice";
import { setUserDashboardFilters } from "~/features/state/user-dashboard-state-slice";
import { useDebounce } from "~/hooks/use-debounce";
import { reimbursementTypeSchema } from "~/schema/reimbursement-type.schema";
import {
  type QueryFilter,
  type ReimbursementFormType,
  type ReimbursementRequest,
} from "~/types/reimbursement.types";
import { showToast } from "../core/Toast";
import TableV2 from "../core/tableV2";
import TableCell from "../core/tableV2/TableCell";
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
  () => import("~/app/components/core/tableV2/filters/StatusFilter"),
);
const ExpenseTypeFilter = dynamic(
  () => import("~/app/components/core/tableV2/filters/ExpenseTypeFilter"),
);
const ReimbursementTypeFilter = dynamic(
  () => import("~/app/components/core/tableV2/filters/ReimbursementTypeFilter"),
);
const DateFiledFilter = dynamic(
  () => import("~/app/components/core/tableV2/filters/DateFiledFilter"),
);

const MyReimbursements: React.FC = () => {
  const { reimbursementFormValues, activeStep } = useAppSelector(
    (state) => state.reimbursementForm,
  );

  const { filters } = useAppSelector((state) => state.userDashboardState);

  const { focusedReimbursementId } = useAppSelector(
    (state) => state.pageTableState,
  );

  const { user } = useAppSelector((state) => state.session);

  const [searchParams, setSearchParams] = useState<QueryFilter | null>(null);

  const debouncedSearchText = useDebounce(searchParams?.search, 500);
  const [isSearching, setIsSearching] = useState<boolean>(false);

  const dispatch = useAppDispatch();

  const { isFetching, data } = TableService.useMyReimbursementsList({
    ...filters,
    search: debouncedSearchText,
  });

  const {
    isFetching: focusedReimbursementDataIsFetching,
    isError: focusedReimbursementDataIsError,
    data: focusedReimbursementData,
  } = SideDrawerService.useReimbursementRequest(+focusedReimbursementId!);

  //Form return for reimbursement type selection
  const useReimbursementTypeFormReturn = useForm<ReimbursementFormType>({
    resolver: useMemo(() => {
      if (activeStep === 0) {
        return zodResolver(reimbursementTypeSchema);
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
      dispatch(
        setReimbursementFormValues({
          ...reimbursementFormValues,
          request_type: +selectedReimbursementType,
        }),
      );
      dispatch(toggleCancelDialog());
    }
  };

  /**Continue reimbursement request cancellation */
  const handleConfirmCancellation = () => {
    dispatch(clearReimbursementForm());
    useReimbursementTypeFormReturn.reset();
    dispatch(toggleCancelDialog());
    dispatch(_setTempAttachedFiles([]));
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

  const setFilters = (filters: QueryFilter | null) => {
    dispatch(setUserDashboardFilters(filters));
  };

  const resetTableState = () => {
    dispatch(setUserDashboardFilters(null));
  };

  const columns = React.useMemo<ColumnDef<ReimbursementRequest>[]>(() => {
    const defaultColumns: ColumnDef<ReimbursementRequest, unknown>[] = [
      {
        id: "request_status",
        accessorKey: "request_status",
        header: "Status",
        filterFn: (row, value: string) => {
          return value.includes(row.original.request_status.name);
        },
        meta: {
          filterComponent: () => (
            <StatusFilter filters={filters} setFilters={setFilters} />
          ),
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
          filterComponent: () => (
            <ReimbursementTypeFilter
              filters={filters}
              setFilters={setFilters}
            />
          ),
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
          filterComponent: () => (
            <ExpenseTypeFilter filters={filters} setFilters={setFilters} />
          ),
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
          filterComponent: () => (
            <DateFiledFilter filters={filters} setFilters={setFilters} />
          ),
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

  return (
    <>
      <div className="grid bg-neutral-50 md:gap-y-4 md:p-5">
        <MemberAnalytics />

        <TableV2
          tableState={{ filters }}
          tableActions={{ resetTableState, setFilters }}
          header={{
            isLoading: !isSearching && isFetching,
            title: "Reimbursements",
            button: "create",
            buttonClickHandler:
              user && user.profile
                ? () => dispatch(toggleFormDialog())
                : () => {
                    showToast({
                      type: "error",
                      title: "Missing Information!",
                      description:
                        "Your profile appears to be either incomplete or missing. Please reach out to your account manager for assistance.",
                    });
                  },
            buttonIsVisible: true,
            handleSearch: handleSearch,
            searchIsLoading: isFetching,
          }}
          type="reimbursement"
          loading={isFetching}
          data={data?.results}
          columns={columns}
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
