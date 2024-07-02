import { useMutation } from "react-query";
import { type ReimbursementFormValues } from "~/types/reimbursement.types";
import { makeRequest } from "../api-client/make-request";
import { type GlobalMutationOption } from "./email-action-service";

class FormApiService {
  //#region Create Reimbursement
  private static createReimbursement = (payload: ReimbursementFormValues) => {
    return makeRequest({
      url: "/reimbursements/request",
      method: "POST",
      data: payload,
    });
  };

  public static useCreateReimbursement = (
    options?: GlobalMutationOption<ReimbursementFormValues>,
  ) => {
    return useMutation({
      ...options,
      mutationKey: ["CreateReimbursement"],
      mutationFn: (payload) => this.createReimbursement(payload),
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

  public static useUploadFile = (options: GlobalMutationOption<FormData>) => {
    return useMutation({
      ...options,
      mutationKey: ["CreateReimbursement"],
      mutationFn: (payload) => this.uploadFile(payload),
    });
  };
  //#endregion
}

export default FormApiService;
