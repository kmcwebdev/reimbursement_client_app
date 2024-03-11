import { z } from "zod";

export const responsePaginationSchema = z.object({
  count: z.number(),
  next: z.string(),
  previous: z.string(),
});
