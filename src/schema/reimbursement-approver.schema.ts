import { z } from "zod";

export const getApproverSchema = (ownRequest: boolean, email?: string) => {
  return z.object({
    manager_approver_email: z
      .string({ required_error: "Please input approver email!" })
      .email({
        message: "Please input valid email!",
      })
      .refine(
        (e) => {
          return e !== email;
        },
        ownRequest
          ? "You cannot set your own email address!"
          : "You cannot set the requestor's email address!",
      ),
  });
};

export const ApproverSchema = z.object({
  manager_approver_email: z
    .string({ required_error: "Please input approver email!" })
    .email({
      message: "Please input valid email!",
    }),
});

export type Approver = z.infer<typeof ApproverSchema>;
