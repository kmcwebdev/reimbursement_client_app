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
    name: string;
    icon?: IconType;
    className?: string;
    hasErrors?: boolean;
    required?: boolean;
  };

const inputVariants = cva("py-2 text-sm rounded", {
  variants: {
    variant: {
      default:
        "rounded-md py-2 border-neutral-subtle focus:border-transparent placeholder:text-neutral-subtle placeholder:text-xs sm:text-sm focus:ring-1 focus:ring-inset focus:ring-primary-default",
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
  icon: Icon,
  type = "text",
  name,
  placeholder,
  variant,
  width,
  hasErrors = false,
  required = false,
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
          className="text-xs font-semibold text-neutral-800"
        >
          {label} {required && <span className="text-primary-default">*</span>}
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
                  : "text-neutral-subtle",
              )}
              aria-hidden="true"
            />
          </div>
        )}

        {formContext ? (
          <input
            {...formContext.register(name, options)}
            type={type}
            className={classNames(
              className,
              inputVariants({ variant, width }),
              formContext.formState.errors[name]?.message
                ? "input-error"
                : "input-default",
              Icon && "pl-10",
              "w-full",
            )}
            placeholder={
              placeholder && type !== "date" ? placeholder : undefined
            }
          />
        ) : (
          <input
            type={type}
            className={classNames(
              className,
              inputVariants({ variant, width }),
              hasErrors ? "input-error" : "input-default",
              Icon && "pl-10",
              "w-full",
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
