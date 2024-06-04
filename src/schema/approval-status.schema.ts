import { z } from "zod";

export const approvalStatusSchema = z.object({
  status: z.object({
    id: z.number(),
    name: z.string(),
  }),
});

export const approvalStatusResponseSchema = z.object({
  detail: approvalStatusSchema,
});

export type ApprovalStatus = z.infer<typeof approvalStatusResponseSchema>;
