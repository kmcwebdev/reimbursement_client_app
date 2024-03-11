import { z } from "zod";

export const requestTypeSchema = z.object({
  id: z.number(),
  name: z.string(),
});
