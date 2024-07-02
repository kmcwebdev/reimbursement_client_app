import React, { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string | JSX.Element;
  name: string;
}

const Checkbox = ({
  label,
  name,
  checked,
  onChange,
  ...rest
}: CheckboxProps) => {
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const formContext = useFormContext();

  useEffect(() => {
    if (checked || (formContext && formContext.getValues(name))) {
      setIsChecked(true);
    } else {
      setIsChecked(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checked, formContext]);

  return (
    <fieldset>
      <legend className="sr-only">Checkbox</legend>
      <div>
        <div className="relative flex items-start">
          <div className="flex h-6 items-center">
            <label htmlFor={name} className="sr-only">
              Checkbox
            </label>
            {formContext && (
              <input
                {...formContext.register(name)}
                name={name}
                id={name}
                aria-describedby={name}
                type="checkbox"
                onChange={(e) => {
                  setIsChecked(e.target.checked);
                  onChange && onChange(e);
                }}
                checked={isChecked}
                className="h-4 w-4 rounded border-neutral-300 text-orange-600 transition-all ease-in-out focus:ring-0 focus:ring-transparent disabled:cursor-not-allowed disabled:text-neutral-300"
              />
            )}

            {!formContext && (
              <input
                id={name}
                name={name}
                aria-describedby={name}
                type="checkbox"
                onChange={(e) => {
                  setIsChecked(e.target.checked);
                  onChange && onChange(e);
                }}
                checked={isChecked}
                className="h-4 w-4 rounded border-neutral-300 text-orange-600 transition-all ease-in-out focus:ring-0 focus:ring-transparent disabled:cursor-not-allowed disabled:text-neutral-300"
                {...rest}
              />
            )}
          </div>
          <div className="ml-3">
            {label && (
              <label
                htmlFor={name}
                className="cursor-pointer truncate text-xs leading-6 text-neutral-900"
              >
                {label}
              </label>
            )}
          </div>
        </div>
      </div>
    </fieldset>
  );
};

Checkbox.displayName = "Checkbox";

export default Checkbox;
