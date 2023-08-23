import React, { type Dispatch, type SetStateAction } from 'react';
import ReimbursementDetailsForm from './steps/ReimbursementDetailsForm';
import UploadAttachments from './steps/UploadAttachments';

interface ReimburseFormProps {
  activeStep: number;
  setActiveStep: Dispatch<SetStateAction<number>>;
}


const ReimburseForm: React.FC<ReimburseFormProps> = ({ activeStep, setActiveStep }) => {


  return (<div className='py-4'>

    {activeStep === 0 && < ReimbursementDetailsForm activeStep={activeStep} setActiveStep={setActiveStep} />}
    {activeStep === 1 && < UploadAttachments />}

  </div >);
}

export default ReimburseForm;