import { z } from "zod";
import { EXPENSE_TYPE_OTHERS } from "~/constants/other-expense";
import { UNSCHEDULED } from "~/constants/request-types";

export const ReimbursementDetailsSchema = z
  .object({
    reimbursement_request_type_id: z
      .string({ required_error: "Please choose a reimbursement type!" })
      .uuid({
        message: "Reimbursement type is must be a uuid!",
      }),
    expense_type_id: z
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
            .email("Please input a valid email!")
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
    amount: z.coerce
      .number({ required_error: "Please input total!" })
      .min(1, "Please input total!"),
  })
  .refine(
    (input) => {
      if (input.reimbursement_request_type_id === UNSCHEDULED) {
        return input?.approvers ? input.approvers.length > 0 : false;
      }

      if (input.expense_type_id === EXPENSE_TYPE_OTHERS) {
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

export type ReimbursementDetailsType = z.infer<
  typeof ReimbursementDetailsSchema
>;
