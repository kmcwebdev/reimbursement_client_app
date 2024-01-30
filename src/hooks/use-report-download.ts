import { useAppSelector } from "~/app/hook";
import { type IError } from "~/types/global-types";

export const useReportDownload = ({
  onSuccess,
  onError,
}: {
  onSuccess: () => void;
  onError: (desc?: unknown) => void;
}) => {
  const { accessToken } = useAppSelector((state) => state.session);

  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  };

  const download = async (downloadUrl: string, filename: string) => {
    try {
      const response = await fetch(downloadUrl, options);

      if (response.ok) {
        await response.blob().then((blob) => {
          const url = window.URL.createObjectURL(
            new Blob([blob], { type: "csv" }),
          );

          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", `${filename}.csv`);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          onSuccess();
        });
      } else {
        const error: IError = (await response.json()) as IError;
        onError(error.detail);
      }
    } catch (error) {
      if (error) {
        onError(error);
      }
    }
  };

  return { download };
};
