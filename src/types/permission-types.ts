import { type MongoAbility } from "@casl/ability";

export type AbilityActions = "access" | "create" | "read" | "update" | "delete";

export type AppClaims =
  | "CAN_APPROVE_REIMBURSEMENT"
  | "CAN_GENERATE_REIMBURSEMENT_REPORT"
  | "CAN_BULK_APPROVE_REIMBURSEMENT"
  |"CAN_BULK_REJECT_REIMBURSEMENT"
  | "USER"
  | "USER_PROFILE";

export type AppAbility = MongoAbility<[AbilityActions, AppClaims]>;
