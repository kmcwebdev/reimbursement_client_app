import { z } from "zod";
import { appClaimsSchema } from "./app-claims.schema";
import { groupTypeSchema } from "./group-type.schema";

export const userApproverSchema = z.object({
  full_name: z.string(),
  email: z.string(),
});

export const userProfileSchema = z.object({
  employee_id: z.string(),
  organization: z.string(),
  hrbps: z.array(userApproverSchema),
  managers: z.array(userApproverSchema),
  first_login: z.boolean(),
});

export const userSchema = z.object({
  id: z.number(),
  email: z.string(),
  first_name: z.string(),
  last_name: z.string(),
  is_superuser: z.boolean(),
  is_staff: z.boolean(),
  groups: z.array(groupTypeSchema),
  profile: userProfileSchema.nullable(),
  permissions: z.array(appClaimsSchema),
});
