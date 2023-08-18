import {
  type ColumnDef,
  type ColumnFiltersState,
  type PaginationState,
} from "@tanstack/react-table";
import dynamic from "next/dynamic";
import React, { useState } from "react";
import { type IconType } from "react-icons-all-files";
import { MdAccessTime } from "react-icons-all-files/md/MdAccessTime";
import { MdGavel } from "react-icons-all-files/md/MdGavel";
import { RxCounterClockwiseClock } from "react-icons-all-files/rx/RxCounterClockwiseClock";
import { Button } from "~/components/core/Button";
import DashboardCard from "~/components/core/DashboardCard";
import List from "~/components/core/List";
import StatusBadge, { type StatusType } from "~/components/core/StatusBadge";
import Table, { type Reimbursement } from "~/components/core/Table";
import Upload from "~/components/core/Upload";
import ButtonGroup from "~/components/core/form/fields/ButtonGroup";
import CardSelection from "~/components/core/form/fields/CardSelection";
import Checkbox from "~/components/core/form/fields/Checkbox";
import Input from "~/components/core/form/fields/Input";
import Select from "~/components/core/form/fields/Select";
import { useDialogState } from "~/hooks/use-dialog-state";
import { sampleData } from "~/utils/sampleData";
import PageAnimation from "../animation/PageAnimation";
import TableCheckbox from "../core/Table/TableCheckbox";
import TextArea from "../core/form/fields/Textarea";

const StatusTypeFilter = dynamic(
  () => import("~/components/core/Table/filters/StatusFilter"),
);
const Dialog = dynamic(() => import("~/components/core/Dialog"));
const SideDrawer = dynamic(() => import("~/components/core/SideDrawer"));

const DashboardComp: React.FC = () => {
  const { isVisible, open, close } = useDialogState();
  const {
    isVisible: sideDrawerIsVisible,
    open: openDrawer,
    close: closeDrawer,
  } = useDialogState();

  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const columns = React.useMemo<ColumnDef<Reimbursement>[]>(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <TableCheckbox
            checked={table.getIsAllRowsSelected()}
            indeterminate={table.getIsSomeRowsSelected()}
            onChange={table.getToggleAllRowsSelectedHandler()}
          />
        ),
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
        accessorKey: "status",
        header: "Status",
        cell: (info) => <StatusBadge status={info.getValue() as StatusType} />,
        filterFn: (row, id, value: string) => {
          return value.includes(row.getValue(id));
        },
        meta: {
          filterComponent: StatusTypeFilter,
        },
      },
      {
        accessorKey: "client",
        cell: (info) => info.getValue(),
        header: "Client",
        filterFn: (row, id, value: string) => {
          return value.includes(row.getValue(id));
        },
        meta: {
          filterComponent: StatusTypeFilter,
        },
      },
      {
        accessorKey: "id",
        cell: (info) => info.getValue(),
        header: "ID",
      },
      {
        accessorKey: "name",
        cell: (info) => info.getValue(),
        header: "Name",
      },
      {
        accessorKey: "reimbursementId",
        cell: (info) => info.getValue(),
        header: "R-ID",
      },
      {
        accessorKey: "type",
        cell: (info) => info.getValue(),
        header: "Type",
        filterFn: (row, id, value: string) => {
          return value.includes(row.getValue(id));
        },
        meta: {
          filterComponent: StatusTypeFilter,
        },
      },
      {
        accessorKey: "expense",
        cell: (info) => info.getValue(),
        header: "Expense",
      },
      {
        accessorKey: "filed",
        cell: (info) => info.getValue(),
        header: "Filed",
        filterFn: (row, id, value: string) => {
          return value.includes(row.getValue(id));
        },
        meta: {
          filterComponent: StatusTypeFilter,
        },
      },
      {
        accessorKey: "total",
        cell: (info) => info.getValue(),
        header: "Total",
      },
    ],
    [],
  );

  return (
    <PageAnimation>
      <section className="grid place-items-center gap-4">
        <div className="grid w-full grid-cols-2 flex-col gap-4">
          <Input label="Input Text" name="inputText" placeholder="Input Text" />
          <Select
            name="Select"
            label="Select"
            options={[
              { value: "Option 1", label: "Option1" },
              { value: "Option 2", label: "Option2" },
            ]}
          />
          <div className="col-span-2 flex flex-col gap-4">
            <Checkbox name="Checkbox" label="Checkbox" />
            <TextArea label="TextArea" name="textArea" placeholder="textArea" />
            <ButtonGroup
              handleChange={(e) => console.log(e)}
              label="ButtonGroup"
              name="buttonGroup"
              options={[
                { label: "P1", value: "Person1" },
                { label: "P2", value: "Person2" },
              ]}
            />

            <CardSelection
              handleChange={(e) => console.log(e)}
              label="Card Selection"
              name="buttonGroup"
              options={[
                {
                  icon: RxCounterClockwiseClock as IconType,
                  label: "Scheduled",
                  value: "Person1",
                },
                {
                  icon: MdAccessTime as IconType,
                  label: "Unscheduled",
                  value: "Person2",
                },
              ]}
            />

            <Button onClick={open}>Open Dialog</Button>

            <Dialog
              isVisible={isVisible}
              close={close}
              title="Reject Reimbursements?"
            >
              <div className="flex flex-col gap-4 pt-4">
                <TextArea
                  name="reasonsForRejection"
                  label="Reasons for Rejection"
                  placeholder="Reasons"
                />
                <div className="flex justify-between">
                  <Button buttonType="outlined" variant="neutral">
                    Cancel
                  </Button>
                  <Button variant="primary">Proceed</Button>
                </div>
              </div>
            </Dialog>

            <DashboardCard
              icon={<MdGavel className="h-5 w-5 text-[#D89B0D]" />}
              label="Pending Approval"
              count={20}
              totalCount={40}
            />

            <StatusBadge status="processing" />
            <StatusBadge status="approved" />
            <StatusBadge status="pending" />
            <StatusBadge status="rejected" />
            <StatusBadge status="credited" />

            <List>
              <List.Item
                label="Status"
                value={<StatusBadge status="processing" />}
              />

              <List.Item label="Id" value="Idddd" />
            </List>

            <Upload
              uploadButtonProps={{ onClick: () => console.log("uploaded") }}
            />

            <Button onClick={openDrawer}>Open Side Drawer</Button>

            <SideDrawer
              isVisible={sideDrawerIsVisible}
              closeDrawer={closeDrawer}
              title="R20203-5"
            >
              <div className="flex flex-col gap-4 pt-4">
                <TextArea
                  name="reasonsForRejection"
                  label="Reasons for Rejection"
                  placeholder="Reasons"
                />
                <div className="flex justify-between">
                  <Button buttonType="outlined" variant="neutral">
                    Cancel
                  </Button>
                  <Button variant="primary">Proceed</Button>
                </div>
              </div>
            </SideDrawer>

            <Table
              data={sampleData}
              columns={columns}
              tableState={{ pagination, selectedItems, columnFilters }}
              tableStateActions={{
                setColumnFilters,
                setSelectedItems,
                setPagination,
              }}
            />
          </div>
        </div>
      </section>
    </PageAnimation>
  );
};

export default DashboardComp;
