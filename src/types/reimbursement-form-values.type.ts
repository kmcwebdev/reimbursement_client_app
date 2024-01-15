import { type ParticularDetails } from "~/schema/reimbursement-particulars.schema";

export interface ReimbursementFormValues {
  request_type: number | null;
  particulars: ParticularDetails[];
  attachments: IFileStack[];
  manager_approver_email?: string | null;
}

export type IFileStack = {
  id: number;
  file_name: string;
  file_type: string;
  file_source: string;
  file_upload: string;
  file_size: number;
};
