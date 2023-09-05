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
