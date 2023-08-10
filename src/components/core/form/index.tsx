/* eslint-disable @typescript-eslint/no-explicit-any */
import type { UseFormReturn } from "react-hook-form";
import { FormProvider } from "react-hook-form";

interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  name: string;
  onSubmit: (data: any) => void;
  children?: React.ReactNode;
  useFormReturn: UseFormReturn<any, object>;
}

const Form: React.FC<FormProps> = ({
  children,
  className,
  useFormReturn,
  onSubmit,
  name,
}) => {
  return (
    <FormProvider {...useFormReturn}>
      <form
        name={name}
        className={className}
        onSubmit={(event) => {
          event.preventDefault();
          void useFormReturn.handleSubmit(onSubmit)(event);
        }}
      >
        {children}
      </form>
    </FormProvider>
  );
};

export default Form;
