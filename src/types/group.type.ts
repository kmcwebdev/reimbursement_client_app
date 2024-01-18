import { type IResponsePagination } from "./global-types";

export type IGroupType =
  | "REIMBURSEMENT_USER"
  | "REIMBURSEMENT_MANAGER"
  | "REIMBURSEMENT_HRBP"
  | "REIMBURSEMENT_FINANCE";

export type IGroup = {
  id: number;
  name: string;
};

export type IGroupsResponse = {
  results: IGroup[];
} & IResponsePagination;
