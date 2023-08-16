import { cva, type VariantProps } from "class-variance-authority";
import {
  useFormContext,
  type FieldValues,
  type RegisterOptions,
} from "react-hook-form";
import { type IconType } from "react-icons-all-files";
import { classNames } from "~/utils/classNames";

export type TextAreaProps = React.InputHTMLAttributes<HTMLTextAreaElement> &
  VariantProps<typeof inputVariants> & {
    label: string;
    name: string;
    icon?: IconType;
    hasError?: boolean;
    rows?: number;
  };

const inputVariants = cva("py-2 text-sm rounded", {
  variants: {
    variant: {
      default:
        " rounded-md  py-2.5 pl-10 outline-none placeholder:text-xs placeholder:font-light focus:ring-inset sm:text-sm",
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

const TextArea = ({
  label,
  icon: Icon,
  type,
  name,
  placeholder,
  hasError = false,
  rows = 4,
  required = false,
}: TextAreaProps) => {
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
                  : "text-gray-400",
              )}
              aria-hidden="true"
            />
          </div>
        )}

        {formContext ? (
          <textarea
            {...formContext.register(name, options)}
            placeholder={placeholder}
            className={classNames(
              hasError || formContext.formState.errors[name]?.message
                ? "input-error"
                : "input-default",
            )}
            rows={rows}
          />
        ) : (
          <textarea
            placeholder={placeholder}
            className={classNames(
              hasError ? "input-error" : "input-default",
              "w-full resize-none rounded-md border-neutral-subtle py-2 placeholder:pt-1 placeholder:text-xs placeholder:text-neutral-subtle focus:border-transparent focus:ring-1 focus:ring-inset focus:ring-primary-default sm:text-sm",
            )}
            rows={rows}
          />
        )}
      </div>
    </div>
  );
};

TextArea.displayName = "TextArea";

export default TextArea;
