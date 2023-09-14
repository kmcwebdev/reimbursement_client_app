import { defineAbility as CASLdefineAbility } from "@casl/ability";
import { type AppAbility, type AppClaims } from "~/types/permission-types";

export const defineAbility = (claims?: AppClaims[]) => {
  return CASLdefineAbility<AppAbility>((can) => {
    if (claims && claims.length > 0) {
      claims.forEach((claim) => {
        can("access", claim);
      });
    }

    can("access", "USER_PROFILE");
    can("access", "USER");
  });
};
