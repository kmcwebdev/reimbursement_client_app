import { z } from "zod";

export const DefaultEmailSchema = z.object({
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
  referenceNo: z.string().min(1),
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

export const NewUserEmailSchema = z.object({
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
  fullName: z
    .string({
      description: "Full Name",
      required_error: "Full Name is required",
      invalid_type_error: "Full Name is invalid",
    })
    .nonempty({
      message: "Full Name is required",
    }),
  email: z
    .string({
      description: "Email",
      required_error: "Email is required",
      invalid_type_error: "Email is invalid",
    })
    .email("Please input valid email!")
    .nonempty({
      message: "Email is required",
    }),
  password: z
    .string({
      description: "Password",
      required_error: "Password is required",
      invalid_type_error: "Password is invalid",
    })
    .nonempty({
      message: "Password is required",
    }),
});

export const ConfirmationEmailSchema = z.object({
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
  requestType: z.enum(["scheduled", "unscheduled"], {
    description: "Reimbursement request type",
    required_error: "Reimbursement request type is required",
    invalid_type_error: "Reimbursement required type is invalid",
  }),
  referenceNo: z
    .string({
      description: "Reference no",
      required_error: "Reference no is required",
      invalid_type_error: "Reference no is invalid",
    })
    .nonempty({
      message: "Reference no is required",
    }),
  approverName: z
    .string({
      description: "Approver Name",
      required_error: "Approver Name is required",
      invalid_type_error: "Approver Name is invalid",
    })
    .nonempty({
      message: "Approver Name is required",
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

export const ManagerApprovalSchema = z
  .object({
    referenceNo: z
      .string({
        description: "Reference no",
        required_error: "Reference no is required",
        invalid_type_error: "Reference no is invalid",
      })
      .nonempty({
        message: "Reference no is required",
      }),
    approverFullName: z
      .string({
        description: "Approver Full Name",
        required_error: "Approver Full Name is required",
        invalid_type_error: "Approver Full Name is invalid",
      })
      .nonempty({
        message: "Approver Full Name is required",
      }),
    approvalLink: z.string().url().optional(),
    rejectionLink: z.string().url().optional(),
  })
  .merge(DefaultEmailSchema);

export const HrbpApprovalSchema = z
  .object({
    referenceNo: z
      .string({
        description: "Reference no",
        required_error: "Reference no is required",
        invalid_type_error: "Reference no is invalid",
      })
      .nonempty({
        message: "Reference no is required",
      }),
    approverFullName: z
      .string({
        description: "Approver Full Name",
        required_error: "Approver Full Name is required",
        invalid_type_error: "Approver Full Name is invalid",
      })
      .nonempty({
        message: "Approver Full Name is required",
      }),
  })
  .merge(DefaultEmailSchema);

export const RejectRequestSchema = z
  .object({
    remarks: z.string().min(1),
  })
  .merge(DefaultEmailSchema);
