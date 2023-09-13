export type ReimbursementDetailsDTO = {
  reimbursement_request_type_id: string;
  expense_type_id: string;
  remarks?: string;
  amount: number;
  approvers?: { email: string }[];
};

export type ReimbursementAttachmentsDTO = {
  files: string[];
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
}

export type ReimbursementRequest = {
  approval_matrix_id: string;
  reimbursement_request_id: string;
  reference_no: string;
  request_type: string;
  expense_type: string;
  request_status: string;
  remarks: string;
  created_at: string;
  amount: string;
  attachment: string;
  attachment_mask_name: string;
  hrbp_approver_email: string;
  full_name: string | null;
  email: string;
  employee_id: string;
  date_approve: string | null;
  cursor_id: string;
  rank?: number;
  next_approval_matrix_id: string;
  next_approver_order:number;
  approvers: Approvers[];
};

export type ReimbursementApproval = {
  approval_matrix_id: string;
  reimbursement_request_id: string;
  reference_no: string;
  request_type: string;
  expense_type: string;
  request_status: string;
  created_at: string;
  amount: string;
  date_approve: string | null;
  approver_id: string;
  approver_order: number;
  has_approver: boolean;
  performed_by_user_id: string | null;
  description: string | null;
};
