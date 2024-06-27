import { useQuery } from "react-query";
import { reimbursementTypeSchema } from "~/schema/reimbursement-type.schema";
import {
  type ExpenseTypeResponse,
  type GroupResponse,
  type ReimbursementFormType,
  type RequestTypeResponse,
  type RtkApiError,
  type StatusResponse,
} from "~/types/reimbursement.types";
import { makeRequest } from "../api-client/make-request";

class ReferencesApiService {
  //#region Request Types
  private static getRequestTypes = () => {
    return makeRequest<RequestTypeResponse>({
      url: "/reimbursements/request/request-types",
      method: "GET",
    });
  };

  public static useRequestTypes = () => {
    return useQuery<RequestTypeResponse, RtkApiError>({
      queryKey: ["RequestTypes"],
      queryFn: this.getRequestTypes,
    });
  };
  //#endregion

  //#region Expense Types
  private static getExpenseTypes = (payload: ReimbursementFormType) => {
    const { request_type } = payload;
    const parse = reimbursementTypeSchema.safeParse({ request_type });

    if (!parse.success) {
      throw new Error("Invalid request_type_id");
    }
    return makeRequest<ExpenseTypeResponse>({
      url: "/reimbursements/request/expense-types",
      method: "GET",
      params: {
        request_type__id: request_type,
      },
    });
  };

  public static useExpenseTypes = (payload: ReimbursementFormType) => {
    return useQuery<ExpenseTypeResponse, RtkApiError>({
      queryKey: ["ExpenseTypes", payload],
      queryFn: () => this.getExpenseTypes(payload),
    });
  };
  //#endregion

  //#region All Status
  private static getAllStatus = () => {
    return makeRequest<StatusResponse>({
      url: "/reimbursements/request/request-status",
      method: "GET",
    });
  };

  public static useAllStatus = () => {
    return useQuery<StatusResponse, RtkApiError>({
      queryKey: ["AllStatus"],
      queryFn: this.getAllStatus,
    });
  };
  //#endregion

  //#region All Expense Types
  private static getAllExpenseTypes = () => {
    return makeRequest<ExpenseTypeResponse>({
      url: "/reimbursements/request/expense-types?page_size=100",
      method: "GET",
    });
  };

  public static useAllExpenseTypes = () => {
    return useQuery<ExpenseTypeResponse, RtkApiError>({
      queryKey: ["AllExpenseTypes"],
      queryFn: this.getAllExpenseTypes,
    });
  };
  //#endregion

  //#region All Group
  private static getAllGroup = () => {
    return makeRequest<GroupResponse>({
      url: "/reimbursements/request/expense-types?page_size=100",
      method: "GET",
    });
  };

  public static useAllGroup = () => {
    return useQuery<GroupResponse, RtkApiError>({
      queryKey: ["AllGroup"],
      queryFn: this.getAllGroup,
    });
  };
  //#endregion
}

export default ReferencesApiService;
