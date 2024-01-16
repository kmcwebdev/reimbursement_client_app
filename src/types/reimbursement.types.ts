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

export type ReimbursementDetailsDTO = {
  reimbursement_request_type_id: string;
  expense_type_id: string;
  remarks?: string;
  amount: number;
  approvers?: { email: string }[];
};

export type AuditLog = {
  audit_log_id: string;
  full_name: string;
  email: string;
  description: string;
  created_at: string;
};

export type Approvers = {
  approval_matrix_id: string;
  approver_id: string;
  approver_order: number;
  has_approved: boolean;
  has_rejected: boolean;
  performed_by_user_id: string;
  description: string;
  approver_name: string | null;
  is_group_of_approvers: boolean;
  table_reference: string;
  updated_at: string;
};

export type ReimbursementApproval = {
  approval_matrix_id: string;
  reimbursement_request_id: string;
  reference_no: string;
  request_type: string;
  expense_type: string;
  request_status: string;
  requestor_request_status: string;
  hrbp_request_status: string;
  finance_request_status: string;
  created_at: string;
  amount: string;
  date_approve: string | null;
  approver_id: string;
  approver_order: number;
  has_approver: boolean;
  performed_by_user_id: string | null;
  description: string | null;
  attachment: string;
  attachment_mask_name: string;
  remarks?: string;
  full_name: string | null;
  email: string;
  client_id: string;
  client_name: string;
  hrbp_approver_email: string;
  payroll_account?: string;
  employee_id: string;
};

export type IReimbursementsFilterQuery = {
  search?: string;
  reimbursement_type_id?: number;
  expense_type_ids?: string;
  request_status_ids?: string;
  from?: string;
  to?: string;
  history?: boolean;
};
