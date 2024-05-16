import React, { useMemo, useState } from "react";
import { type UseFormReturn } from "react-hook-form";
import { type PropsValue } from "react-select";
import CollapseHeightAnimation from "~/app/components/animation/CollapseHeight";
import { Button } from "~/app/components/core/Button";
import Form from "~/app/components/core/form";
import Input from "~/app/components/core/form/fields/Input";
import Select, {
  type OptionData,
} from "~/app/components/core/form/fields/Select";
import TextArea from "~/app/components/core/form/fields/TextArea";
import { useAppDispatch, useAppSelector } from "~/app/hook";
import { useExpenseTypesQuery } from "~/features/api/references-api-slice";
import {
  setActiveStep,
  setReimbursementFormValues,
} from "~/features/state/reimbursement-form-slice";
import { type ParticularDetails } from "~/types/reimbursement.types";

interface ParticularDetailsStepProps {
  formReturn: UseFormReturn<ParticularDetails>;
}

const ParticularDetailsStep: React.FC<ParticularDetailsStepProps> = ({
  formReturn,
}) => {
  const dispatch = useAppDispatch();
  const { reimbursementFormValues, activeStep } = useAppSelector(
    (state) => state.reimbursementForm,
  );
  const [selectedExpense, setSelectedExpense] = useState<number>();
  const { isFetching: expenseTypesIsLoading, currentData: expenseTypes } =
    useExpenseTypesQuery({
      request_type: reimbursementFormValues.request_type!,
    });

  const handleExpenseTypeChange = (e: PropsValue<OptionData>) => {
    const selected = e as OptionData;
    setSelectedExpense(+selected.value);
  };

  useMemo(() => {
    if (reimbursementFormValues.particulars.length > 0) {
      formReturn.setValue(
        "expense_type",
        reimbursementFormValues.particulars[0].expense_type,
      );

      setSelectedExpense(reimbursementFormValues.particulars[0].expense_type);

      if (reimbursementFormValues.particulars[0].remarks) {
        formReturn.setValue(
          "remarks",
          reimbursementFormValues.particulars[0].remarks,
        );
      }

      formReturn.setValue(
        "justification",
        reimbursementFormValues.particulars[0].justification,
      );

      formReturn.setValue(
        "amount",
        reimbursementFormValues.particulars[0].amount,
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reimbursementFormValues]);

  const handleSubmit = (e: ParticularDetails) => {
    dispatch(
      setReimbursementFormValues({
        ...reimbursementFormValues,
        particulars: [e],
      }),
    );
    dispatch(setActiveStep(activeStep + 1));
  };

  return (
    <Form
      name="particular-form"
      useFormReturn={formReturn}
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 pt-4"
    >
      <Select
        label="Expense"
        name="expense_type"
        placeholder="Select Expense Type"
        required
        onChangeEvent={handleExpenseTypeChange}
        isLoading={expenseTypesIsLoading}
        options={
          expenseTypes?.results.map((item) => ({
            label: item.name,
            value: item.id,
          })) || []
        }
      />
      <CollapseHeightAnimation
        isVisible={selectedExpense === 13}
        className="pb-4"
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
        label="Amount to be Reimbursed"
        name="amount"
        placeholder="Indicate the amount eligible for reimbursement"
        required
        step={0.01}
      />

      <TextArea
        name="justification"
        label="Justification"
        placeholder="Describe the purpose of the expense"
        required
      />

      <div className="flex justify-end pt-4">
        <div className="flex w-1/2 items-center justify-center gap-2">
          <div>
            <Button
              aria-label="Return"
              type="button"
              buttonType="outlined"
              variant="neutral"
              className="w-full"
              onClick={() => {
                dispatch(setActiveStep(activeStep - 1));
              }}
            >
              Return
            </Button>
          </div>

          <Button aria-label="Submit" type="submit" className="w-full">
            Continue
          </Button>
        </div>
      </div>
    </Form>
  );
};

export default ParticularDetailsStep;
