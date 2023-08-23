import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState, type Dispatch, type SetStateAction } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { type IconType } from 'react-icons-all-files';
import { AiOutlineMinusCircle } from 'react-icons-all-files/ai/AiOutlineMinusCircle';
import { AiOutlinePlus } from 'react-icons-all-files/ai/AiOutlinePlus';
import { MdAccessTime } from 'react-icons-all-files/md/MdAccessTime';
import { MdMail } from 'react-icons-all-files/md/MdMail';
import { type PropsValue } from 'react-select';
import CollapseHeightAnimation from '~/components/animation/CollapseHeight';
import { Button } from '~/components/core/Button';
import Form from '~/components/core/form';
import CardSelection, { type CardSelectionOption } from '~/components/core/form/fields/CardSelection';
import Input from '~/components/core/form/fields/Input';
import Select, { type OptionData } from '~/components/core/form/fields/Select';
import { reimbursementDetailsSchema } from '~/schema/reimbursement-details.schema';
import { type ReimbursementDetailsDTO } from '~/types/reimbursement.types';

interface ReimbursementDetailsFormProps {
  activeStep: number;
  setActiveStep: Dispatch<SetStateAction<number>>
}

const ReimbursementDetailsForm: React.FC<ReimbursementDetailsFormProps> = ({ activeStep, setActiveStep }) => {

  const [selectedType, setSelectedType] = useState<number>();
  const [selectedExpense, setSelectedExpense] = useState<string>();

  const useFormReturn = useForm<ReimbursementDetailsDTO>({
    resolver: zodResolver(reimbursementDetailsSchema),
    mode: 'onChange',
  });

  const { fields, append, remove } = useFieldArray({
    control: useFormReturn.control, // control props comes from useForm (optional: if you are using FormContext)
    name: 'approvers', // unique name for your Field Array
  });

  const onSubmit = (e: ReimbursementDetailsDTO) => {
    console.log(e)
    setActiveStep(activeStep + 1);
  }

  const handleTypeChange = (e: CardSelectionOption) => {
    setSelectedType(+e.value);

    if (e.value === 1) {
      append({ email: "" });
    } else {
      useFormReturn.setValue('approvers', [])
    }
  }

  const handleExpenseTypeChange = (e: PropsValue<OptionData>) => {
    const selected = e as OptionData;
    setSelectedExpense(selected.value);
  }

  console.log("ERRORS", useFormReturn.formState.errors)

  return (
    <Form name='new-reimbursement-form' className='flex flex-col gap-4' onSubmit={onSubmit} useFormReturn={useFormReturn}>

      <CardSelection
        label='Type'
        name='type'
        required
        handleChange={handleTypeChange}
        options={
          [
            { label: "Scheduled", value: 0, icon: MdAccessTime as IconType },
            { label: "Unscheduled", value: 1, icon: MdAccessTime as IconType }
          ]
        }
      />

      <Select
        label='Expense'
        name='expense'
        placeholder='Type of expense'
        required
        onChangeEvent={handleExpenseTypeChange}
        options={
          [
            { label: "Meal", value: "Meal" },
            { label: "Others", value: "others" }
          ]
        }
      />

      <CollapseHeightAnimation isVisible={selectedExpense === "others" ? true : false}>
        <Input name='remarks' label='Remarks' placeholder='Remarks for others' required />
      </CollapseHeightAnimation>

      <Input type='number' label='Total' name='total' placeholder="Total" required step={0.01} />

      <CollapseHeightAnimation isVisible={selectedType === 1 ? true : false}>
        <label className="text-xs font-semibold text-neutral-800">
          Approvers
        </label>

        {fields.map((item, i) => <div key={item.id} className="relative flex flex-col gap-4 my-4">
          <Input
            icon={MdMail as IconType}
            name={`approvers.${i}.email`}
            placeholder="Add an Approver"
            hasErrors={useFormReturn.formState.errors.approvers && useFormReturn.formState.errors.approvers[i]?.email?.message ? true : false}
            error={useFormReturn.formState.errors.approvers && useFormReturn.formState.errors.approvers[i]?.email?.message}
          />

          {fields.length > 1 && (
            <AiOutlineMinusCircle
              className="h-4 w-4 absolute top-3 right-2 text-danger-default cursor-pointer hover:text-danger-hover transition-all ease-in-out"
              onClick={() => remove(i)}
            />)}
        </div>)
        }

        <Button buttonType="text" onClick={() => append({ email: '' })}>

          <div className='flex gap-2 items-center'>
            <AiOutlinePlus className="h-5 w-5" />
            Add Another
          </div>
        </Button>

      </CollapseHeightAnimation>

      <div className='flex items-center gap-2 justify-center my-4'>
        <div className='h-2 w-2 rounded-full bg-primary-default'></div>
        <div className='h-2 w-2 rounded-full bg-primary-inactive'></div>
      </div>

      <div className='grid grid-cols-2 gap-4 items-center'>
        <Button type="button" buttonType='outlined' variant="neutral" className='w-full'> Cancel</Button>
        <Button type='submit' className='w-full'>Continue</Button>
      </div>
    </Form>

  );


}

export default ReimbursementDetailsForm;