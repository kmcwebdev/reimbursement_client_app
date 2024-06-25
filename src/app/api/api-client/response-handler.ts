import { type AxiosError } from "axios";

const responseHandler = async (err: AxiosError) => {
  const status = err.response ? err.response.status : null;

  if (status === 401) {
    console.log("handleRefreshToken");
  }

  return Promise.reject(err);
};

export default responseHandler;
