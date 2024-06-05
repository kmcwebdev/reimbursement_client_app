import { z } from "zod";

export const approvalStatusSchema = z.object({
  id: z.number(),
  name: z.string(),
});

export const approvalStatusDataSchema = z.object({
  status: approvalStatusSchema,
});

export const approvalStatusResponseSchema = z.object({
  detail: approvalStatusDataSchema,
});

export type ApprovalStatus = z.infer<typeof approvalStatusSchema>;
export type ApprovalStatusResponse = z.infer<
  typeof approvalStatusResponseSchema
>;
