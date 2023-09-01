import { z } from "zod";

export const reimbursementDetailsSchema = z
  .object({
    type: z
      .string({ required_error: "Please choose a reimbursement type!" })
      .uuid({
        message: "Reimbursement type is must be a uuid!",
      }),
    expense: z
      .string({ required_error: "Please choose a type of expense!" })
      .uuid({
        message: "Type of expense is must be a uuid!",
      }),
    remarks: z
      .string({ required_error: "Please input remarks!" })
      .nonempty({
        message: "Please input remarks!",
      })
      .optional(),
    approvers: z
      .object({
        email: z
          .string({
            required_error: "Please add at least 1 approver!",
            invalid_type_error: "Please input at least 1 approver!",
          })
          .nonempty("Please input approver!"),
      })
      .array()
      .optional(),
    total: z.preprocess(
      (input) => Number(input),
      z.number({ required_error: "Please input total!" }),
    ),
  })
  .refine(
    (input) => {
      if (input.type === "9850f2aa-40c4-4fd5-8708-c8edf734d83f") {
        const emptyEmail = input.approvers.every(
          (approver) => approver.email === "" || approver === undefined,
        );

        return emptyEmail;
      }
    },
    {
      message: "This field is required!",
      path: ["approvers", "remarks"],
    },
  );
