import { z } from "zod";

export const statusTypeSchema = z.enum([
  "Pending",
  "Approved",
  "Processing",
  "Credited",
  "On-hold",
  "Rejected",
  "Cancelled",
]);
