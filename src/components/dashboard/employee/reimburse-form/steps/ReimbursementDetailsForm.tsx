import React, { useMemo, useState } from "react";
import { useFieldArray, type UseFormReturn } from "react-hook-form";
import { type IconType } from "react-icons-all-files";
import { AiOutlineMinusCircle } from "react-icons-all-files/ai/AiOutlineMinusCircle";
import { AiOutlinePlus } from "react-icons-all-files/ai/AiOutlinePlus";
import { MdAccessTime } from "react-icons-all-files/md/MdAccessTime";
import { MdMail } from "react-icons-all-files/md/MdMail";
import { type PropsValue } from "react-select";
import { useAppDispatch, useAppSelector } from "~/app/hook";
import CollapseHeightAnimation from "~/components/animation/CollapseHeight";
import { Button } from "~/components/core/Button";
import Form from "~/components/core/form";
import CardSelection, {
  type CardSelectionOption,
} from "~/components/core/form/fields/CardSelection";
import Input from "~/components/core/form/fields/Input";
import Select, { type OptionData } from "~/components/core/form/fields/Select";
import { useRequestTypesQuery } from "~/features/reimbursement-api-slice";
import {
  setActiveStep,
  setReimbursementDetails,
} from "~/features/reimbursement-form-slice";
import { type ReimbursementDetailsDTO } from "~/types/reimbursement.types";

interface ReimbursementDetailsFormProps {
  formReturn: UseFormReturn<ReimbursementDetailsDTO>;
}

const ReimbursementDetailsForm: React.FC<ReimbursementDetailsFormProps> = ({
  formReturn,
}) => {
  const { activeStep, reimbursementDetails } = useAppSelector(
    (state) => state.reimbursementForm,
  );
  const dispatch = useAppDispatch();

  const [selectedType, setSelectedType] = useState<number>();
  const [selectedExpense, setSelectedExpense] = useState<string>();
  const { isLoading, data } = useRequestTypesQuery();

  useMemo(() => {
    if (reimbursementDetails) {
      setSelectedType(reimbursementDetails.type);
      setSelectedExpense(reimbursementDetails.expense);
    }
  }, [reimbursementDetails]);

  const { fields, append, remove } = useFieldArray({
    control: formReturn.control, // control props comes from useForm (optional: if you are using FormContext)
    name: "approvers", // unique name for your Field Array
  });

  const onSubmit = (e: ReimbursementDetailsDTO) => {
    dispatch(setReimbursementDetails(e));
    dispatch(setActiveStep(activeStep + 1));
  };

  const handleTypeChange = (e: CardSelectionOption) => {
    setSelectedType(+e.value);

    if (e.value === 1) {
      append({ email: "" });
    } else {
      formReturn.setValue("approvers", []);
    }
  };

  const handleExpenseTypeChange = (e: PropsValue<OptionData>) => {
    const selected = e as OptionData;
    setSelectedExpense(selected.value);
  };

  return (
    <Form
      name="new-reimbursement-form"
      className="flex flex-col gap-4"
      onSubmit={onSubmit}
      useFormReturn={formReturn}
    >
      <CardSelection
        label="Type"
        name="type"
        required
        handleChange={handleTypeChange}
        loading={isLoading}
        options={
          data?.map((item) => ({
            label: item.request_type,
            value: item.reimbursement_request_type_id,
            icon:
              item.request_type === "Scheduled"
                ? (MdAccessTime as IconType)
                : (MdAccessTime as IconType),
          })) ?? []
        }
      />

      <Select
        label="Expense"
        name="expense"
        placeholder="Type of expense"
        required
        onChangeEvent={handleExpenseTypeChange}
        options={[
          { label: "Meal", value: "Meal" },
          { label: "Others", value: "others" },
        ]}
      />

      <CollapseHeightAnimation
        isVisible={selectedExpense === "others" ? true : false}
      >
        <Input
          name="remarks"
          label="Remarks"
          placeholder="Remarks for others"
          required
        />
      </CollapseHeightAnimation>

      <Input
        type="number"
        label="Total"
        name="total"
        placeholder="Total"
        required
        step={0.01}
      />

      <CollapseHeightAnimation isVisible={selectedType === 1 ? true : false}>
        <label className="text-xs font-semibold text-neutral-800">
          Approvers
        </label>

        {fields.map((item, i) => (
          <div key={item.id} className="relative my-4 flex flex-col gap-4">
            <Input
              icon={MdMail as IconType}
              name={`approvers.${i}.email`}
              placeholder="Add an Approver"
              hasErrors={
                formReturn.formState.errors.approvers &&
                formReturn.formState.errors.approvers[i]?.email?.message
                  ? true
                  : false
              }
              error={
                formReturn.formState.errors.approvers &&
                formReturn.formState.errors.approvers[i]?.email?.message
              }
            />

            {fields.length > 1 && (
              <AiOutlineMinusCircle
                className="absolute right-2 top-3 h-4 w-4 cursor-pointer text-danger-default transition-all ease-in-out hover:text-danger-hover"
                onClick={() => remove(i)}
              />
            )}
          </div>
        ))}

        <Button buttonType="text" onClick={() => append({ email: "" })}>
          <div className="flex items-center gap-2">
            <AiOutlinePlus className="h-5 w-5" />
            Add Another
          </div>
        </Button>
      </CollapseHeightAnimation>

      <div className="my-4 flex items-center justify-center gap-2">
        <div className="h-2 w-2 rounded-full bg-primary-default"></div>
        <div className="h-2 w-2 rounded-full bg-primary-inactive"></div>
      </div>

      <div className="grid grid-cols-2 items-center gap-4">
        <Button
          type="button"
          buttonType="outlined"
          variant="neutral"
          className="w-full"
        >
          Cancel
        </Button>
        <Button type="submit" className="w-full">
          Continue
        </Button>
      </div>
    </Form>
  );
};

export default ReimbursementDetailsForm;
