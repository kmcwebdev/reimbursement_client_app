import { z } from "zod";

export const ApproverSchema = z.object({
  manager_approver_email: z
    .string({ required_error: "Please input approver email!" })
    .email({
      message: "Please input valid email!",
    }),
});

export type Approver = z.infer<typeof ApproverSchema>;
