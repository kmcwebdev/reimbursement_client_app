import { useMutation, useQuery } from "react-query";
import {
  type ChangePasswordPayload,
  type ForgotPasswordPayload,
  type RtkApiError,
  type User,
  type UsersResponse,
} from "~/types/reimbursement.types";
import { makeRequest } from "../api-client/make-request";
import { type GlobalMutationOption } from "./email-action-service";

class UserService {
  //#region Me
  private static getMe = () => {
    return makeRequest<User>({
      url: "/management/users/me",
      method: "GET",
    });
  };

  public static useMe = (access_token: string | null) => {
    return useQuery<User, RtkApiError>({
      queryKey: ["Me"],
      queryFn: this.getMe,
      enabled: !!access_token,
    });
  };
  //#endregion

  //#region Users
  private static getUsers = () => {
    return makeRequest<UsersResponse>({
      url: "/management/users",
      method: "GET",
    });
  };

  public static useUsers = () => {
    return useQuery<UsersResponse, RtkApiError>({
      queryKey: ["Users"],
      queryFn: this.getUsers,
    });
  };
  //#endregion

  //#region Assign Group
  private static assignGroup = (payload: { id: number; group_id: number }) => {
    return makeRequest({
      url: `/management/users/${payload.id}/group/assign`,
      method: "PATCH",
      data: {
        group_id: payload.group_id,
        replace_all: true,
      },
    });
  };

  public static useAssignGroup = (
    options?: GlobalMutationOption<{
      id: number;
      group_id: number;
    }>,
  ) => {
    return useMutation({
      ...options,
      mutationKey: ["AssignGroup"],
      mutationFn: (payload) => this.assignGroup(payload),
    });
  };
  //#endregion

  //#region Update Basic Info
  private static updateBasicInfo = (payload: {
    first_name: string;
    last_name: string;
  }) => {
    return makeRequest({
      url: "/management/users/me",
      method: "PATCH",
      data: {
        ...payload,
      },
    });
  };

  public static useUpdateBasicInfo = (
    options?: GlobalMutationOption<{
      first_name: string;
      last_name: string;
    }>,
  ) => {
    return useMutation({
      ...options,
      mutationKey: ["UpdateBasicInfo"],
      mutationFn: (payload) => this.updateBasicInfo(payload),
    });
  };
  //#endregion

  //#region Forgot Password
  private static forgotPassword = (payload: ForgotPasswordPayload) => {
    return makeRequest({
      url: "/management/users/forgot-password",
      method: "POST",
      data: {
        ...payload,
      },
    });
  };

  public static useForgotPassword = (
    options?: GlobalMutationOption<ForgotPasswordPayload>,
  ) => {
    return useMutation({
      ...options,
      mutationKey: ["ForgotPassword"],
      mutationFn: (payload) => this.forgotPassword(payload),
    });
  };
  //#endregion

  //#region Update Profile Password
  private static updateProfilePassword = (
    payload: Pick<ChangePasswordPayload, "new_password">,
  ) => {
    return makeRequest({
      url: "/management/users/profile/change-password",
      method: "PATCH",
      data: {
        ...payload,
      },
    });
  };

  public static useUpdateProfilePassword = (
    options?: GlobalMutationOption<Pick<ChangePasswordPayload, "new_password">>,
  ) => {
    return useMutation({
      ...options,
      mutationKey: ["UpdateProfilePassword"],
      mutationFn: (payload) => this.updateProfilePassword(payload),
    });
  };
  //#endregion

  //#region Update Password
  private static updatePassword = (payload: ChangePasswordPayload) => {
    return makeRequest({
      url: "/management/users/change-password",
      method: "PATCH",
      data: {
        ...payload,
      },
    });
  };

  public static useUpdatePassword = (
    options?: GlobalMutationOption<ChangePasswordPayload>,
  ) => {
    return useMutation({
      ...options,
      mutationKey: ["UpdatePassword"],
      mutationFn: (payload) => this.updatePassword(payload),
    });
  };
  //#endregion
}

export default UserService;
