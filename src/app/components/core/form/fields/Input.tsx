import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { type IconType } from "react-icons-all-files";
import { IoMdEye } from "react-icons-all-files/io/IoMdEye";
import { IoMdEyeOff } from "react-icons-all-files/io/IoMdEyeOff";
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

  const [inputType, setInputType] = useState<string>(type);
  const [hidePassword, setHidePassword] = useState<boolean>(true);

  const toggleHidePassword = () => {
    setHidePassword(!hidePassword);

    if (inputType === "password") {
      setInputType("text");
    } else {
      setInputType("password");
    }
  };

  return (
    <div className="space-y-2">
      {label && (
        <label htmlFor={name} className="text-xs font-bold text-neutral-900">
          {label} {required && <span className="text-orange-600">*</span>}
        </label>
      )}

      <div
        className={classNames(
          Icon || (type === "password" && "relative"),
          "rounded-md",
        )}
      >
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

        {type === "password" && (
          <div
            className="absolute inset-y-0 right-5 flex cursor-pointer items-center text-neutral-600 transition-all ease-in-out hover:text-orange-600"
            onClick={toggleHidePassword}
          >
            {inputType === "password" && <IoMdEye className="h-5 w-5" />}
            {inputType === "text" && <IoMdEyeOff className="h-5 w-5" />}
          </div>
        )}

        {formContext ? (
          <input
            {...formContext.register(name)}
            name={name}
            type={inputType}
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
            type={inputType}
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
