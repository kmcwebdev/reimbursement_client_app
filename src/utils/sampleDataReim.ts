import { type Reimbursement } from "~/components/reimbursementView";

export const sampleDataReim: Reimbursement[] = [
  {
    status: "pending",
    client: "Apple",
    id: "1",
    name: "John Doe",
    reimbursementId: "R-12345-5",
    type: "Scheduled",
    expense: "Meal",
    remarks: "Jordan 1 SE Craft",
    filed: "08/11/1996",
    total: 5000,
    approvers: "dexter.pole@kmc.solutions",
    note: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    attachments: "jane-doe.pdf",
    daterejected: "Feb 10, 2023",
    notes:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
];
