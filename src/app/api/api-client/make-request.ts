import {
  type AxiosError,
  type AxiosRequestConfig,
  type AxiosResponse,
} from "axios";
import axiosClient from "./axios-client";

export const makeRequest = async <T>(options: AxiosRequestConfig<T>) => {
  const onSuccess = (response: AxiosResponse<T>) => {
    return response.data;
  };

  const onError = function (error: AxiosError) {
    return Promise.reject({
      message: error.message,
      code: error.code,
      response: error.response,
    });
  };
  return axiosClient(options).then(onSuccess).catch(onError);
};
