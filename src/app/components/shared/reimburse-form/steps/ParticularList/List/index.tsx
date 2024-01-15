import React from "react";
import { HiOutlinePlus } from "react-icons-all-files/hi/HiOutlinePlus";
import { Button } from "~/app/components/core/Button";
import { useAppDispatch, useAppSelector } from "~/app/hook";
import { useAllExpenseTypesQuery } from "~/features/api/references-api-slice";
import {
  setActiveStep,
  setParticularDetailsFormIsVisible,
} from "~/features/state/reimbursement-form-slice";
import { arraySum } from "~/utils/array-sum";
import Particular from "./Particular";
import Total from "./Total";

interface ParticularsProps {
  handleOpenCancelDialog: () => void;
}

const Particulars: React.FC<ParticularsProps> = ({
  handleOpenCancelDialog,
}) => {
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

  const handleNext = () => {
    dispatch(setActiveStep(activeStep + 1));
  };

  return (
    <div className="flex flex-col gap-4">
      {reimbursementFormValues.particulars &&
        reimbursementFormValues.particulars.length > 0 && (
          <Total
            value={+arraySum(reimbursementFormValues.particulars, "amount")}
          />
        )}

      <div className="my-2 h-px bg-neutral-300" />

      {reimbursementFormValues.particulars.length > 0 &&
        reimbursementFormValues.particulars.map((part, i) => (
          <Particular
            key={`${part.name}-${i}`}
            index={i}
            label={
              allExpenseTypesIsLoading
                ? "..."
                : `${allExpenseTypes?.results.find(
                    (a) => a.id === part.expense_type,
                  )?.name}-${part.name}`
            }
          />
        ))}

      <Button
        type="button"
        buttonType="text"
        onClick={() => {
          dispatch(setParticularDetailsFormIsVisible(true));
        }}
      >
        <span className="group flex gap-1">
          <HiOutlinePlus className="h-5 w-5" />
          <p className="text-neutral-900 group-hover:text-neutral-800">
            Add{" "}
            {reimbursementFormValues.particulars &&
              reimbursementFormValues.particulars.length > 0 &&
              "Another "}
            Particular
          </p>
        </span>
      </Button>

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
            onClick={handleNext}
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Particulars;
