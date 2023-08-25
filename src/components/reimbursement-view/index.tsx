import { Dialog ,Transition } from "@headlessui/react";
import { Fragment, type PropsWithChildren } from "react";
import { MdClose } from "react-icons-all-files/md/MdClose";
import { karla } from "~/styles/fonts/karla";
import { Button } from "~/components/core/Button";
import { type StatusType } from "~/components/core/StatusBadge";
import Details from "./Details"
import Notes from "./Notes"
import Approvers from "./Approvers"
import Attachments from "./Attachments"

export type Reimbursement = {
    status: StatusType;
    client: string;
    id: string;
    name: string;
    reimbursementId: string;
    type: string;
    expense: string;
    remarks: string;
    filed: string;
    total: number;
    approvers: string;
    note: string;
    attachments: string;
    daterejected: string;
    notes: string;
  };

export interface ReimbursementsCardViewProps extends PropsWithChildren {
    data: Reimbursement[];
  isVisible: boolean;
  closeDrawer: () => void;
  title?: string;
}

const ReimbursementsCardView: React.FC<ReimbursementsCardViewProps> = ({
  closeDrawer,
  isVisible,
  title,
  data
}) => {
  return (
    <Transition.Root show={isVisible} as={Fragment}>
      <Dialog
        as="div"
        className={`${karla.variable} relative z-20`}
        onClose={closeDrawer}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-900 bg-opacity-60 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed bottom-5 right-5 top-5 flex max-w-full">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-400 sm:duration-500"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-400 sm:duration-500"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen md:w-[424px]">
                  <div className="relative flex h-full flex-col overflow-y-scroll rounded bg-white shadow-xl">
                    <div className="flex h-[72px] items-center justify-between border-b border-neutral-subtle px-4">
                      <Dialog.Title className="font-karla text-lg font-bold uppercase">
                        <span>{title}</span>
                      </Dialog.Title>

                      <button type="button" onClick={closeDrawer}>
                        <MdClose className="h-4 w-4 text-gray-400 transition-all hover:text-gray-900" />
                      </button>
                    </div>

                    <div className="relative flex-1 h-full">
                      <div className="absolute inset-0 p-4">
                        {data.map(item => {
                            return (
                                <>
                                  <Details 
                                    statusDetails={item.status} 
                                    type={item.type} expense={item.expense} 
                                    remarks={item.remarks}
                                    filed={item.filed}
                                    total={item.total}
                                  />
                                  

                                  {item.status === 'rejected' && (
                                    <Notes note={item.note}/>
                                  )}

                                  
                                  <Approvers 
                                    status={item.status} 
                                    approvers={item.approvers} 
                                    daterejected={item.daterejected}
                                  />

                                  <Attachments  attachments={item.attachments}/>

                                </>
                            )
                        })}
                      </div>
                    </div>
                    <div className="flex justify-center h-[72px] items-center  border-t border-neutral-subtle px-4 gap-2">
                        <Button onClick={closeDrawer} className="flex justify-center w-full hover:bg-gray-300 hover:opacity-80" buttonType='outlined' variant='neutral'>Back</Button>
                        <Button className="flex justify-center w-full" variant='danger'>Cancel Request</Button>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default ReimbursementsCardView;
