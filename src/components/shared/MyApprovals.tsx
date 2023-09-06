/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  type ColumnDef,
  type ColumnFiltersState,
  type PaginationState,
} from "@tanstack/react-table";
import dayjs from "dayjs";
import dynamic from "next/dynamic";
import React, { useState } from "react";
import { MdAccessTimeFilled } from "react-icons-all-files/md/MdAccessTimeFilled";
import { MdGavel } from "react-icons-all-files/md/MdGavel";
import { MdSearch } from "react-icons-all-files/md/MdSearch";
import { Button } from "~/components/core/Button";
import DashboardCard, {
  DashboardCardSkeleton,
} from "~/components/core/DashboardCard";
import SideDrawer from "~/components/core/SideDrawer";
import StatusBadge, { type StatusType } from "~/components/core/StatusBadge";
import Table from "~/components/core/table";
import TableCheckbox from "~/components/core/table/TableCheckbox";
import { type FilterProps } from "~/components/core/table/filters/StatusFilter";
import ReimbursementsCardView from "~/components/reimbursement-view";
import {
  useGetAllApprovalQuery,
  useGetAnalyticsQuery,
  useGetRequestQuery,
} from "~/features/reimbursement-api-slice";
import { useDialogState } from "~/hooks/use-dialog-state";
import { type ReimbursementApproval } from "~/types/reimbursement.types";
import { classNames } from "~/utils/classNames";
import { currencyFormat } from "~/utils/currencyFormat";
import SkeletonLoading from "../core/SkeletonLoading";
import Input from "../core/form/fields/Input";
import TableSkeleton from "../core/table/TableSkeleton";
import DateFiledFilter from "../core/table/filters/DateFiledFilter";

const StatusFilter = dynamic(
  () => import("~/components/core/table/filters/StatusFilter"),
);
const ExpenseTypeFilter = dynamic(
  () => import("~/components/core/table/filters/ExpenseTypeFilter"),
);
const ReimbursementTypeFilter = dynamic(
  () => import("~/components/core/table/filters/ReimbursementTypeFilter"),
);

const MyApprovals: React.FC = () => {
  const [focusedReimbursementId, setFocusedReimbursementId] =
    useState<string>();

  const { isLoading: analyticsIsLoading, data: analytics } =
    useGetAnalyticsQuery();
  const {
    isFetching: reimbursementRequestDataIsLoading,
    data: reimbursementRequestData,
  } = useGetRequestQuery(
    { id: focusedReimbursementId },
    { skip: focusedReimbursementId === undefined },
  );

  const { isVisible, open, close } = useDialogState();

  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const { isLoading, data } = useGetAllApprovalQuery({});

  const handleCloseReimbursementsView = () => {
    setFocusedReimbursementId(undefined);
    close();
  };

  const columns = React.useMemo<ColumnDef<ReimbursementApproval>[]>(() => {
    return [
      {
        id: "select",
        header: ({ table }) => {
          if (table.getRowModel().rows.length > 0) {
            return (
              <TableCheckbox
                checked={table.getIsAllRowsSelected()}
                indeterminate={table.getIsSomeRowsSelected()}
                onChange={table.getToggleAllRowsSelectedHandler()}
              />
            );
          }
        },

        cell: ({ row }) => (
          <div className="px-4">
            <TableCheckbox
              checked={row.getIsSelected()}
              disabled={!row.getCanSelect()}
              indeterminate={row.getIsSomeSelected()}
              onChange={row.getToggleSelectedHandler()}
            />
          </div>
        ),
      },

      {
        id: "request_status",
        accessorKey: "request_status",
        header: "Status",
        cell: (info) => (
          <StatusBadge
            status={(info.getValue() as string).toLowerCase() as StatusType}
          />
        ),
        filterFn: (row, id, value: string) => {
          return value.includes(row.getValue(id));
        },
        enableColumnFilter: true,
        meta: {
          filterComponent: (info: FilterProps) => <StatusFilter {...info} />,
        },
      },
      {
        id: "reference_no",
        accessorKey: "reference_no",
        cell: (info) => info.getValue(),
        header: "R-ID",
      },
      {
        id: "request_type",
        accessorKey: "request_type",
        cell: (info) => info.getValue(),
        header: "Type",
        filterFn: (row, id, value: string) => {
          return value.includes(row.getValue(id));
        },
        meta: {
          filterComponent: (info: FilterProps) => (
            <ReimbursementTypeFilter {...info} />
          ),
        },
      },
      {
        id: "expense_type",
        accessorKey: "expense_type",
        cell: (info) => info.getValue(),
        header: "Expense",
        filterFn: (row, id, value: string) => {
          return value.includes(row.getValue(id));
        },
        meta: {
          filterComponent: (info: FilterProps) => (
            <ExpenseTypeFilter {...info} />
          ),
        },
      },
      {
        id: "created_at",
        accessorKey: "created_at",
        cell: (info) => dayjs(info.getValue() as string).format("MMM D, YYYY"),
        header: "Filed",
        filterFn: (row, id, value: string) => {
          return value.includes(row.getValue(id));
        },
        meta: {
          filterComponent: (info: FilterProps) => <DateFiledFilter {...info} />,
        },
      },
      {
        id: "amount",
        accessorKey: "amount",
        cell: (info) => currencyFormat(info.getValue() as number),
        header: "Amount",
      },
      {
        id: "actions",
        accessorKey: "reimbursement_request_id",
        cell: (info) => (
          <Button
            buttonType="text"
            onClick={() => {
              setFocusedReimbursementId(info.getValue() as string);
              open();
            }}
          >
            View
          </Button>
        ),
        header: "",
      },
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div className="grid gap-y-2 p-5">
        <div className="mb-5 flex place-items-start gap-4">
          {analyticsIsLoading && (
            <>
              <DashboardCardSkeleton />
              <DashboardCardSkeleton />
            </>
          )}

          {!analyticsIsLoading && analytics && (
            <>
              <DashboardCard
                icon={<MdGavel className="h-5 w-5 text-yellow-600" />}
                label="Pending Approval"
                count={analytics.myPendingRequest.count}
              />
              <DashboardCard
                icon={<MdAccessTimeFilled className="h-5 w-5 text-blue-600" />}
                label="Scheduled/Unscheduled"
                count={analytics.myTotalRequest.count}
                totalCount={20}
              />
            </>
          )}
        </div>

        <div className="flex justify-between">
          <h4>For Approval</h4>

          <div
            className={classNames(
              selectedItems && selectedItems.length === 0
                ? "w-64"
                : "w-[26.2rem]",
              "flex items-center gap-2 overflow-hidden transition-all ease-in-out",
            )}
          >
            {isLoading && <SkeletonLoading className="h-10 w-64 rounded" />}

            {!isLoading && (
              <>
                <Input
                  name="searchFilter"
                  placeholder="Find anything..."
                  className="w-64"
                  icon={MdSearch}
                />

                <>
                  <Button
                    buttonType="outlined"
                    variant="danger"
                    disabled={selectedItems.length === 0}
                  >
                    Reject
                  </Button>
                  <Button
                    variant="primary"
                    disabled={selectedItems.length === 0}
                    onClick={() => {
                      if (selectedItems && selectedItems.length > 0) {
                        setFocusedReimbursementId(selectedItems[0]);
                        open();
                      }
                    }}
                  >
                    Approve
                  </Button>
                </>
              </>
            )}
          </div>
        </div>

        {!isLoading && data && (
          <Table
            type="approvals"
            loading={isLoading}
            data={data}
            columns={columns}
            tableState={{
              pagination,
              selectedItems,
              columnFilters,
            }}
            tableStateActions={{
              setColumnFilters,
              setSelectedItems,
              setPagination,
            }}
          />
        )}

        {isLoading && <TableSkeleton />}
      </div>

      <SideDrawer
        title={
          !isLoading && reimbursementRequestData
            ? reimbursementRequestData.reference_no
            : "..."
        }
        isVisible={isVisible}
        closeDrawer={close}
      >
        <ReimbursementsCardView
          isApproverView
          closeDrawer={handleCloseReimbursementsView}
          isLoading={reimbursementRequestDataIsLoading}
          data={reimbursementRequestData}
        />
      </SideDrawer>
    </>
  );
};

export default MyApprovals;
