/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
"use client";
import { useAbility } from "@casl/react";
import { type ColumnDef } from "@tanstack/react-table";
import dynamic from "next/dynamic";
import React, { useEffect, useState, type ChangeEvent } from "react";
import AnalyticsService from "~/app/api/services/analytics-service";
import SideDrawerService from "~/app/api/services/side-drawer-service";
import TableService from "~/app/api/services/table-service";
import TableCheckbox from "~/app/components/core/tableV2/TableCheckbox";
import { useAppDispatch, useAppSelector } from "~/app/hook";
import { AbilityContext } from "~/context/AbilityContext";
import {
  setApprovalDashboardFilters,
  setApprovalDashboardSelectedItems,
} from "~/features/state/approval-dashboard-state-slice";
import { toggleBulkApprovalDialog } from "~/features/state/table-state.slice";
import { useDebounce } from "~/hooks/use-debounce";
import {
  type QueryFilter,
  type ReimbursementRequest,
} from "~/types/reimbursement.types";
import TableV2 from "../core/tableV2";
import TableCell from "../core/tableV2/TableCell";
import ApprovalTableAnalytics from "./analytics/ApprovalTableAnalytics";

const ReimbursementsCardView = dynamic(
  () => import("~/app/components/reimbursement-view"),
);
const SideDrawer = dynamic(() => import("~/app/components/core/SideDrawer"));
const BulkApproveReimbursementsDialog = dynamic(
  () => import("./dialogs/approval/BulkApproveReimbursementsDialog"),
);

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

const MyApprovals: React.FC = () => {
  const dispatch = useAppDispatch();
  const ability = useAbility(AbilityContext);
  const { assignedRole } = useAppSelector((state) => state.session);
  const { focusedReimbursementId } = useAppSelector(
    (state) => state.pageTableState,
  );
  const { filters, selectedItems } = useAppSelector(
    (state) => state.approvalDashboardState,
  );

  const [searchParams, setSearchParams] = useState<QueryFilter | null>(null);

  const debouncedSearchText = useDebounce(searchParams?.search, 500);
  const [isSearching, setIsSearching] = useState<boolean>(false);

  const { isFetching: analyticsIsLoading, data: analytics } =
    AnalyticsService.useAnalytics(assignedRole?.split("_")[1].toLowerCase()!);

  const {
    isFetching: reimbursementRequestDataIsLoading,
    data: reimbursementRequestData,
  } = SideDrawerService.useReimbursementRequest(+focusedReimbursementId!);

  const { isLoading, data } = TableService.useApprovalList({
    ...filters,
    search: debouncedSearchText,
    type: assignedRole?.split("_")[1].toLowerCase()!,
  });

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setIsSearching(true);
    const searchValue = e.target.value;
    setSearchParams({ ...searchParams, search: searchValue });
  };

  const setFilters = (filters: QueryFilter | null) => {
    dispatch(setApprovalDashboardFilters(filters));
  };

  const setSelectedItems = (selectedItems: number[]) => {
    dispatch(setApprovalDashboardSelectedItems(selectedItems));
  };

  const resetTableState = () => {
    dispatch(setApprovalDashboardFilters(null));
    dispatch(setApprovalDashboardSelectedItems([]));
  };

  const columns = React.useMemo<ColumnDef<ReimbursementRequest>[]>(() => {
    const defaultColumns: ColumnDef<ReimbursementRequest>[] = [
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
          filterComponent: () => (
            <StatusFilter filters={filters} setFilters={setFilters} />
          ),
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
          return value.includes(row.getValue(id));
        },
        meta: {
          filterComponent: () => (
            <ExpenseTypeFilter filters={filters} setFilters={setFilters} />
          ),
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

        <TableV2
          tableState={{ filters, selectedItems }}
          tableActions={{ setSelectedItems, resetTableState, setFilters }}
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
        selectedItems={selectedItems}
        setSelectedItems={setSelectedItems}
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
