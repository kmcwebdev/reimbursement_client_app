import { type MongoAbility } from "@casl/ability";

export type AbilityActions = "access" | "create" | "read" | "update" | "delete";

export type AppClaims =
  //Action Permissions
  | "CAN_APPROVE_REIMBURSEMENT"
  | "CAN_GENERATE_REIMBURSEMENT_REPORT"
  | "CAN_BULK_APPROVE_REIMBURSEMENT"
  | "CAN_BULK_REJECT_REIMBURSEMENT"

  //Layout Permissions
  | "NAV_ITEM_APPROVAL"
  | "NAV_ITEM_HISTORY"
  | "REIMBURSEMENT_VIEW_APPROVAL"
  | "REIMBURSEMENT_VIEW_DOWNLOAD_HOLD"
  | "USER"
  | "USER_PROFILE";

export type AppAbility = MongoAbility<[AbilityActions, AppClaims]>;
