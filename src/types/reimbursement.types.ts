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
  reimbursement_request_id: string;
  reference_no: string;
  request_type: string;
  expense_type: string;
  request_status: string;
  amount: string;
  attachment: string;
  full_name: string | null;
  email: string;
  employee_id: string;
  date_approve: string | null;
  rank?: number;
};
