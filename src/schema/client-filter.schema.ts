import { z } from "zod";

export const clientFilterSchema = z.object({
  search: z.string().optional(),
  id: z.string().optional(),
  page_size: z.number().optional(),
});
