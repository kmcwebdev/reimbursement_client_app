import { useAbility as CASLuseAbility, createContextualCan } from "@casl/react";
import { createContext } from "react";
import { type AppAbility } from "~/types/reimbursement.types";

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
export const AbilityContext = createContext<AppAbility>(null!);
export const Can = createContextualCan(AbilityContext.Consumer);
export const useAppPermission = () => CASLuseAbility(AbilityContext);
