import { z } from "zod";

export const groupSchema = z.object({
  id: z.number(),
  name: z.string(),
});
