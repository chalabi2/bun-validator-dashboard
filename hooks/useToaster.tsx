import { ReactNode } from "react";
import { toast as showToast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export enum ToastType {
  Info = "info",
  Error = "error",
  Success = "success",
  Loading = "loading",
}

export type CustomToast = {
  title: string;
  message?: string | JSX.Element;
  type: ToastType;
  closable?: boolean;
  duration?: number;
  txHash?: string;
  chainName?: string;
};

declare type ToastId = string | number;

let loadingToastId: ToastId | null = null;

export const useToaster = () => {
  const toast = ({
    type,
    title,
    message,
    closable = true,
    duration = 10000,
    txHash,
    chainName,
  }: CustomToast) => {
    const toastOptions = {
      autoClose: duration,
      closeOnClick: closable,
    };

    let toastContent = message || title;

    if (txHash && chainName) {
      const txUrl = `https://www.mintscan.io/${chainName}/txs/${txHash}`;
      toastContent = (
        <div>
          {message || title}
          <br />
          <a
            href={txUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-300"
          >
            View on Mintscan
          </a>
        </div>
      );
    }

    const LoadingToast: React.FC<{ message: string }> = ({ message }) => {
      return (
        <div className="bg-blue-500 flex items-center p-2 rounded-md text-black">
          <div className="animate-spin rounded-full h-6 w-6">
            <div className="w-full h-full rounded-full border-2 border-t-accent-light border-r-accent-light  border-l-accent-light" />
          </div>
          {message}
        </div>
      );
    };

    const showToastWithType = (content: React.ReactNode) => {
      switch (type) {
        case ToastType.Info:
          return showToast.info(content, { ...toastOptions });
        case ToastType.Success:
          showToast.dismiss(loadingToastId?.toString());
          return showToast.success(content, { ...toastOptions });
        case ToastType.Error:
          showToast.dismiss(loadingToastId?.toString());
          return showToast.error(content, { ...toastOptions });
        case ToastType.Info:
          loadingToastId = showToast(
            <LoadingToast message={content?.toString() ?? ""} />,
            {
              ...toastOptions,
              autoClose: false,
              className: "bg-blue-500",
            }
          );
          return loadingToastId;
        default:
          return showToast(content, { ...toastOptions });
      }
    };

    return showToastWithType(toastContent);
  };

  // No need to return ToastContainer as it will be used directly in components
  return { toast };
};
