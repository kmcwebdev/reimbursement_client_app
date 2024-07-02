import axios from "axios";
import { env } from "~/env.mjs";
import requestHandler from "./request-handler";
import responseHandler from "./response-handler";

const axiosClient = (() => {
  return axios.create({
    baseURL: env.NEXT_PUBLIC_BASEAPI_URL,
    headers: {
      Accept: "application/json, text/plain, */*",
    },
  });
})();

axiosClient.interceptors.request.use(requestHandler);
axiosClient.interceptors.response.use((res) => res, responseHandler);

export default axiosClient;
