import { useMutation } from "react-query";
import {
  type FileStack,
  type ReimbursementFormValues,
} from "~/types/reimbursement.types";
import { makeRequest } from "../api-client/make-request";
import { type GlobalMutationOption } from "./email-action-service";

class FormApiService {
  //#region Create Reimbursement
  private static createReimbursement = (payload: ReimbursementFormValues) => {
    return makeRequest<unknown, ReimbursementFormValues>({
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
  private static uploadFile = <T>(payload: FormData) => {
    return makeRequest<T, FormData>({
      url: "/reimbursements/request/attachments",
      method: "POST",
      data: payload,
    });
  };

  public static useUploadFile = <T = FileStack>(
    options: GlobalMutationOption<FormData, T>,
  ) => {
    return useMutation({
      ...options,
      mutationKey: ["CreateReimbursement"],
      mutationFn: (payload) => this.uploadFile<T>(payload),
    });
  };
  //#endregion
}

export default FormApiService;
