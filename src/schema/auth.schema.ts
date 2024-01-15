import * as z from "zod";

export const CredentialsSchema = z.object({
  username: z.string({ required_error: "Please input username!" }).nonempty({
    message: "Please input username!",
  }),
  password: z
    .string({ required_error: "Please input approver email!" })
    .nonempty({
      message: "Please input password!",
    }),
});

export type Credentials = z.infer<typeof CredentialsSchema>;
