import { type ReimbursementParticular } from "~/schema/reimbursement-particulars.schema";

export interface ReimbursementFormValues {
  reimbursement_request_type_id: string | null;
  particulars: ReimbursementParticular[];
}
