export type MutationError = {
  status: number;
  data: {
    errors: G_IError[];
    message: string;
    statusCode: number;
  };
};

type G_IError = {
  code: string;
  message: string;
  path: string[];
};

export type IError = {
  detail: string;
};

type G_EmailError = {
  statusCode: number;
  message: string;
};

export type EmailActionMutationError = Omit<MutationError, "data"> & {
  data: G_EmailError;
};

export type IResponsePagination = {
  count: number;
  next: string;
  previous: string;
};
