import React from "react";
import { HiOutlinePlus } from "react-icons-all-files/hi/HiOutlinePlus";
import { MdOutlineDelete } from "react-icons-all-files/md/MdOutlineDelete";
import { MdReceipt } from "react-icons-all-files/md/MdReceipt";
import CollapseHeightAnimation from "~/app/components/animation/CollapseHeight";
import { Button } from "~/app/components/core/Button";
import { useAppDispatch, useAppSelector } from "~/app/hook";
import { SCHEDULED } from "~/constants/request-types";
import { useAllExpenseTypesQuery } from "~/features/reimbursement-api-slice";
import {
  setActiveParticularIndex,
  setActiveParticularStep,
  setActiveStep,
  setReimbursementFormValues,
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
  const { activeStep, activeParticularStep, reimbursementFormValues } =
    useAppSelector((state) => state.reimbursementForm);
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

  const handleDelete = (i: number) => {
    const particularsCopy = [...reimbursementFormValues.particulars];

    particularsCopy.splice(i, 1);

    dispatch(
      setReimbursementFormValues({
        ...reimbursementFormValues,
        particulars: particularsCopy,
      }),
    );
  };

  const handleNext = () => {
    if (reimbursementFormValues.reimbursement_request_type_id === SCHEDULED) {
      //submit form
    } else {
      dispatch(setActiveStep(activeStep + 1));
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {activeParticularStep === "particular-list" &&
        reimbursementFormValues.particulars &&
        reimbursementFormValues.particulars.length > 0 && (
          <div className="pt-2 text-neutral-800">
            Total:{" "}
            {currencyFormat(
              +arraySum(
                reimbursementFormValues.particulars,
                "details",
                "amount",
              ),
            )}
          </div>
        )}

      <div className="my-2 h-px bg-neutral-300" />

      {activeParticularStep === "particular-list" &&
        reimbursementFormValues.particulars.length > 0 &&
        reimbursementFormValues.particulars.map((part, i) => (
          <div
            key={part.details.particular}
            className="flex w-full items-center justify-between rounded border p-3"
            // onClick={() => window.open(attachment)}
          >
            <div className="flex w-10/12 items-center gap-3">
              <MdReceipt className="h-4 w-4 text-neutral-800" />
              <Button
                buttonType="text"
                variant="primary"
                onClick={() => {
                  dispatch(setActiveParticularIndex(i.toString()));
                  dispatch(setActiveParticularStep("details"));
                }}
              >
                <span className="truncate text-sm">
                  {allExpenseTypesIsLoading
                    ? "..."
                    : `${allExpenseTypes?.find(
                        (a) =>
                          a.expense_type_id === part.details.expense_type_id,
                      )?.expense_type}-${part.details.particular}`}
                </span>
              </Button>
            </div>

            <Button buttonType="text" variant="danger">
              <MdOutlineDelete
                className="h-5 w-5"
                onClick={() => handleDelete(i)}
              />
            </Button>
          </div>
        ))}

      {activeParticularStep === "particular-list" && (
        <Button
          type="button"
          buttonType="text"
          onClick={() => {
            dispatch(setActiveParticularStep("details"));
            dispatch(
              setActiveParticularIndex(
                reimbursementFormValues.particulars.length.toString(),
              ),
            );
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
      )}

      <CollapseHeightAnimation
        isVisible={activeParticularStep !== "particular-list"}
      >
        <ParticularForm />
      </CollapseHeightAnimation>

      {activeParticularStep === "particular-list" && (
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
      )}
    </div>
  );
};

export default AddParticulars;
