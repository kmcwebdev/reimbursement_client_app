import { z } from "zod";
import { approverMatrixSchema } from "./approver-matrix.schema";
import { fileStackSchema } from "./file-stack.schema";
import { particularSchema } from "./particulars.schema";
import { requestTypeSchema } from "./request-type.schema";
import { statusSchema } from "./status.schema";
import { userSchema } from "./user.schema";

export const reimbursementRequestSchema = z.object({
  id: z.number(),
  reference_no: z.string(),
  total_amount: z.string(),
  request_type: requestTypeSchema,
  request_status: statusSchema,
  reimb_requestor: userSchema,
  next_approver: z.string(),
  fully_approved: z.boolean(),
  particulars: z.array(particularSchema),
  approver_matrix: z.array(approverMatrixSchema),
  supporting_documents: z.array(fileStackSchema),
  payroll_date: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
  remarks: z.string(),
});
