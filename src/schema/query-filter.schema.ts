import { z } from "zod";

export const queryFilterSchema = z.object({
  search: z.string().optional(),
  request_type__id: z.string().optional(),
  expense_type__id: z.string().optional(),
  request_status__id: z.string().optional(),
  page: z.number().optional(),
  created_at_before: z.string().optional(),
  created_at_after: z.string().optional(),
  history: z.boolean().optional(),
});
