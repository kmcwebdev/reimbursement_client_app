import React, { useMemo, useState } from "react";
import { useFieldArray, type UseFormReturn } from "react-hook-form";
import { type IconType } from "react-icons-all-files";
import { AiOutlineMinusCircle } from "react-icons-all-files/ai/AiOutlineMinusCircle";
// import { AiOutlinePlus } from "react-icons-all-files/ai/AiOutlinePlus";
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
import {
  useExpenseTypesQuery,
  useRequestTypesQuery,
} from "~/features/reimbursement-api-slice";
import {
  setActiveStep,
  setReimbursementDetails,
} from "~/features/reimbursement-form-slice";
import { type ReimbursementDetailsType } from "~/schema/reimbursement-details.schema";
import { type ReimbursementDetailsDTO } from "~/types/reimbursement.types";

interface ReimbursementDetailsFormProps {
  formReturn: UseFormReturn<ReimbursementDetailsDTO>;
  handleOpenCancelDialog: () => void;
}

const UNSCHEDULED = "9850f2aa-40c4-4fd5-8708-c8edf734d83f";
const SCHEDULED = "83ad9a7a-3ff6-469f-a4e0-20c202ac6ba4";
const OTHER_EXPENSE = "1de6c849-39d9-421b-b0db-2fb3202cb7c6";

const ReimbursementDetailsForm: React.FC<ReimbursementDetailsFormProps> = ({
  formReturn,
  handleOpenCancelDialog,
}) => {
  const { activeStep, reimbursementDetails } = useAppSelector(
    (state) => state.reimbursementForm,
  );
  const dispatch = useAppDispatch();

  const [selectedType, setSelectedType] = useState<string>();
  const [selectedExpense, setSelectedExpense] = useState<string>();
  const { isLoading: requestTypesIsLoading, data: requestTypes } =
    useRequestTypesQuery();

  const { isFetching: expenseTypesIsLoading, currentData: expenseTypes } =
    useExpenseTypesQuery(
      { request_type_id: selectedType! },
      { skip: !selectedType },
    );

  useMemo(() => {
    if (reimbursementDetails) {
      setSelectedType(reimbursementDetails.reimbursement_request_type_id);
      setSelectedExpense(reimbursementDetails.expense_type_id);
    }
  }, [reimbursementDetails]);

  useMemo(() => {
    if (formReturn) {
      setSelectedType(formReturn.getValues("reimbursement_request_type_id"));
    }
  }, [formReturn]);

  const { fields, append, remove } = useFieldArray({
    control: formReturn.control, // control props comes from useForm (optional: if you are using FormContext)
    name: "approvers", // unique name for your Field Array
  });

  const onSubmit = (e: ReimbursementDetailsType) => {
    dispatch(setReimbursementDetails(e));
    dispatch(setActiveStep(activeStep + 1));
  };

  const handleTypeChange = (e: CardSelectionOption) => {
    setSelectedType(e.value);

    if (e.value === UNSCHEDULED) {
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
                ? (MdAccessTime as IconType)
                : (MdAccessTime as IconType),
          })) ?? []
        }
      />

      <CollapseHeightAnimation
        hideOverflow={!selectedType}
        isVisible={!!selectedType}
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
          isVisible={selectedExpense === OTHER_EXPENSE ? true : false}
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
          name="amount"
          placeholder="Total"
          required
          step={0.01}
        />
      </CollapseHeightAnimation>

      <CollapseHeightAnimation
        isVisible={selectedType === UNSCHEDULED ? true : false}
      >
        <label className="text-xs font-bold text-neutral-900">Approvers</label>

        {fields.map((item, i) => (
          <div key={item.id} className="relative my-4 flex flex-col gap-4">
            <Input
              icon={MdMail as IconType}
              name={`approvers.${i}.email`}
              placeholder="Add an Approver"
              hasErrors={
                formReturn.formState.errors.approvers &&
                (formReturn.formState.errors.approvers[i]?.email?.message ||
                  formReturn.formState.errors.approvers.message)
                  ? true
                  : false
              }
              error={
                formReturn.formState.errors.approvers &&
                (formReturn.formState.errors.approvers[i]?.email?.message ||
                  formReturn.formState.errors.approvers.message)
              }
            />

            {fields.length > 1 && (
              <AiOutlineMinusCircle
                className="absolute right-2 top-3 h-4 w-4 cursor-pointer text-red-600 transition-all ease-in-out hover:text-red-700"
                onClick={() => remove(i)}
              />
            )}
          </div>
        ))}

        {/* <Button buttonType="text" onClick={() => append({ email: "" })}>
          <div className="flex items-center gap-2">
            <AiOutlinePlus className="h-5 w-5" />
            Add Another
          </div>
        </Button> */}
      </CollapseHeightAnimation>

      <CollapseHeightAnimation
        isVisible={
          selectedType === UNSCHEDULED
            ? true
            : false || selectedType === SCHEDULED
            ? true
            : false
        }
      >
        <div className="my-4 flex items-center justify-center gap-2">
          <div className="h-2 w-2 rounded-full bg-orange-600"></div>
          <div className="h-2 w-2 rounded-full bg-orange-200"></div>
        </div>
      </CollapseHeightAnimation>

      <div className="grid grid-cols-2 items-center gap-4">
        <div>
          {/* <CollapseHeightAnimation
            isVisible={!!formReturn.getValues("reimbursement_request_type_id")}
          > */}
          <Button
            type="button"
            buttonType="outlined"
            variant="neutral"
            className="w-full"
            onClick={handleOpenCancelDialog}
          >
            Cancel
          </Button>
          {/* </CollapseHeightAnimation> */}
        </div>

        <Button type="submit" className="w-full">
          Continue
        </Button>
      </div>
    </Form>
  );
};

export default ReimbursementDetailsForm;
