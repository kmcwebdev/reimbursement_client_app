import { z } from "zod";
import { approvalStatusSchema } from "./approval-status.schema";
import { userSchema } from "./user.schema";

export const approverMatrixSchema = z.object({
  id: z.number(),
  approver: userSchema,
  approval_order: z.number(),
  display_name: z.string(),
  approver_deligation: z.string(),
  is_approved: z.boolean(),
  is_rejected: z.boolean(),
  acknowledge_datetime: z.string(),
  remarks: z.string(),
  approval_status: approvalStatusSchema,
});
