import { cva, type VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes } from "react";
import { forwardRef } from "react";
import { BiLoaderCircle } from "react-icons-all-files/bi/BiLoaderCircle";
import { classNames } from "~/utils/classNames";

const buttonVariants = cva("btn", {
  variants: {
    buttonType: {
      filled: "filled",
      outlined: "outlined",
      text: "text",
    },
    variant: {
      primary: "primary",
      filled: "primary",
      informative: "informative",
      danger: "danger",
      neutral: "neutral",
      success: "success",
    },
    width: {
      default: "w-fit",
      full: "w-full",
    },
    size: {
      default: "text-sm",
      xxs: "px-2 py-2 text-xs",
      xs: "px-3 py-1.5 text-xs",
      sm: "px-3 py-1.5 text-sm",
      md: "px-4 py-2 text-sm",
      lg: "px-4 py-2 text-base",
    },
  },
  defaultVariants: {
    variant: "primary",
    buttonType: "filled",
    size: "default",
    width: "default",
  },
});

type ButtonType = "filled" | "outlined" | "text";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    buttonType?: ButtonType;
    loading?: boolean;
  };

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      size,
      variant,
      buttonType,
      width,
      loading = false,
      children,
      ...rest
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        className={classNames(
          buttonVariants({ variant, buttonType, size, className, width }),
        )}
        {...rest}
      >
        <div className="flex items-center justify-between gap-4">
          {children}
          {loading && <BiLoaderCircle className="h-5 w-5 animate-spin" />}
        </div>
      </button>
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants, type ButtonProps };
