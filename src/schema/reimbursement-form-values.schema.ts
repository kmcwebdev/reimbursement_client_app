import { z } from "zod";
import { fileStackSchema } from "./file-stack.schema";
import { particularDetailsSchema } from "./reimbursement-particulars.schema";

export const reimbursementFormValuesSchema = z.object({
  request_type: z.number().nullable(),
  particulars: z.array(particularDetailsSchema),
  attachments: z.array(fileStackSchema),
  manager_approver_email: z.string().nullable().optional(),
});
