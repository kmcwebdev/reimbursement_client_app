export type UploadFileResponse = {
  name: string;
  status: string;
  type: string;
  size: number;
  url: string;
  handle: string;
  uploadTags: { search_query: string };
};
