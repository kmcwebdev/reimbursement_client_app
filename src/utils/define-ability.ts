import { defineAbility as CASLdefineAbility } from "@casl/ability";
import { type IRole } from "~/context/UserContext";
import { type AppAbility, type AppClaims } from "~/types/permission-types";

export const defineAbility = (assignedRole?: IRole, claims?: AppClaims[]) => {
  return CASLdefineAbility<AppAbility>((can) => {
    if (claims && claims.length > 0) {
      claims.forEach((claim) => {
        can("access", claim);
      });
    }

    if (assignedRole) {
      //Manager permissions
      if (
        assignedRole === "External Reimbursement Approver Manager" &&
        claims?.includes("CAN_APPROVE_REIMBURSEMENT")
      ) {
        can("access", "NAV_ITEM_APPROVAL");
        can("access", "NAV_ITEM_HISTORY");
        can("access", "REIMBURSEMENT_VIEW_APPROVAL");
      }

      //HRBP Permissions
      if (assignedRole === "HRBP") {
        can("access", "NAV_ITEM_HISTORY");
        can("access", "REIMBURSEMENT_VIEW_APPROVAL");
      }

      //Finance Permissions
      if (assignedRole === "Finance") {
        can("access", "NAV_ITEM_HISTORY");
        can("access", "REIMBURSEMENT_VIEW_DOWNLOAD_HOLD");
      }
    }

    //Allows all users to access their profile
    can("access", "USER_PROFILE");
    can("access", "USER");
  });
};
