/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
"use client";
import { useAbility } from "@casl/react";
import { type ColumnDef } from "@tanstack/react-table";
import dynamic from "next/dynamic";
import React, { useEffect, useState, type ChangeEvent } from "react";
import Table from "~/app/components/core/table";
import TableCheckbox from "~/app/components/core/table/TableCheckbox";
import { type FilterProps } from "~/app/components/core/table/filters/StatusFilter";
import { useAppDispatch, useAppSelector } from "~/app/hook";
import { AbilityContext } from "~/context/AbilityContext";
import { useApprovalAnalyticsQuery } from "~/features/api/analytics-api-slice";
import {
  useGetApprovalListQuery,
  useGetRequestQuery,
} from "~/features/api/reimbursement-api-slice";
import {
  setFocusedReimbursementId,
  toggleBulkApprovalDialog,
  toggleSideDrawer,
} from "~/features/state/table-state.slice";
import { useDebounce } from "~/hooks/use-debounce";
import {
  type IReimbursementRequest,
  type IReimbursementsFilterQuery,
} from "~/types/reimbursement.types";
import TableCell from "../core/table/TableCell";
import ApprovalTableAnalytics from "./analytics/ApprovalTableAnalytics";

const ReimbursementsCardView = dynamic(
  () => import("~/app/components/reimbursement-view"),
);
const SideDrawer = dynamic(() => import("~/app/components/core/SideDrawer"));
const BulkApproveReimbursementsDialog = dynamic(
  () => import("./dialogs/approval/BulkApproveReimbursementsDialog"),
);

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

const MyApprovals: React.FC = () => {
  const dispatch = useAppDispatch();
  const ability = useAbility(AbilityContext);
  const { assignedRole } = useAppSelector((state) => state.session);
  const { selectedItems, filters, focusedReimbursementId } = useAppSelector(
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

  const { isFetching: analyticsIsLoading, data: analytics } =
    useApprovalAnalyticsQuery(
      {
        type: assignedRole?.split("_")[1].toLowerCase()!,
      },
      { skip: !assignedRole },
    );

  const {
    isFetching: reimbursementRequestDataIsLoading,
    currentData: reimbursementRequestData,
  } = useGetRequestQuery(
    { id: focusedReimbursementId! },
    { skip: !focusedReimbursementId },
  );

  const { isFetching: isLoading, data } = useGetApprovalListQuery(
    {
      ...filters,
      search: debouncedSearchText,
      type: assignedRole?.split("_")[1].toLowerCase()!,
    },
    {
      skip: !assignedRole,
    },
  );

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setIsSearching(true);
    const searchValue = e.target.value;
    setSearchParams({ ...searchParams, search: searchValue });
  };

  const columns = React.useMemo<ColumnDef<IReimbursementRequest>[]>(() => {
    const defaultColumns: ColumnDef<IReimbursementRequest>[] = [
      {
        id: "select",
        header: ({ table }) => {
          if (table.getRowModel().rows.length > 0) {
            return (
              <TableCheckbox
                id="MyApprovalsHeaderCheckbox"
                checked={table.getIsAllRowsSelected()}
                indeterminate={table.getIsSomeRowsSelected()}
                onChange={table.getToggleAllRowsSelectedHandler()}
                showOnHover={false}
              />
            );
          }
        },

        cell: ({ row }) => (
          <TableCheckbox
            id={row.original.id.toString()}
            checked={row.getIsSelected()}
            tableHasChecked={selectedItems.length > 0}
            disabled={!row.getCanSelect()}
            indeterminate={row.getIsSomeSelected()}
            onChange={row.getToggleSelectedHandler()}
          />
        ),
      },
      {
        id: "request_status",
        accessorKey: "request_status",
        header: "Status",
        filterFn: (row, id, value: string) => {
          return value.includes(row.getValue(id));
        },
        enableColumnFilter: true,
        meta: {
          filterComponent: StatusFilter,
        },
      },
      {
        id: "reimb_requestor",
        accessorKey: "reimb_requestor",
        header: "Client",
      },
      {
        id: "reimb_requestor",
        accessorKey: "reimb_requestor",
        header: "E-ID",
      },
      {
        id: "reimb_requestor",
        accessorKey: "reimb_requestor",
        header: "Name",
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
        filterFn: (row, id, value: string) => {
          return value.includes(row.getValue(id));
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
          return value.includes(row.getValue(id));
        },
        meta: {
          filterComponent: ExpenseTypeFilter,
        },
      },
      {
        id: "created_at",
        accessorKey: "created_at",
        header: "Filed",
        filterFn: (row, id, value: string) => {
          return value.includes(row.getValue(id));
        },
        meta: {
          filterComponent: (info: FilterProps) => <DateFiledFilter {...info} />,
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
      a.cell = a.id === "select" ? a.cell : TableCell;
    });

    if (assignedRole === "REIMBURSEMENT_MANAGER") {
      return defaultColumns.filter((a) => a.header !== "Client");
    }

    return defaultColumns;

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const toggleApprovalDialogVisibility = () => {
    dispatch(toggleBulkApprovalDialog());
  };

  useEffect(() => {
    if (isSearching && !isLoading) {
      setIsSearching(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  return (
    <>
      <div className="grid bg-neutral-50 md:gap-y-4 md:p-5">
        {assignedRole && (
          <ApprovalTableAnalytics
            type={assignedRole.split("_")[1].toLowerCase()}
            isLoading={analyticsIsLoading}
            data={analytics!}
          />
        )}

        <Table
          header={{
            isLoading: !isSearching && isLoading,
            title: "For Approval",
            button: "approve",
            buttonClickHandler: toggleApprovalDialogVisibility,
            buttonIsVisible:
              ability.can("access", "CAN_BULK_APPROVE_REIMBURSEMENT") &&
              data &&
              data.results.length > 0
                ? true
                : false,
            handleSearch: handleSearch,
            searchIsLoading: isLoading,
          }}
          type="approval"
          loading={isLoading}
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

      <BulkApproveReimbursementsDialog
        data={data}
        selectedReimbursement={data?.results.find(
          (a) => a.id === selectedItems[0],
        )}
      />

      <SideDrawer
        title={
          !reimbursementRequestDataIsLoading && reimbursementRequestData
            ? reimbursementRequestData.reference_no
            : "..."
        }
      >
        <ReimbursementsCardView
          isLoading={reimbursementRequestDataIsLoading}
          data={reimbursementRequestData}
          isApproverView
        />
      </SideDrawer>
    </>
  );
};

export default MyApprovals;
