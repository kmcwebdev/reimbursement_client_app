import { z } from "zod";

export const approvalStatusSchema = z.object({
  id: z.number(),
  name: z.string(),
});

export type ApprovalStatus = z.infer<typeof approvalStatusSchema>;
