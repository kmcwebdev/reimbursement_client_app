import { type Reimbursement } from "~/components/core/table";

export const sampleData: Reimbursement[] = [
  {
    status: "pending",
    client: "Apple",
    id: "1",
    name: "John Doe",
    reimbursementId: "R-12345-1",
    type: "Scheduled",
    expense: "Meal1",
    filed: "08/11/1996",
    payrollAccount: 1000567890,
    total: 5000,
  },

  {
    status: "processing",
    client: "IBM",
    id: "2",
    name: "John Doe",
    reimbursementId: "R-12345-2",
    type: "Unscheduled",
    expense: "Meal2",
    filed: "08/11/1996",
    payrollAccount: 1000567890,
    total: 5000,
  },

  {
    status: "rejected",
    client: "Text",
    id: "3",
    name: "John Doe",
    reimbursementId: "R-12345-3",
    type: "Scheduled",
    expense: "Meal3",
    filed: "08/10/1996",
    payrollAccount: 1000567890,
    total: 5000,
  },

  {
    status: "approved",
    client: "Dell",
    id: "4",
    name: "John Doe",
    reimbursementId: "R-12345-4",
    type: "Scheduled",
    expense: "Meal",
    filed: "08/10/1996",
    payrollAccount: 1000567890,
    total: 5000,
  },

  {
    status: "credited",
    client: "Dell",
    id: "5",
    name: "John Doe",
    reimbursementId: "R-12345-5",
    type: "Unscheduled",
    expense: "Meal",
    filed: "08/10/1996",
    payrollAccount: 1000567890,
    total: 5000,
  },
  {
    status: "credited",
    client: "Dell",
    id: "6",
    name: "John Doe",
    reimbursementId: "R-12345-6",
    type: "Unscheduled",
    expense: "Meal",
    filed: "08/10/1996",
    payrollAccount: 1000567890,
    total: 5000,
  },
  {
    status: "credited",
    client: "Dell",
    id: "7",
    name: "John Doe",
    reimbursementId: "R-12345-7",
    type: "Unscheduled",
    expense: "Meal",
    filed: "08/10/1996",
    payrollAccount: 1000567890,
    total: 5000,
  },
  {
    status: "credited",
    client: "Dell",
    id: "8",
    name: "John Doe",
    reimbursementId: "R-12345-8",
    type: "Unscheduled",
    expense: "Meal",
    filed: "08/10/1996",
    payrollAccount: 1000567890,
    total: 5000,
  },
  {
    status: "credited",
    client: "Dell",
    id: "9",
    name: "John Doe",
    reimbursementId: "R-12345-9",
    type: "Unscheduled",
    expense: "Meal",
    filed: "08/10/1996",
    payrollAccount: 1000567890,
    total: 5000,
  },
  {
    status: "credited",
    client: "Dell",
    id: "10",
    name: "John Doe",
    reimbursementId: "R-12345-10",
    type: "Unscheduled",
    expense: "Meal",
    filed: "08/10/1996",
    payrollAccount: 1000567890,
    total: 5000,
  },
];
