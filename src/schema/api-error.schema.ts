import { z } from "zod";

export const apiErrorSchema = z.object({
  status: z.number(),
  data: z.object({ detail: z.string() }),
});
