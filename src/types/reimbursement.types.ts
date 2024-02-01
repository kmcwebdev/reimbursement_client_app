import { type IUser } from "~/features/state/user-state.slice";
import { type ParticularDetails } from "~/schema/reimbursement-particulars.schema";
import { type IResponsePagination } from "./global-types";
import { type IFileStack } from "./reimbursement-form-values.type";
import { type IExpenseType } from "./reimbursement.expense-type";
import { type ReimbursementRequestType } from "./reimbursement.request-type";

//NEW CHANGES

export interface IParticularDetails
  extends Omit<ParticularDetails, "expense_type"> {
  id: number;
  created_at: string;
  updated_at: string;
  expense_type: IExpenseType;
}

export type IRequestListResponse = {
  results: IReimbursementRequest[];
} & IResponsePagination;

export type IReimbursementRequest = {
  id: number;
  reference_no: string;
  total_amount: string;
  request_type: ReimbursementRequestType;
  request_status: IStatus;
  reimb_requestor: IUser;
  next_approver: string;
  fully_approved: boolean;
  particulars: IParticularDetails[];
  approver_matrix: IApproverMatrix[];
  supporting_documents: IFileStack[];
  payroll_date: string;
  created_at: string;
  updated_at: string;
  remarks: string;
};

export type IApproverMatrix = {
  id: number;
  approver: IUser;
  approval_order: number;
  display_name: string;
  approver_deligation: string;
  is_approved: boolean;
  is_rejected: boolean;
  acknowledge_datetime: string;
  remarks: string;
  approval_status: { id: number; name: string };
};

export type IStatusResponse = {
  results: IStatus[];
} & IResponsePagination;

export type IStatus = {
  id: number;
  name: StatusType;
};

export type StatusType =
  | "Pending"
  | "Approved"
  | "Processing"
  | "Credited"
  | "On-hold"
  | "Rejected"
  | "Cancelled";

export type IReimbursementsFilterQuery = {
  search?: string;
  request_type__id?: string;
  expense_type__id?: string;
  request_status__id?: string;
  page?: number;
  created_at_before?: string;
  created_at_after?: string;
  history?: boolean;
};
