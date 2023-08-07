import { cva, type VariantProps } from "class-variance-authority";
import {
  useFormContext,
  type FieldValues,
  type RegisterOptions,
} from "react-hook-form";
import { type IconType } from "react-icons-all-files";
import { classNames } from "~/utils/classNames";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> &
  VariantProps<typeof inputVariants> & {
    label?: string;
    labelColor?: "white" | "gray-700";
    name: string;
    icon?: IconType;
    bgColor?: "gray" | "white";
    className?: string;
    hasErrors?: boolean;
  };

const inputVariants = cva("py-2 text-sm rounded", {
  variants: {
    variant: {
      default:
        "rounded-md py-2.5 pl-10 outline-none placeholder:text-xs placeholder:font-light focus:ring-inset sm:text-sm",
    },
    width: {
      default: "w-auto",
      full: "w-full",
    },
  },
  defaultVariants: {
    variant: "default",
    width: "default",
  },
});

const Input = ({
  className,
  label,
  labelColor = "gray-700",
  icon: Icon,
  type,
  name,
  bgColor = "gray",
  placeholder,
  variant,
  width,
  hasErrors = false,
}: InputProps) => {
  const formContext = useFormContext();

  const options: RegisterOptions<FieldValues, string> | undefined =
    type === "date"
      ? {
          valueAsDate:
            type === "date" && formContext.getValues(name) ? true : false,
        }
      : type === "number"
      ? {
          setValueAs: (v: string) => (v === "" ? undefined : parseInt(v, 10)),
        }
      : undefined;

  return (
    <div className="space-y-2">
      {label && (
        <label
          htmlFor={name}
          className={classNames(`text-xs text-[${labelColor}]`)}
        >
          {label}
        </label>
      )}

      <div className={classNames(Icon && "relative", "rounded-md")}>
        {Icon && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Icon
              className={classNames(
                "h-5 w-5",
                formContext && formContext.formState.errors[name]?.message
                  ? "text-red-400"
                  : "text-gray-400",
              )}
              aria-hidden="true"
            />
          </div>
        )}

        {formContext ? (
          <input
            {...formContext.register(name, options)}
            className={classNames(
              className,
              inputVariants({ variant, width }),
              formContext.formState.errors[name]?.message
                ? "input-error"
                : bgColor === "gray"
                ? "input-gray-bg"
                : "input-default",
            )}
            placeholder={
              placeholder && type !== "date" ? placeholder : undefined
            }
          />
        ) : (
          <input
            className={classNames(
              className,
              inputVariants({ variant, width }),
              hasErrors
                ? "input-error"
                : bgColor === "gray"
                ? "input-gray-bg"
                : "input-default",
            )}
            placeholder={
              placeholder && type !== "date" ? placeholder : undefined
            }
          />
        )}
      </div>
    </div>
  );
};

Input.displayName = "Input";

export default Input;
