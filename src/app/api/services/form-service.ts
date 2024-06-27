import { useMutation } from "react-query";
import { type ReimbursementFormValues } from "~/types/reimbursement.types";
import { makeRequest } from "../api-client/make-request";

class FormApiService {
  //#region Create Reimbursement
  private static createReimbursement = (payload: ReimbursementFormValues) => {
    return makeRequest({
      url: "/reimbursements/request",
      method: "POST",
      data: payload,
    });
  };

  public static useCreateReimbursement = (payload: ReimbursementFormValues) => {
    return useMutation({
      mutationKey: ["CreateReimbursement"],
      mutationFn: () => this.createReimbursement(payload),
    });
  };
  //#endregion

  //#region Upload File
  private static uploadFile = (payload: FormData) => {
    return makeRequest({
      url: "/reimbursements/request",
      method: "POST",
      data: payload,
    });
  };

  public static useUploadFile = () => {
    return useMutation({
      mutationKey: ["CreateReimbursement"],
      mutationFn: (e: FormData) => this.uploadFile(e),
    });
  };
  //#endregion
}

export default FormApiService;
