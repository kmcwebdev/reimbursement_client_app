import { type IUser } from "~/features/state/user-state.slice";
import { type IResponsePagination } from "./global-types";

export type IUsersResponse = {
  results: IUser[];
} & IResponsePagination;

export type IPermissions = {
  id: number;
  name: string;
  content_type: {
    property1: string;
    property2: string;
  };
  groups: [
    {
      property1: string;
      property2: string;
    },
  ];
};

export type IPermissionsResponse = {
  results: IPermissions[];
} & IResponsePagination;
