import { useQuery } from "react-query";
import { type ReimbursementRequest } from "~/types/reimbursement.types";
import { makeRequest } from "../api-client/make-request";

class SideDrawerApiService {
  //#region ReimbursementRequest
  private static getReimbursementRequest = (id: number) => {
    return makeRequest<ReimbursementRequest>({
      url: `reimbursements/request/${id}`,
      method: "GET",
    });
  };

  public static useReimbursementRequest = (id: number) => {
    return useQuery({
      queryKey: ["ReimbursementRequest", id],
      queryFn: () => this.getReimbursementRequest(id),
      enabled: !!id,
    });
  };
  //#endregion
}

export default SideDrawerApiService;