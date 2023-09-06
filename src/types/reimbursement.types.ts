export type ReimbursementDetailsDTO = {
  type: string;
  expense: string;
  remarks?: string;
  total: number;
  approvers?: { email: string }[];
};

export type ReimbursementAttachmentsDTO = {
  files: string[];
};

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
  full_name: string | null;
  email: string;
  employee_id: string;
  date_approve: string | null;
  cursor_id: string;
  rank?: number;
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
