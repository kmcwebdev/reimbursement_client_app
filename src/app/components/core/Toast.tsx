/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { motion } from "framer-motion";
import React from "react";
import toast, { type Toast } from "react-hot-toast";
import { HiCheckCircle } from "react-icons-all-files/hi/HiCheckCircle";
import { HiExclamationCircle } from "react-icons-all-files/hi/HiExclamationCircle";
import { HiInformationCircle } from "react-icons-all-files/hi/HiInformationCircle";
import { MdClose } from "react-icons-all-files/md/MdClose";

export type ToastType = "success" | "warning" | "info" | "error";

const DEFAULT_TITLE = {
  success: "Success!",
  warning: "Warning!",
  info: "Hi there!",
  error: "Oh snap!",
};

const DEFAULT_THEME_BG = {
  success: "bg-green-600",
  warning: "bg-orange-600",
  info: "bg-blue-600",
  error: "bg-red-600",
};

const DEFAULT_ICON = {
  success: <HiCheckCircle className="h-8 w-8 text-green-600" />,
  warning: <HiExclamationCircle className="h-8 w-8 text-orange-600" />,
  info: <HiInformationCircle className="h-8 w-8 text-blue-600" />,
  error: <HiExclamationCircle className="h-8 w-8 text-red-600" />,
};

const DEFAULT_DESCRIPTION = {
  success: "Successfully done with your request.",
  warning: "There was a problem with your request.",
  info: "Something you might want to know.",
  error: "Internal server error.",
};

interface Props {
  title?: string;
  t: Toast;
  description?: string | JSX.Element;
  type?: ToastType;
  showCloseButton?: boolean;
}

const ToastComponent: React.FC<Props> = ({
  t,
  title,
  description,
  type = "success",
  showCloseButton = false,
}) => {
  t.position = "top-right";

  return (
    <motion.div
      initial={{
        y: t.visible ? 0 : 20,
        opacity: t.visible ? 0 : 1,
        scale: t.visible ? 0.7 : 1,
      }}
      animate={{
        y: t.visible ? 20 : 0,
        opacity: t.visible ? 1 : 0,
        scale: t.visible ? 1 : 0.7,
      }}
      transition={{ type: "tween", duration: 0.2 }}
      className="relative flex w-96 items-center gap-3 rounded-md border border-gray-100 bg-white px-4 py-2 shadow-md"
    >
      <div className={`h-full w-[4px] rounded-sm ${DEFAULT_THEME_BG[type]}`} />

      {DEFAULT_ICON[type]}

      <div className="w-4/5">
        <h6 className="font-barlow text-lg font-bold">
          {title || DEFAULT_TITLE[type]}
        </h6>
        <p className="text-sm">{description || DEFAULT_DESCRIPTION[type]}</p>
      </div>

      {showCloseButton && (
        <button
          onClick={() => toast.dismiss()}
          className="absolute right-2 top-2"
        >
          <MdClose />
        </button>
      )}
    </motion.div>
  );
};

export const showToast = (props?: {
  description?: string | JSX.Element;
  title?: string;
  type?: ToastType;
  duration?: number;
  showCloseButton?: boolean;
}) => {
  return toast.custom((t) => <ToastComponent t={{ ...t }} {...props} />, {
    duration: props?.duration,
  });
};
