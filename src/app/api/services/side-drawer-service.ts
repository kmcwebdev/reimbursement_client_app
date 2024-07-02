import { useQuery } from "react-query";
import { type ReimbursementRequest } from "~/types/reimbursement.types";
import { makeRequest } from "../api-client/make-request";

class SideDrawerApiService {
  //#region ReimbursementRequest
  private static getReimbursementRequest = <T>(id: number) => {
    return makeRequest<T>({
      url: `reimbursements/request/${id}`,
      method: "GET",
    });
  };

  public static useReimbursementRequest = <T = ReimbursementRequest>(
    id: number,
  ) => {
    return useQuery({
      queryKey: ["ReimbursementRequest", id],
      queryFn: () => this.getReimbursementRequest<T>(id),
      enabled: !!id,
    });
  };
  //#endregion
}

export default SideDrawerApiService;
