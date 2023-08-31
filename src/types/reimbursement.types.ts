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
