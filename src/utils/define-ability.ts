import { defineAbility as CASLdefineAbility } from "@casl/ability";
import { type IGroupType } from "~/types/group.type";

import { type AppAbility, type AppClaims } from "~/types/permission-types";

export const defineAbility = (
  assignedRole?: IGroupType | null,
  claims?: AppClaims[],
) => {
  return CASLdefineAbility<AppAbility>((can) => {
    if (claims && claims.length > 0) {
      claims.forEach((claim) => {
        can("access", claim);
      });
    }

    if (assignedRole) {
      //Manager permissions
      if (assignedRole === "REIMBURSEMENT_MANAGER") {
        can("access", "NAV_ITEM_APPROVAL");
        can("access", "NAV_ITEM_HISTORY");
        can("access", "REIMBURSEMENT_VIEW_APPROVAL");
        can("access", "CAN_BULK_APPROVE_REIMBURSEMENT");
      }

      //HRBP Permissions
      if (assignedRole === "REIMBURSEMENT_HRBP") {
        can("access", "NAV_ITEM_HISTORY");
        can("access", "REIMBURSEMENT_VIEW_APPROVAL");
      }

      //Finance Permissions
      if (assignedRole === "REIMBURSEMENT_FINANCE") {
        can("access", "NAV_ITEM_HISTORY");
        can("access", "REIMBURSEMENT_VIEW_DOWNLOAD_HOLD");
      }
    }

    //Allows all users to access their profile
    can("access", "USER_PROFILE");
    can("access", "USER");
  });
};
