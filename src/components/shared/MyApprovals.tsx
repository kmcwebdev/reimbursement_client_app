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
import { useAppDispatch, useAppSelector } from "~/app/hook";
import { appApiSlice } from "~/app/rtkQuery";
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
import { Can } from "~/context/AbilityContext";
import {
  setColumnFilters,
  setSelectedItems,
} from "~/features/approval-page-state-slice";
import {
  useApproveReimbursementMutation,
  useGetAllApprovalQuery,
  useGetAnalyticsQuery,
  useGetRequestQuery,
} from "~/features/reimbursement-api-slice";
import { useDialogState } from "~/hooks/use-dialog-state";
import { type ReimbursementApproval } from "~/types/reimbursement.types";
import { classNames } from "~/utils/classNames";
import { currencyFormat } from "~/utils/currencyFormat";
import CollapseWidthAnimation from "../animation/CollapseWidth";
import Dialog from "../core/Dialog";
import SkeletonLoading from "../core/SkeletonLoading";
import { showToast } from "../core/Toast";
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
  const { selectedItems, columnFilters } = useAppSelector(
    (state) => state.approvalPageState,
  );
  const dispatch = useAppDispatch();

  const setSelectedItemsState = (value: string[]) => {
    dispatch(setSelectedItems(value));
  };

  const setColumnFiltersState = (value: ColumnFiltersState) => {
    dispatch(setColumnFilters(value));
  };

  const [focusedReimbursementId, setFocusedReimbursementId] =
    useState<string>();

  const [approveReimbursement, { isLoading: isSubmitting }] =
    useApproveReimbursementMutation();

  const { isLoading: analyticsIsLoading, data: analytics } =
    useGetAnalyticsQuery();
  const {
    isFetching: reimbursementRequestDataIsLoading,
    currentData: reimbursementRequestData,
  } = useGetRequestQuery(
    { reimbursement_request_id: focusedReimbursementId! },
    { skip: !focusedReimbursementId },
  );

  const {
    isVisible,
    open: openReimbursementView,
    close: closeReimbursementView,
  } = useDialogState();

  const {
    isVisible: bulkApproveDialogIsOpen,
    open: openBulkApproveDialog,
    close: closeBulkApproveDialog,
  } = useDialogState();

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const { isLoading, data } = useGetAllApprovalQuery({});

  const columns = React.useMemo<ColumnDef<ReimbursementApproval>[]>(() => {
    return [
      {
        id: "select",
        size: 10,
        header: ({ table }) => {
          if (table.getRowModel().rows.length > 0) {
            return (
              <TableCheckbox
                checked={table.getIsAllRowsSelected()}
                indeterminate={table.getIsSomeRowsSelected()}
                onChange={table.getToggleAllRowsSelectedHandler()}
                showOnHover={false}
              />
            );
          }
        },

        cell: ({ row }) => (
          <div className="px-4">
            <TableCheckbox
              checked={row.getIsSelected()}
              tableHasChecked={selectedItems.length > 0}
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
          filterComponent: (info: FilterProps) => (
            <StatusFilter
              {...info}
              isButtonHidden={data && data.length === 0}
            />
          ),
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
            <ReimbursementTypeFilter
              {...info}
              isButtonHidden={data && data.length === 0}
            />
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
            <ExpenseTypeFilter
              {...info}
              isButtonHidden={data && data.length === 0}
            />
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
          filterComponent: (info: FilterProps) => (
            <DateFiledFilter
              {...info}
              isButtonHidden={data && data.length === 0}
            />
          ),
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
              openReimbursementView();
            }}
          >
            View
          </Button>
        ),
        header: "",
      },
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedItems]);

  const handleBulkApprove = () => {
    openBulkApproveDialog();
  };

  const handleConfirmBulkApprove = () => {
    if (data && selectedItems) {
      const matrixIds: string[] = [];

      selectedItems.forEach((a) => {
        const reimbursement = data.find(
          (b) => a === b.reimbursement_request_id,
        );
        if (reimbursement) {
          matrixIds.push(reimbursement.approval_matrix_id);
        }
      });

      if (matrixIds) {
        const payload = {
          approval_matrix_ids: matrixIds,
        };

        void approveReimbursement(payload)
          .unwrap()
          .then(() => {
            dispatch(
              appApiSlice.util.invalidateTags([
                { type: "ReimbursementRequest" },
              ]),
            );
            showToast({
              type: "success",
              description: "Reimbursement Requests successfully approved!",
            });

            setSelectedItemsState([]);
            closeBulkApproveDialog();
          })
          .catch(() => {
            showToast({
              type: "error",
              description: "Approval failed!",
            });
          });
      }
    }
  };

  return (
    <>
      <div className="grid gap-y-2 md:p-5">
        <div className="mb-5 flex gap-4">
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
                count={analytics.others?.totalScheduledRequest.count}
                totalCount={analytics.others?.totalUnScheduledRequest.count}
              />
            </>
          )}
        </div>

        <div className="flex flex-col md:flex-row md:justify-between">
          <h4>For Approval</h4>

          <div
            className={classNames(
              "flex flex-col gap-2 md:flex-row md:items-center",
            )}
          >
            {isLoading && (
              <SkeletonLoading className="h-10 w-full rounded md:w-64" />
            )}

            {!isLoading && (
              <>
                <Input
                  name="searchFilter"
                  placeholder="Find anything..."
                  className="w-full md:w-64"
                  icon={MdSearch}
                />

                <CollapseWidthAnimation
                  isVisible={selectedItems && selectedItems.length > 0}
                >
                  <Can I="access" a="CAN_BULK_APPROVE_REIMBURSEMENT">
                    <Button
                      variant="primary"
                      disabled={selectedItems.length === 0}
                      onClick={handleBulkApprove}
                    >
                      Approve
                    </Button>
                  </Can>
                </CollapseWidthAnimation>
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
              setColumnFilters: setColumnFiltersState,
              setSelectedItems: setSelectedItemsState,
              setPagination,
            }}
          />
        )}

        {isLoading && <TableSkeleton />}
      </div>

      <SideDrawer
        title={
          !reimbursementRequestDataIsLoading && reimbursementRequestData
            ? reimbursementRequestData.reference_no
            : "..."
        }
        isVisible={isVisible}
        closeDrawer={closeReimbursementView}
      >
        <ReimbursementsCardView
          isApproverView
          closeDrawer={closeReimbursementView}
          isLoading={reimbursementRequestDataIsLoading}
          data={reimbursementRequestData}
        />
      </SideDrawer>

      <Dialog
        title={
          selectedItems && selectedItems.length > 1
            ? "Approve Reimbursements?"
            : "Approve Reimbursement?"
        }
        isVisible={bulkApproveDialogIsOpen}
        close={closeBulkApproveDialog}
        hideCloseIcon
      >
        <div className="flex flex-col gap-8 pt-8">
          {data && (
            <>
              <p className="text-neutral-800">
                {selectedItems && selectedItems.length === 1 && data && (
                  <>
                    Are you sure you want to approve reimbursement request{" "}
                    {
                      data.find(
                        (a) => a.reimbursement_request_id === selectedItems[0],
                      )?.reference_no
                    }{" "}
                    with total amount of{" "}
                    {currencyFormat(
                      // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
                      +data.find(
                        (a) => a.reimbursement_request_id === selectedItems[0],
                      )?.amount!,
                    )}
                    ?
                  </>
                )}

                {selectedItems && selectedItems.length > 1 && (
                  <>
                    Are you sure you want to approve {selectedItems.length}{" "}
                    selected reimbursement request?
                  </>
                )}
              </p>

              <div className="flex items-center gap-4">
                <Button
                  variant="neutral"
                  buttonType="outlined"
                  className="w-1/2"
                  onClick={closeBulkApproveDialog}
                >
                  Cancel
                </Button>
                <Button
                  className="w-1/2"
                  onClick={handleConfirmBulkApprove}
                  disabled={isSubmitting}
                  loading={isSubmitting}
                >
                  Approve
                </Button>
              </div>
            </>
          )}
        </div>
      </Dialog>
    </>
  );
};

export default MyApprovals;
