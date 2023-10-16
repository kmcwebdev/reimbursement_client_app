import React, { useMemo, useState } from "react";
import { useFieldArray, type UseFormReturn } from "react-hook-form";
import { type IconType } from "react-icons-all-files";
import { AiOutlineMinusCircle } from "react-icons-all-files/ai/AiOutlineMinusCircle";
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
import { EXPENSE_TYPE_OTHERS } from "~/constants/other-expense";
import { UNSCHEDULED } from "~/constants/request-types";
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
import StepperDots from "./StepperDots";

interface ReimbursementDetailsFormProps {
  formReturn: UseFormReturn<ReimbursementDetailsDTO>;
  handleOpenCancelDialog: () => void;
}

const ReimbursementDetailsForm: React.FC<ReimbursementDetailsFormProps> = ({
  formReturn,
  handleOpenCancelDialog,
}) => {


  const { user } = useAppSelector((state) => state.session);

  const { activeStep, reimbursementDetails } = useAppSelector(
    (state) => state.reimbursementForm,
  );
  const dispatch = useAppDispatch();
  
  const [ sameEmail, setSameEmail ] = useState<boolean>(false);
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
    control: formReturn.control,
    name: "approvers",
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
  }

  const handleChangeEmail = (e: string) => {
    if( e === user?.email ) {
      setSameEmail(true);
    } else {
      setSameEmail(false);
    }
  }

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
          className="pb-4"
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
          type="number"
          label="Total"
          name="amount"
          placeholder="Total"
          required
          step={0.01}
        />
      </CollapseHeightAnimation>

      <CollapseHeightAnimation isVisible={selectedType === UNSCHEDULED}>
        <label className="text-xs font-bold text-neutral-900">Approvers</label>

        {fields.map((item, i) => (
          <div key={item.id} className="relative my-4 flex flex-col gap-4">
            <Input
              icon={MdMail as IconType}
              name={`approvers.${i}.email`}
              placeholder="Add an Approver"
              onChange={(e) => handleChangeEmail(e.target.value)}
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

      <CollapseHeightAnimation isVisible={!!selectedType}>
        <StepperDots currentStep={1} />
      </CollapseHeightAnimation>

      <div className="grid grid-cols-2 items-center gap-4">
        <div>
          <Button
            type="button"
            buttonType="outlined"
            variant="neutral"
            className="w-full"
            onClick={handleOpenCancelDialog}
          >
            Cancel
          </Button>
        </div>

        <Button type="submit" className="w-full" disabled={sameEmail}>
          Continue
        </Button>
      </div>
    </Form>
  );
};

export default ReimbursementDetailsForm;
