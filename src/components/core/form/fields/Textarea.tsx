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
        <label htmlFor={name} className="text-xs">
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
          <textarea
            {...formContext.register(name, options)}
            placeholder={placeholder}
            className={classNames(
              hasError || formContext.formState.errors[name]?.message
                ? "input-error"
                : "input-default",
              "block w-full rounded-md border-0 py-2.5 outline-none placeholder:text-xs placeholder:font-light focus:border focus:ring-1 focus:ring-inset sm:text-sm sm:leading-6",
            )}
          />
        ) : (
          <textarea
            placeholder={placeholder}
            className={classNames(
              hasError ? "input-error border" : "input-default border-0",
              "block w-full rounded-md py-2.5 outline-none placeholder:text-xs placeholder:font-light focus:ring-1 focus:ring-inset sm:text-sm sm:leading-6",
            )}
          />
        )}
      </div>
    </div>
  );
};

TextArea.displayName = "TextArea";

export default TextArea;
