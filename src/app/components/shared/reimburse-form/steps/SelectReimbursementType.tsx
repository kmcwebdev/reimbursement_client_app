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
import { useRequestTypesQuery } from "~/features/reimbursement-api-slice";
import {
  setActiveStep,
  setReimbursementFormValues,
} from "~/features/reimbursement-form-slice";
import { type CreateReimbursementDTO } from "~/types/reimbursement.types";

interface SelectReimbursementTypeProps {
  formReturn: UseFormReturn<Partial<CreateReimbursementDTO>>;
  handleOpenCancelDialog: () => void;
}

const SelectReimbursementType: React.FC<SelectReimbursementTypeProps> = ({
  formReturn,
  handleOpenCancelDialog,
}) => {
  // const { user } = useAppSelector((state) => state.session);

  const { activeStep, reimbursementFormValues } = useAppSelector(
    (state) => state.reimbursementForm,
  );
  const dispatch = useAppDispatch();

  const [selectedReimbursementType, setSelectedReimbursementType] =
    useState<string>();
  const { isLoading: requestTypesIsLoading, data: requestTypes } =
    useRequestTypesQuery();

  const onSubmit = (e: CreateReimbursementDTO) => {
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
        name="reimbursement_request_type_id"
        required
        handleChange={handleTypeChange}
        loading={requestTypesIsLoading}
        options={
          requestTypes?.map((item) => ({
            label: item.request_type,
            value: item.reimbursement_request_type_id,
            icon:
              item.request_type === "Scheduled"
                ? (IoMdTimer as IconType)
                : (MdAccessTime as IconType),
          })) ?? []
        }
      />

      <div className="flex justify-end pt-4">
        <div className="flex w-1/2 items-center justify-center gap-2">
          <Button
            type="button"
            buttonType="outlined"
            variant="neutral"
            className="w-full"
            onClick={handleOpenCancelDialog}
          >
            Cancel
          </Button>

          <Button
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
