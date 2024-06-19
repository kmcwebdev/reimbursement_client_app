import { z } from "zod";

export const reimbursementClientSchema = z.object({
  id: z.number(),
  name: z.string(),
  customer_code: z.string(),
  client_code_alias: z.string(),
});
