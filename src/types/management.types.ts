import { type IResponsePagination } from "./global-types";

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
