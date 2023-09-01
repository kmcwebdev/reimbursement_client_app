import { useFormContext } from "react-hook-form";
import { type IconType } from "react-icons-all-files";
import { classNames } from "~/utils/classNames";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  name: string;
  icon?: IconType;
  className?: string;
  hasErrors?: boolean;
  error?: string;
  required?: boolean;
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
  ...rest
}: InputProps) => {
  const formContext = useFormContext();

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
                hasErrors ||
                  (formContext && formContext.formState.errors[name]?.message)
                  ? "text-red-400"
                  : "text-neutral-subtle",
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
          <p className="mt-1 text-sm text-danger-default">
            {formContext.formState.errors[name]?.message as string}
          </p>
        )}

      {hasErrors && error && (
        <p className="mt-1 text-sm text-danger-default">{error}</p>
      )}
    </div>
  );
};

Input.displayName = "Input";

export default Input;
