import { z } from "zod";

export const ExpenseTypeQuerySchema = z.object({
  request_type_id: z.string().uuid(),
});

export type ExpenseTypeQueryType = z.infer<typeof ExpenseTypeQuerySchema>;
