import { type FileWithPath } from "react-dropzone";
import { type ReimbursementParticulars } from "~/schema/reimbursement-particulars.schema";

export interface ReimbursementFormValues {
  reimbursement_request_type_id: string | null;
  particulars: ReimbursementParticulars[] | null;
  attachments: FileWithPath[];
}
