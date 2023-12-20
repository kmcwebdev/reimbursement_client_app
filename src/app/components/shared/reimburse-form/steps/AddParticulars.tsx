import React, { useState } from "react";
import { FaArrowRight } from "react-icons-all-files/fa/FaArrowRight";
import { HiOutlinePlus } from "react-icons-all-files/hi/HiOutlinePlus";
import { MdReceipt } from "react-icons-all-files/md/MdReceipt";
import CollapseHeightAnimation from "~/app/components/animation/CollapseHeight";
import { Button } from "~/app/components/core/Button";
import { useAppDispatch, useAppSelector } from "~/app/hook";
import { useAllExpenseTypesQuery } from "~/features/reimbursement-api-slice";
import {
  setActiveStep,
  setSelectedParticularIndex,
} from "~/features/reimbursement-form-slice";
import { arraySum } from "~/utils/array-sum";
import { currencyFormat } from "~/utils/currencyFormat";
import ParticularForm from "./ParticularForm";

interface AddParticularsProps {
  handleOpenCancelDialog: () => void;
}

const AddParticulars: React.FC<AddParticularsProps> = ({
  handleOpenCancelDialog,
}) => {
  const [particularFormIsActive, setParticularFormIsActive] =
    useState<boolean>(false);

  const { activeStep, reimbursementFormValues } = useAppSelector(
    (state) => state.reimbursementForm,
  );
  const dispatch = useAppDispatch();

  const { data: allExpenseTypes, isLoading: allExpenseTypesIsLoading } =
    useAllExpenseTypesQuery({});

  // console.log(reimbursementFormValues.particulars[selectedParticularIndex]);

  //Initially display the particular form if first entry
  // useMemo(() => {
  //   if (
  //     (reimbursementFormValues && !reimbursementFormValues.particulars) ||
  //     (reimbursementFormValues.particulars &&
  //       reimbursementFormValues.particulars?.length === 0)
  //   ) {
  //     setParticularFormIsActive(true);
  //   }
  // }, [reimbursementFormValues]);

  return (
    <div className="flex flex-col gap-4">
      {!particularFormIsActive &&
        reimbursementFormValues.particulars &&
        reimbursementFormValues.particulars.length > 0 && (
          <div className="pt-2 text-neutral-800">
            Total:{" "}
            {currencyFormat(
              +arraySum(reimbursementFormValues.particulars, "amount"),
            )}
          </div>
        )}

      <div className="my-2 h-px bg-neutral-300" />

      {!particularFormIsActive &&
        reimbursementFormValues.particulars &&
        reimbursementFormValues.particulars.length > 0 &&
        reimbursementFormValues.particulars.map((part, i) => (
          <div
            key={part.particular}
            className="flex w-full cursor-pointer items-center justify-between rounded border p-3"
            // onClick={() => window.open(attachment)}
          >
            <div className="flex w-10/12 items-center gap-3">
              <MdReceipt className="h-4 w-4 text-neutral-800" />
              <span className="truncate text-sm text-neutral-900">
                {allExpenseTypesIsLoading
                  ? "..."
                  : `${allExpenseTypes?.find(
                      (a) => a.expense_type_id === part.expense_type_id,
                    )?.expense_type}-${part.particular}`}
              </span>
            </div>

            <Button
              buttonType="text"
              onClick={() => {
                dispatch(setSelectedParticularIndex(i));
                setParticularFormIsActive(true);
              }}
            >
              <FaArrowRight className="h-3 w-3 " />
            </Button>
          </div>
        ))}

      {!particularFormIsActive && (
        <Button
          type="button"
          buttonType="text"
          onClick={() => setParticularFormIsActive(!particularFormIsActive)}
        >
          <span className="group flex gap-1">
            <HiOutlinePlus className="h-5 w-5" />
            <p className="text-neutral-900 group-hover:text-neutral-800">
              Add{" "}
              {!particularFormIsActive &&
                reimbursementFormValues.particulars &&
                reimbursementFormValues.particulars.length > 0 &&
                "Another "}
              Particular
            </p>
          </span>
        </Button>
      )}

      <CollapseHeightAnimation isVisible={particularFormIsActive}>
        <ParticularForm setParticularFormIsActive={setParticularFormIsActive} />
      </CollapseHeightAnimation>

      {!particularFormIsActive && (
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
              type="button"
              className="w-full"
              disabled={
                reimbursementFormValues &&
                (!reimbursementFormValues.particulars ||
                  (reimbursementFormValues.particulars &&
                    reimbursementFormValues.particulars.length === 0))
              }
              onClick={() => {
                dispatch(setActiveStep(activeStep + 1));
              }}
            >
              Continue
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddParticulars;
