import { type MongoAbility } from "@casl/ability";

export type AbilityActions = "access" | "create" | "read" | "update" | "delete";

export type AppClaims =
  | "CAN_APPROVE_REIMBURSEMENT"
  | "CAN_GENERATE_REIMBURSEMENT_REPORT"
  | "USER"
  | "USER_PROFILE";

export type AppAbility = MongoAbility<[AbilityActions, AppClaims]>;
