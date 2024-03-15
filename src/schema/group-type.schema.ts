import { z } from "zod";

export const groupTypeSchema = z.enum([
  "REIMBURSEMENT_USER",
  "REIMBURSEMENT_MANAGER",
  "REIMBURSEMENT_HRBP",
  "REIMBURSEMENT_FINANCE",
]);
