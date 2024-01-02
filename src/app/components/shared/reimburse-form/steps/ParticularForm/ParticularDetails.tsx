import React, { useMemo, useState } from "react";
import { UseFormReturn } from "react-hook-form";
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
import { EXPENSE_TYPE_OTHERS } from "~/constants/other-expense";
import { useExpenseTypesQuery } from "~/features/reimbursement-api-slice";
import {
  setActiveParticularStep,
  setReimbursementFormValues,
} from "~/features/reimbursement-form-slice";
import { type ReimbursementParticularDetails } from "~/schema/reimbursement-particulars.schema";

interface ParticularDetailsProps {
  formReturn: UseFormReturn<ReimbursementParticularDetails>;
}

const ParticularDetails: React.FC<ParticularDetailsProps> = ({
  formReturn,
}) => {
  const dispatch = useAppDispatch();
  const { reimbursementFormValues, activeParticularIndex } = useAppSelector(
    (state) => state.reimbursementForm,
  );
  const [selectedExpense, setSelectedExpense] = useState<string>();
  const { isFetching: expenseTypesIsLoading, currentData: expenseTypes } =
    useExpenseTypesQuery({
      request_type_id: reimbursementFormValues.reimbursement_request_type_id!,
    });

  const handleExpenseTypeChange = (e: PropsValue<OptionData>) => {
    const selected = e as OptionData;
    setSelectedExpense(selected.value);
  };

  useMemo(() => {
    if (
      activeParticularIndex &&
      reimbursementFormValues.particulars.length > 0 &&
      reimbursementFormValues.particulars[+activeParticularIndex]
    ) {
      setSelectedExpense(
        reimbursementFormValues.particulars[+activeParticularIndex].details
          .expense_type_id,
      );
    }
  }, [reimbursementFormValues, activeParticularIndex]);

  const handleSubmit = (e: ReimbursementParticularDetails) => {
    let particularsCopy = reimbursementFormValues.particulars;

    if (
      activeParticularIndex &&
      !reimbursementFormValues.particulars[+activeParticularIndex]
    ) {
      if (particularsCopy && particularsCopy.length > 0) {
        particularsCopy = [...particularsCopy, { details: e }];
      } else {
        particularsCopy = [{ details: e }];
      }
    }

    if (
      activeParticularIndex &&
      reimbursementFormValues.particulars[+activeParticularIndex]
    ) {
      if (particularsCopy && particularsCopy.length > 0) {
        const parts = [...particularsCopy];
        parts[+activeParticularIndex] = {
          ...parts[+activeParticularIndex],
          details: e,
        };
        particularsCopy = parts;
      }
    }

    dispatch(
      setReimbursementFormValues({
        ...reimbursementFormValues,
        particulars: particularsCopy,
      }),
    );
    dispatch(setActiveParticularStep("method-selection"));
  };

  return (
    <Form
      name="particular-form"
      useFormReturn={formReturn}
      onSubmit={handleSubmit}
      className="flex flex-col gap-4"
    >
      <Select
        label="Expense"
        name="expense_type_id"
        placeholder="Type of expense"
        required
        onChangeEvent={handleExpenseTypeChange}
        isLoading={expenseTypesIsLoading}
        options={
          expenseTypes?.map((item) => ({
            label: item.expense_type,
            value: item.expense_type_id,
          })) || []
        }
      />
      <CollapseHeightAnimation
        isVisible={selectedExpense === EXPENSE_TYPE_OTHERS}
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
        name="particular"
        label="Particular"
        placeholder="Particular"
        required
      />
      <TextArea
        name="justification"
        label="Justification"
        placeholder="Justification for this receipt"
        required
      />
      <Input
        type="number"
        label="Amount"
        name="amount"
        placeholder="Amount"
        required
        step={0.01}
      />
      <div className="grid grid-cols-2 items-center gap-2">
        <div>
          <Button
            type="button"
            buttonType="outlined"
            variant="neutral"
            className="w-full"
            onClick={() => {
              formReturn.reset();
              dispatch(setActiveParticularStep("particular-list"));
            }}
          >
            Cancel
          </Button>
        </div>

        <Button type="submit" className="w-full">
          {activeParticularIndex &&
          reimbursementFormValues.particulars[+activeParticularIndex]
            ? "Update"
            : "Add"}
        </Button>
      </div>
    </Form>
  );
};

export default ParticularDetails;
