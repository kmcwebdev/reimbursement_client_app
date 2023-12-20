import { zodResolver } from "@hookform/resolvers/zod";
import React, { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
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
  setReimbursementFormValues,
  setSelectedParticularIndex,
} from "~/features/reimbursement-form-slice";
import {
  ReimbursementParticularsSchema,
  type ReimbursementParticulars,
} from "~/schema/reimbursement-particulars.schema";

interface ParticularFormProps {
  setParticularFormIsActive: (e: boolean) => void;
}

const ParticularForm: React.FC<ParticularFormProps> = ({
  setParticularFormIsActive,
}) => {
  const { reimbursementFormValues, selectedParticularIndex } = useAppSelector(
    (state) => state.reimbursementForm,
  );
  const [selectedExpense, setSelectedExpense] = useState<string>();
  const dispatch = useAppDispatch();

  const { isFetching: expenseTypesIsLoading, currentData: expenseTypes } =
    useExpenseTypesQuery({
      request_type_id: reimbursementFormValues.reimbursement_request_type_id!,
    });

  const useReimbursementParticularsFormReturn =
    useForm<ReimbursementParticulars>({
      resolver: zodResolver(ReimbursementParticularsSchema),
      mode: "onChange",
      defaultValues: useMemo(() => {
        if (
          selectedParticularIndex !== null &&
          reimbursementFormValues &&
          reimbursementFormValues.particulars &&
          reimbursementFormValues.particulars.length > 0
        ) {
          return {
            ...reimbursementFormValues.particulars[selectedParticularIndex],
          };
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [selectedParticularIndex]),
    });

  const handleExpenseTypeChange = (e: PropsValue<OptionData>) => {
    const selected = e as OptionData;
    setSelectedExpense(selected.value);
  };

  useMemo(() => {
    if (
      selectedParticularIndex !== null &&
      reimbursementFormValues.particulars &&
      reimbursementFormValues.particulars.length > 0 &&
      reimbursementFormValues.particulars[selectedParticularIndex]
    ) {
      setSelectedExpense(
        reimbursementFormValues.particulars[selectedParticularIndex]
          .expense_type_id,
      );
    }
  }, [reimbursementFormValues, selectedParticularIndex]);

  const onSubmit = (e: ReimbursementParticulars) => {
    let particularsCopy = reimbursementFormValues.particulars;

    if (selectedParticularIndex === null) {
      if (particularsCopy && particularsCopy.length > 0) {
        particularsCopy = [...particularsCopy, e];
      } else {
        particularsCopy = [e];
      }
    }

    if (selectedParticularIndex !== null) {
      if (particularsCopy && particularsCopy.length > 0) {
        const parts = [...particularsCopy];
        parts[selectedParticularIndex] = e;
        particularsCopy = parts;
      }
    }

    dispatch(
      setReimbursementFormValues({
        ...reimbursementFormValues,
        particulars: particularsCopy,
      }),
    );
    dispatch(setSelectedParticularIndex(null));
    setParticularFormIsActive(false);
    useReimbursementParticularsFormReturn.reset();
  };

  return (
    <Form
      name="particular-form"
      useFormReturn={useReimbursementParticularsFormReturn}
      onSubmit={onSubmit}
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
              useReimbursementParticularsFormReturn.reset();
              setParticularFormIsActive(false);
            }}
          >
            Cancel
          </Button>
        </div>

        <Button type="submit" className="w-full">
          {selectedParticularIndex !== null ? "Update" : "Add"}
        </Button>
      </div>
    </Form>
  );
};

export default ParticularForm;
