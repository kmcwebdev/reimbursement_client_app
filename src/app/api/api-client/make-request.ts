import {
  type AxiosError,
  type AxiosRequestConfig,
  type AxiosResponse,
} from "axios";
import { type RtkApiError } from "~/types/reimbursement.types";
import axiosClient from "./axios-client";

export const makeRequest = async <TResponse, TData = unknown>(
  options: AxiosRequestConfig<TData>,
) => {
  const onSuccess = (response: AxiosResponse<TResponse>) => {
    return response.data;
  };

  const onError = function (error: AxiosError<RtkApiError>) {
    return Promise.reject({
      message: error.message,
      code: error.code,
      response: error.response,
    });
  };
  return axiosClient(options).then(onSuccess).catch(onError);
};
