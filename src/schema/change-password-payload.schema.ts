import { z } from "zod";

export const changePasswordPayloadSchema = z.object({
  new_password: z.string(),
  token: z.string(),
});
