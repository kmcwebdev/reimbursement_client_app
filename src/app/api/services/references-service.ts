import { useInfiniteQuery, useQuery } from "react-query";
import { useAppSelector } from "~/app/hook";
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
  private static getRequestTypes = <T>() => {
    return makeRequest<T>({
      url: "/reimbursements/request/request-types",
      method: "GET",
    });
  };

  public static useRequestTypes = <T = RequestTypeResponse>() => {
    return useQuery<T, RtkApiError>({
      queryKey: ["RequestTypes"],
      queryFn: () => this.getRequestTypes<T>(),
    });
  };
  //#endregion

  //#region Expense Types
  private static getExpenseTypes = <T>(params: ReimbursementFormType) => {
    const { request_type } = params;
    const parse = reimbursementTypeSchema.safeParse({ request_type });

    if (!parse.success) {
      throw new Error("Invalid request_type_id");
    }
    return makeRequest<T>({
      url: "/reimbursements/request/expense-types",
      method: "GET",
      params: {
        request_type__id: request_type,
      },
    });
  };

  public static useExpenseTypes = <T = ExpenseTypeResponse>(
    params: ReimbursementFormType,
  ) => {
    return useQuery<T, RtkApiError>({
      queryKey: ["ExpenseTypes", params],
      queryFn: () => this.getExpenseTypes<T>(params),
    });
  };
  //#endregion

  //#region All Status
  private static getAllStatus = <T>() => {
    return makeRequest<T>({
      url: "/reimbursements/request/request-status",
      method: "GET",
    });
  };

  public static useAllStatus = <T = StatusResponse>() => {
    return useQuery<T, RtkApiError>({
      queryKey: ["AllStatus"],
      queryFn: () => this.getAllStatus<T>(),
    });
  };
  //#endregion

  //#region All Expense Types
  private static getAllExpenseTypes = <T>() => {
    return makeRequest<T>({
      url: "/reimbursements/request/expense-types?page_size=100",
      method: "GET",
    });
  };

  public static useAllExpenseTypes = <T = ExpenseTypeResponse>() => {
    return useQuery<T, RtkApiError>({
      queryKey: ["AllExpenseTypes"],
      queryFn: () => this.getAllExpenseTypes<T>(),
    });
  };
  //#endregion

  //#region All Group
  private static getAllGroup = <T>() => {
    return makeRequest<T>({
      url: "/reimbursements/request/expense-types?page_size=100",
      method: "GET",
    });
  };

  public static useAllGroup = <T = GroupResponse>() => {
    const { user } = useAppSelector((state) => state.session);
    return useQuery<T, RtkApiError>({
      queryKey: ["AllGroup"],
      queryFn: () => this.getAllGroup<T>(),
      enabled: !!user?.is_staff || !!user?.profile,
    });
  };
  //#endregion

  //#region All Clients
  private static getAllClients = <T>(params: ClientFilterQuery) => {
    const searchParams = createSearchParams(params);

    return makeRequest<T, ClientFilterQuery>({
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
        return this.getAllClients<ReimbursementClientsResponse>({
          ...params,
          ...nextPageParams,
        });
      },
      getNextPageParam: (lastPage) => lastPage.next,
    });
  };
  //#endregion

  //#region All Hrbps
  private static getAllHrbps = <T>(params: ClientFilterQuery) => {
    const searchParams = createSearchParams(params);
    searchParams?.append("group_id", "4");

    return makeRequest<T>({
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
        return this.getAllHrbps<ReimbursementHrbpsResponse>({
          ...params,
          ...nextPageParams,
        });
      },
      getNextPageParam: (lastPage) => lastPage.next,
    });
  };
  //#endregion
}

export default ReferencesApiService;
