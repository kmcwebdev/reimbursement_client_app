import React from 'react';
import { Button } from '~/components/core/Button';
import Upload from '~/components/core/Upload';

interface UploadAttachmentsProps {

}

const UploadAttachments: React.FC<UploadAttachmentsProps> = () => {
  return (
    <div className='flex flex-col gap-4'>
      <Upload />

      <div className='flex items-center gap-2 justify-center my-4'>
        <div className='h-2 w-2 rounded-full bg-primary-inactive'></div>
        <div className='h-2 w-2 rounded-full bg-primary-default'></div>
      </div>

      <div className='grid grid-cols-2 gap-4 items-center'>
        <Button type="button" buttonType='outlined' variant="neutral" className='w-full'>Cancel</Button>
        <Button type='submit' className='w-full'>Reimburse</Button>
      </div>
    </div>
  );
}

export default UploadAttachments;