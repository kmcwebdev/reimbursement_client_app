import { z } from "zod";
import { statusTypeSchema } from "./status-type.schema";

export const statusSchema = z.object({
  id: z.number(),
  name: statusTypeSchema,
});
