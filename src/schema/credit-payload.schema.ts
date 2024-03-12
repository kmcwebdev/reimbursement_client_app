import { z } from "zod";

export const creditPayloadSchema = z.object({
  request_ids: z.array(z.string()),
  credit_all_request: z.boolean(),
});
