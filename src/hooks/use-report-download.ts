import { useAppSelector } from "~/app/hook";

export const useReportDownload = ({
  onSuccess,
  onError,
}: {
  onSuccess: () => void;
  onError: () => void;
}) => {
  const { accessToken } = useAppSelector((state) => state.session);

  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  };

  const download = async (downloadUrl: string) => {
    try {
      const response = await fetch(downloadUrl, options);

      if (response.ok) {
        await response.blob().then((blob) => {
          const url = window.URL.createObjectURL(
            new Blob([blob], { type: "csv" }),
          );

          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", `filename.csv`);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          onSuccess();
        });
      } else {
        onError();
      }
    } catch (error) {
      if (error) {
      }
    }
  };

  return { download };
};
