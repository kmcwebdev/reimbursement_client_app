import { useInfiniteQuery, useQuery } from "react-query";
import { reimbursementTypeSchema } from "~/schema/reimbursement-type.schema";
import {
  type ClientFilterQuery,
  type ExpenseTypeResponse,
  type GroupResponse,
  type ReimbursementClientsResponse,
  type ReimbursementFormType,
  type ReimbursementHrbpsResponse,
  type RequestTypeResponse,
  type RtkApiError,
  type StatusResponse,
} from "~/types/reimbursement.types";
import { createSearchParams } from "~/utils/create-search-params";
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
  private static getExpenseTypes = (params: ReimbursementFormType) => {
    const { request_type } = params;
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

  public static useExpenseTypes = (params: ReimbursementFormType) => {
    return useQuery<ExpenseTypeResponse, RtkApiError>({
      queryKey: ["ExpenseTypes", params],
      queryFn: () => this.getExpenseTypes(params),
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

  //#region All Clients
  private static getAllClients = (params: ClientFilterQuery) => {
    const searchParams = createSearchParams(params);

    return makeRequest<ReimbursementClientsResponse>({
      url: "/reimbursements/request/clients",
      method: "GET",
      params: searchParams ? searchParams : {},
    });
  };

  public static useAllClients = (params: ClientFilterQuery) => {
    return useInfiniteQuery<ReimbursementClientsResponse, RtkApiError>({
      queryKey: ["AllClients", params],
      queryFn: ({ pageParam }) => {
        let nextPageParams = {};

        if (!params.search && pageParam) {
          const pageParamUrl = new URL(pageParam as string);
          const search = pageParamUrl.search.substring(1);
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          nextPageParams = JSON.parse(
            '{"' +
              decodeURI(search)
                .replace(/"/g, '\\"')
                .replace(/&/g, '","')
                .replace(/=/g, '":"') +
              '"}',
          );
        }
        return this.getAllClients({ ...params, ...nextPageParams });
      },
      getNextPageParam: (lastPage) => lastPage.next,
    });
  };
  //#endregion

  //#region All Hrbps
  private static getAllHrbps = (params: ClientFilterQuery) => {
    const searchParams = createSearchParams(params);
    searchParams?.append("group_id", "4");

    return makeRequest<ReimbursementHrbpsResponse>({
      url: "/management/users",
      method: "GET",
      params: searchParams ? searchParams : {},
    });
  };

  public static useAllHrbps = (params: ClientFilterQuery) => {
    return useInfiniteQuery<ReimbursementHrbpsResponse, RtkApiError>({
      queryKey: ["AllHrbps", params],
      queryFn: ({ pageParam }) => {
        let nextPageParams = {};

        if (!params.search && pageParam) {
          const pageParamUrl = new URL(pageParam as string);
          const search = pageParamUrl.search.substring(1);
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          nextPageParams = JSON.parse(
            '{"' +
              decodeURI(search)
                .replace(/"/g, '\\"')
                .replace(/&/g, '","')
                .replace(/=/g, '":"') +
              '"}',
          );
        }
        return this.getAllHrbps({ ...params, ...nextPageParams });
      },
      getNextPageParam: (lastPage) => lastPage.next,
    });
  };
  //#endregion
}

export default ReferencesApiService;
