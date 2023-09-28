/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { type ColumnDef, type PaginationState } from "@tanstack/react-table";
import dayjs from "dayjs";
import dynamic from "next/dynamic";
import React, { useEffect, useState, type ChangeEvent } from "react";
import { MdSearch } from "react-icons-all-files/md/MdSearch";
import { useAppDispatch, useAppSelector } from "~/app/hook";
import { appApiSlice } from "~/app/rtkQuery";
import { Button } from "~/components/core/Button";
import SideDrawer from "~/components/core/SideDrawer";
import StatusBadge, { type StatusType } from "~/components/core/StatusBadge";
import Table from "~/components/core/table";
import TableCheckbox from "~/components/core/table/TableCheckbox";
import { type FilterProps } from "~/components/core/table/filters/StatusFilter";
import ReimbursementsCardView from "~/components/reimbursement-view";
import { Can } from "~/context/AbilityContext";
import { setSelectedItems } from "~/features/approval-page-state-slice";
import {
  useApproveReimbursementMutation,
  useGetAllApprovalQuery,
  useGetRequestQuery,
} from "~/features/reimbursement-api-slice";
import { useDialogState } from "~/hooks/use-dialog-state";
import {
  type IReimbursementsFilterQuery,
  type ReimbursementApproval,
} from "~/types/reimbursement.types";
import { classNames } from "~/utils/classNames";
import { currencyFormat } from "~/utils/currencyFormat";
import { useDebounce } from "~/utils/useDebounce";
import CollapseWidthAnimation from "../animation/CollapseWidth";
import Dialog from "../core/Dialog";
import SkeletonLoading from "../core/SkeletonLoading";
import { showToast } from "../core/Toast";
import Input from "../core/form/fields/Input";
import DateFiledFilter from "../core/table/filters/DateFiledFilter";
import HRBPAnalytics from "./analytics/HRBPAnalytics";
import ManagerAnalytics from "./analytics/ManagerAnalytics";

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
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.session);
  const { selectedItems, filters } = useAppSelector(
    (state) => state.pageTableState,
  );

  const [searchParams, setSearchParams] = useState<IReimbursementsFilterQuery>({
    text_search: undefined,
    expense_type_ids: undefined,
    from: undefined,
    to: undefined,
  });
  const debouncedSearchText = useDebounce(searchParams.text_search, 500);
  const [isSearching, setIsSearching] = useState<boolean>(false);

  const [focusedReimbursementId, setFocusedReimbursementId] =
    useState<string>();

  const [approveReimbursement, { isLoading: isSubmitting }] =
    useApproveReimbursementMutation();

  const {
    isFetching: reimbursementRequestDataIsLoading,
    currentData: reimbursementRequestData,
  } = useGetRequestQuery(
    { reimbursement_request_id: focusedReimbursementId! },
    { skip: !focusedReimbursementId },
  );

  const { isFetching: isLoading, data } = useGetAllApprovalQuery({
    ...filters,
    text_search: debouncedSearchText,
  });

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

  const setSelectedItemsState = (value: string[]) => {
    dispatch(setSelectedItems(value));
  };

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setIsSearching(true);
    const searchValue = e.target.value;
    setSearchParams({ ...searchParams, text_search: searchValue });
  };

  const columns = React.useMemo<ColumnDef<ReimbursementApproval>[]>(() => {
    if (user?.assignedRole === "HRBP") {
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
          id: "hrbp_request_status",
          accessorKey: "hrbp_request_status",
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
          id: "client_name",
          accessorKey: "client_name",
          header: "Client",
          cell: (info) => info.getValue(),
        },
        {
          id: "employee_id",
          accessorKey: "employee_id",
          header: "ID",
          cell: (info) => info.getValue(),
          size: 10,
        },
        {
          id: "full_name",
          accessorKey: "full_name",
          cell: (info) => info.getValue(),
          header: "Name",
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
          cell: (info) =>
            dayjs(info.getValue() as string).format("MMM D, YYYY"),
          header: "Filed",
          filterFn: (row, id, value: string) => {
            return value.includes(row.getValue(id));
          },
          meta: {
            filterComponent: (info: FilterProps) => (
              <DateFiledFilter {...info} />
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
    }
    if (user?.assignedRole === "External Reimbursement Approver Manager") {
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
          id: "hrbp_request_status",
          accessorKey: "hrbp_request_status",
          header: "Status",
          cell: (info) => (
            <StatusBadge
              status={(info.getValue() as string).toLowerCase() as StatusType}
            />
          ),
          // filterFn: (row, id, value: string) => {
          //   return value.includes(row.getValue(id));
          // },
          // enableColumnFilter: true,
          // meta: {
          //   filterComponent: (info: FilterProps) => (
          //     <StatusFilter
          //       {...info}
          //
          //     />
          //   ),
          // },
        },
        {
          id: "employee_id",
          accessorKey: "employee_id",
          header: "ID",
          cell: (info) => info.getValue(),
          size: 10,
        },
        {
          id: "full_name",
          accessorKey: "full_name",
          cell: (info) => info.getValue(),
          header: "Name",
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
          cell: (info) =>
            dayjs(info.getValue() as string).format("MMM D, YYYY"),
          header: "Filed",
          filterFn: (row, id, value: string) => {
            return value.includes(row.getValue(id));
          },
          meta: {
            filterComponent: (info: FilterProps) => (
              <DateFiledFilter {...info} />
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
    }

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
        id: "requestor_request_status",
        accessorKey: "requestor_request_status",
        header: "Status",
        cell: (info) => (
          <StatusBadge
            status={(info.getValue() as string).toLowerCase() as StatusType}
          />
        ),
        // filterFn: (row, id, value: string) => {
        //   return value.includes(row.getValue(id));
        // },
        // enableColumnFilter: true,
        // meta: {
        //   filterComponent: (info: FilterProps) => (
        //     <StatusFilter
        //       {...info}
        //
        //     />
        //   ),
        // },
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
  }, [selectedItems, data]);

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

  useEffect(() => {
    if (isSearching && !isLoading) {
      setIsSearching(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  return (
    <>
      <div className="grid gap-y-4 bg-neutral-50 md:p-5">
        {user && user.assignedRole === "HRBP" ? (
          <HRBPAnalytics />
        ) : (
          <ManagerAnalytics />
        )}

        <div className="flex flex-col md:flex-row md:justify-between">
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
                defaultValue={filters.text_search}
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
          data={data}
          columns={columns}
          tableState={{
            filters,
            pagination,
            selectedItems,
          }}
          tableStateActions={{
            setSelectedItems: setSelectedItemsState,
            setPagination,
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
