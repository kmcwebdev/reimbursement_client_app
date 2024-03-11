import { z } from "zod";

export const expenseTypeSchema = z.object({
  id: z.number(),
  name: z.string(),
});
