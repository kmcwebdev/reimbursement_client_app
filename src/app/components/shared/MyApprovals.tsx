/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";
import { type ColumnDef } from "@tanstack/react-table";
import dynamic from "next/dynamic";
import React, { useEffect, useState, type ChangeEvent } from "react";
import { MdSearch } from "react-icons-all-files/md/MdSearch";
import { Button } from "~/app/components/core/Button";
import Table from "~/app/components/core/table";
import TableCheckbox from "~/app/components/core/table/TableCheckbox";
import { type FilterProps } from "~/app/components/core/table/filters/StatusFilter";
import { useAppDispatch, useAppSelector } from "~/app/hook";
import { appApiSlice } from "~/app/rtkQuery";
import { Can } from "~/context/AbilityContext";

import { useApproveReimbursementMutation } from "~/features/api/actions-api-slice";
import { useApprovalAnalyticsQuery } from "~/features/api/analytics-api-slice";
import {
  useGetApprovalListQuery,
  useGetRequestQuery,
} from "~/features/api/reimbursement-api-slice";
import { setSelectedItems } from "~/features/state/table-state.slice";
import { useDebounce } from "~/hooks/use-debounce";
import { useDialogState } from "~/hooks/use-dialog-state";
import {
  type IReimbursementRequest,
  type IReimbursementsFilterQuery,
} from "~/types/reimbursement.types";
import { classNames } from "~/utils/classNames";
import { currencyFormat } from "~/utils/currencyFormat";
import CollapseWidthAnimation from "../animation/CollapseWidth";
import SkeletonLoading from "../core/SkeletonLoading";
import { showToast } from "../core/Toast";
import Input from "../core/form/fields/Input";
import TableCell from "../core/table/TableCell";
import ApprovalTableAnalytics from "./analytics/ApprovalTableAnalytics";

const ReimbursementsCardView = dynamic(
  () => import("~/app/components/reimbursement-view"),
);
const SideDrawer = dynamic(() => import("~/app/components/core/SideDrawer"));
const Dialog = dynamic(() => import("~/app/components/core/Dialog"));

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
  const { assignedRole } = useAppSelector((state) => state.session);
  const { selectedItems, filters } = useAppSelector(
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

  const [focusedReimbursementId, setFocusedReimbursementId] =
    useState<number>();

  const [approveReimbursement, { isLoading: isSubmitting }] =
    useApproveReimbursementMutation();

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

  const setSelectedItemsState = (value: number[]) => {
    dispatch(setSelectedItems(value));
  };

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
        setFocusedReimbursementId: setFocusedReimbursementId,
        openDrawer: openReimbursementView,
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

  const handleBulkApprove = () => {
    openBulkApproveDialog();
  };

  const handleConfirmBulkApprove = () => {
    if (data && selectedItems) {
      const matrixIds: number[] = [];

      selectedItems.forEach((a) => {
        const reimbursement = data.results.find((b) => +a === b.id);
        if (reimbursement) {
          matrixIds.push(reimbursement.id);
        }
      });

      if (matrixIds) {
        const payload = {
          id: matrixIds[0],
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

        <div className="flex flex-col p-4 md:flex-row md:justify-between lg:p-0">
          <h4>For Approval</h4>
          {!isSearching && isLoading ? (
            <SkeletonLoading className="h-10 w-full rounded-sm md:w-64" />
          ) : (
            <div
              className={classNames(
                "flex flex-col gap-2 md:flex-row md:items-center",
              )}
            >
              <Input
                name="searchFilter"
                placeholder="Find anything..."
                loading={isLoading && isSearching}
                className="w-full md:w-64"
                icon={MdSearch}
                defaultValue={filters.search}
                onChange={handleSearch}
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
            </div>
          )}
        </div>

        <Table
          type="approvals"
          loading={isLoading}
          data={data?.results}
          columns={columns}
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
          closeDrawer={closeReimbursementView}
          isLoading={reimbursementRequestDataIsLoading}
          data={reimbursementRequestData}
          setFocusedReimbursementId={setFocusedReimbursementId}
          isApproverView
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
                      data.results.find((a) => a.id === selectedItems[0])
                        ?.reference_no
                    }{" "}
                    with total amount of{" "}
                    {currencyFormat(
                      // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
                      +data.results.find((a) => a.id === selectedItems[0])
                        ?.total_amount!,
                    )}
                    ?
                  </>
                )}

                {selectedItems && selectedItems.length > 1 && (
                  <>
                    Are you sure you want to approve{" "}
                    <strong>{selectedItems.length}</strong> selected
                    reimbursement request?
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
