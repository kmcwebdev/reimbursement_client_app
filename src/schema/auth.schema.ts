import { z } from "zod";

export const credentialsSchema = z.object({
  username: z.string({ required_error: "Please input username!" }).nonempty({
    message: "Please input username!",
  }),
  password: z
    .string({ required_error: "Please input approver email!" })
    .nonempty({
      message: "Please input password!",
    }),
});
