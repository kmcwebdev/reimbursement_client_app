import React, { useState } from "react";
import { type UseFormReturn } from "react-hook-form";
import { type IconType } from "react-icons-all-files";
import { IoMdTimer } from "react-icons-all-files/io/IoMdTimer";
import { MdAccessTime } from "react-icons-all-files/md/MdAccessTime";

import { Button } from "~/app/components/core/Button";
import Form from "~/app/components/core/form";
import CardSelection, {
  type CardSelectionOption,
} from "~/app/components/core/form/fields/CardSelection";
import { useAppDispatch, useAppSelector } from "~/app/hook";
import { useRequestTypesQuery } from "~/features/api/references-api-slice";
import {
  setActiveStep,
  setReimbursementFormValues,
} from "~/features/state/reimbursement-form-slice";
import { type ReimbursementFormType } from "~/schema/reimbursement-type.schema";
import { type ReimbursementFormValues } from "~/types/reimbursement-form-values.type";

interface SelectReimbursementTypeProps {
  formReturn: UseFormReturn<ReimbursementFormType>;
  handleOpenCancelDialog: () => void;
}

const SelectReimbursementType: React.FC<SelectReimbursementTypeProps> = ({
  formReturn,
  handleOpenCancelDialog,
}) => {
  const { activeStep, reimbursementFormValues } = useAppSelector(
    (state) => state.reimbursementForm,
  );
  const dispatch = useAppDispatch();

  const [selectedReimbursementType, setSelectedReimbursementType] =
    useState<string>();
  const { isLoading: requestTypesIsLoading, data: requestTypes } =
    useRequestTypesQuery();

  const onSubmit = (e: ReimbursementFormValues) => {
    const values = {
      ...reimbursementFormValues,
      ...e,
    };
    dispatch(setReimbursementFormValues(values));
    dispatch(setActiveStep(activeStep + 1));
  };

  const handleTypeChange = (e: CardSelectionOption) => {
    setSelectedReimbursementType(e.value);
  };

  return (
    <Form
      name="new-reimbursement-form"
      className="flex flex-col gap-4"
      onSubmit={onSubmit}
      useFormReturn={formReturn}
    >
      <CardSelection
        label=""
        name="request_type"
        required
        handleChange={handleTypeChange}
        loading={requestTypesIsLoading}
        options={
          requestTypes?.results.map((item) => ({
            label: item.name,
            value: item.id.toString(),
            icon:
              item.id === 0
                ? (IoMdTimer as IconType)
                : (MdAccessTime as IconType),
          })) ?? []
        }
      />

      <div className="flex justify-end pt-4">
        <div className="flex w-1/2 items-center justify-center gap-2">
          <Button
            aria-label="Cancel"
            type="button"
            buttonType="outlined"
            variant="neutral"
            className="w-full"
            onClick={handleOpenCancelDialog}
          >
            Cancel
          </Button>

          <Button
            aria-label="Continue"
            type="submit"
            className="w-full"
            disabled={!selectedReimbursementType}
          >
            Continue
          </Button>
        </div>
      </div>
    </Form>
  );
};

export default SelectReimbursementType;
