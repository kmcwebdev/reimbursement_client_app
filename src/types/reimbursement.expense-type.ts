import { type IResponsePagination } from "./global-types";

export interface IExpenseType {
  id: number;
  name: string;
}

export type IExpenseTypeResponse = {
  results: IExpenseType[];
} & IResponsePagination;
