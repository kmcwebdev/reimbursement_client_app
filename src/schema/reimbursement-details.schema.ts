import { z } from "zod";

const UNSCHEDULED = "9850f2aa-40c4-4fd5-8708-c8edf734d83f";
const EXPENSE_TYPE_OTHERS = "1de6c849-39d9-421b-b0db-2fb3202cb7c6";

export const reimbursementDetailsSchema = z
  .object({
    type: z
      .string({ required_error: "Please choose a reimbursement type!" })
      .uuid({
        message: "Reimbursment type is must be a uuid!",
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
      .array(
        z.object({
          email: z
            .string({
              required_error: "Please input approver!",
              invalid_type_error: "Please input approver!",
            })
            .nonempty("Please input approver!")
            .refine((val) => val.length > 0),
        }),
      )
      .refine(
        (items) => {
          const values = items.map((item) => item.email);

          const hasDuplicateEmail =
            values.length > 1 &&
            values.some((email, idx) => values.indexOf(email) !== idx);

          return !hasDuplicateEmail;
        },
        {
          message: "Please check for duplicate approvers!",
        },
      )
      .optional(),
    total: z.coerce
      .number({ required_error: "Please input total!" })
      .min(1, "Please input total!"),
  })
  .refine(
    (input) => {
      if (input.type === UNSCHEDULED) {
        return input?.approvers ? input.approvers.length > 0 : false;
      }

      if (input.expense === EXPENSE_TYPE_OTHERS) {
        return input?.remarks ? input.remarks.length > 0 : false;
      }

      return true;
    },
    {
      path: ["approvers", "remarks"],
      message:
        "Approvers is required for unscheduled reimbursement! or Remarks is required for other expense type!",
    },
  );
