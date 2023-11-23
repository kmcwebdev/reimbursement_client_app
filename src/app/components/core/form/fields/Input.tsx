import { useFormContext } from "react-hook-form";
import { type IconType } from "react-icons-all-files";
import { RiLoader4Fill } from "react-icons-all-files/ri/RiLoader4Fill";
import { classNames } from "~/utils/classNames";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  name: string;
  icon?: IconType;
  className?: string;
  hasErrors?: boolean;
  error?: string;
  required?: boolean;
  loading?: boolean;
};

const Input = ({
  className,
  label,
  icon: Icon,
  type = "text",
  name,
  placeholder,
  hasErrors = false,
  error,
  required = false,
  loading = false,
  ...rest
}: InputProps) => {
  const formContext = useFormContext();

  return (
    <div className="space-y-2">
      {label && (
        <label htmlFor={name} className="text-xs font-bold text-neutral-900">
          {label} {required && <span className="text-orange-600">*</span>}
        </label>
      )}

      <div className={classNames(Icon && "relative", "rounded-md")}>
        {loading && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <RiLoader4Fill
              className="h-5 w-5 animate-spin text-orange-600"
              aria-hidden="true"
            />
          </div>
        )}

        {!loading && Icon && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Icon
              className={classNames(
                "h-5 w-5",
                hasErrors ||
                  (formContext && formContext.formState.errors[name]?.message)
                  ? "text-red-600"
                  : "text-neutral-600",
              )}
              aria-hidden="true"
            />
          </div>
        )}

        {formContext ? (
          <input
            {...formContext.register(name)}
            name={name}
            type={type}
            className={classNames(
              className,
              hasErrors || formContext.formState.errors[name]?.message
                ? "input-error"
                : "input-default",
              Icon && "pl-10",
            )}
            placeholder={
              placeholder && type !== "date" ? placeholder : undefined
            }
            {...rest}
          />
        ) : (
          <input
            type={type}
            className={classNames(
              className,
              hasErrors ? "input-error" : "input-default",
              Icon && "pl-10",
            )}
            placeholder={
              placeholder && type !== "date" ? placeholder : undefined
            }
            {...rest}
          />
        )}
      </div>
      {formContext &&
        formContext.formState.errors &&
        formContext.formState.errors[name] && (
          <p className="mt-1 text-sm text-red-600">
            {formContext.formState.errors[name]?.message as string}
          </p>
        )}

      {hasErrors && error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

Input.displayName = "Input";

export default Input;
