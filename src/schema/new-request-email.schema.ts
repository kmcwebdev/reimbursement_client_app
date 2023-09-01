import { z } from "zod";

export const NewRequestEmailSchema = z.object({
  to: z.array(
    z
      .string({
        description: "Email address",
        required_error: "Email address is required",
        invalid_type_error: "Email address is invalid",
      })
      .email({
        message: "Email address is invalid",
      }),
  ),
  requestId: z
    .string({
      description: "Request ID",
      required_error: "Request ID is required",
      invalid_type_error: "Request ID is invalid",
    })
    .nonempty({
      message: "Request ID is required",
    }),
  hrbpManagerName: z
    .string({
      description: "HRBP Manager Name",
      required_error: "HRBP Manager Name is required",
      invalid_type_error: "HRBP Manager Name is invalid",
    })
    .nonempty({
      message: "HRBP Manager Name is required",
    }),
  fullName: z
    .string({
      description: "Full Name",
      required_error: "Full Name is required",
      invalid_type_error: "Full Name is invalid",
    })
    .nonempty({
      message: "Full Name is required",
    }),
  employeeId: z
    .string({
      description: "Employee ID",
      required_error: "Employee ID is required",
      invalid_type_error: "Employee ID is invalid",
    })
    .nonempty({
      message: "Employee ID is required",
    }),
  expenseType: z
    .string({
      description: "Expense Type",
      required_error: "Expense Type is required",
      invalid_type_error: "Expense Type is invalid",
    })
    .nonempty({
      message: "Expense Type is required",
    }),
  expenseDate: z
    .string({
      description: "Expense Date",
      required_error: "Expense Date is required",
      invalid_type_error: "Expense Date is invalid",
    })
    .nonempty({
      message: "Expense Date is required",
    }),
  amount: z
    .string({
      description: "Amount",
      required_error: "Amount is required",
      invalid_type_error: "Amount is invalid",
    })
    .nonempty({
      message: "Amount is required",
    }),
  receiptsAttached: z
    .string({
      description: "Receipts Attached",
      required_error: "Receipts Attached is required",
      invalid_type_error: "Receipts Attached is invalid",
    })
    .nonempty({
      message: "Receipts Attached is required",
    }),
});