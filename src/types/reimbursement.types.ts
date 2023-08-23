export type ReimbursementDetailsDTO = {
  type: number;
  expense: string;
  remarks?: string;
  total: number;
  approvers?: {email:string}[];
}

export type ReimbursementAttachmentsDTO = {
  files: string[];
}