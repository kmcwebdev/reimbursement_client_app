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
  setActiveParticularIndex,
  setParticularDetailsFormIsVisible,
  setReimbursementFormValues,
} from "~/features/state/reimbursement-form-slice";
import { type ParticularDetails } from "~/schema/reimbursement-particulars.schema";

interface ParticularDetailsProps {
  formReturn: UseFormReturn<ParticularDetails>;
}

const ParticularDetailsForm: React.FC<ParticularDetailsProps> = ({
  formReturn,
}) => {
  const dispatch = useAppDispatch();
  const { reimbursementFormValues, activeParticularIndex } = useAppSelector(
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
    if (
      activeParticularIndex &&
      reimbursementFormValues.particulars.length > 0 &&
      reimbursementFormValues.particulars[+activeParticularIndex]
    ) {
      formReturn.setValue(
        "expense_type",
        reimbursementFormValues.particulars[+activeParticularIndex]
          .expense_type,
      );

      setSelectedExpense(
        reimbursementFormValues.particulars[+activeParticularIndex]
          .expense_type,
      );

      if (reimbursementFormValues.particulars[+activeParticularIndex].remarks) {
        formReturn.setValue(
          "remarks",
          reimbursementFormValues.particulars[+activeParticularIndex].remarks,
        );
      }

      formReturn.setValue(
        "name",
        reimbursementFormValues.particulars[+activeParticularIndex].name,
      );

      formReturn.setValue(
        "justification",
        reimbursementFormValues.particulars[+activeParticularIndex]
          .justification,
      );

      formReturn.setValue(
        "amount",
        reimbursementFormValues.particulars[+activeParticularIndex].amount,
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reimbursementFormValues, activeParticularIndex]);

  const handleSubmit = (e: ParticularDetails) => {
    const particulars = [...reimbursementFormValues.particulars];

    if (activeParticularIndex) {
      particulars[+activeParticularIndex] = e;
    } else {
      particulars.push(e);
    }

    dispatch(
      setReimbursementFormValues({
        ...reimbursementFormValues,
        particulars,
      }),
    );
    dispatch(setParticularDetailsFormIsVisible(false));
    dispatch(setActiveParticularIndex(null));
    formReturn.reset();
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
        placeholder="Type of expense"
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

      <Input name="name" label="Receipt" placeholder="Receipt" required />

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
      <div className="grid grid-cols-2 items-center gap-2 pt-4">
        <div>
          <Button
            aria-label="Return"
            type="button"
            buttonType="outlined"
            variant="neutral"
            className="w-full"
            onClick={() => {
              formReturn.reset();
              dispatch(setActiveParticularIndex(null));
              dispatch(setParticularDetailsFormIsVisible(false));
            }}
          >
            Return
          </Button>
        </div>

        <Button aria-label="Submit" type="submit" className="w-full">
          {activeParticularIndex &&
          reimbursementFormValues.particulars[+activeParticularIndex]
            ? "Update"
            : "Add"}
        </Button>
      </div>
    </Form>
  );
};

export default ParticularDetailsForm;
