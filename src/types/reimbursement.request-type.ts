import { type IResponsePagination } from "./global-types";

export interface ReimbursementRequestType {
  id: number;
  name: string;
}

export type IRequestTypeResponse = {
  results: ReimbursementRequestType[];
} & IResponsePagination;
