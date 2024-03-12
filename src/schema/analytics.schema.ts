import { z } from "zod";

export const analyticsSchema = z.object({
  pending_request_count: z.number(),
  scheduled_request_count: z.number(),
  unscheduled_request_count: z.number(),
  overall_request_count: z.number(),
  pending_for_approval_count: z.number(),
  scheduled_for_approval_request_count: z.number(),
  unscheduled_for_approval_request_count: z.number(),
  credited_request_count: z.number(),
  cancelled_request_count: z.number(),
  rejected_request_count: z.number(),
  onhold_request_count: z.number(),
  administrator_analytics: z.number(),
  all_reimb_request_count: z.number(),
});
