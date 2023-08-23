import { Dialog, Transition } from "@headlessui/react";
import { Fragment, type PropsWithChildren } from "react";
import { MdClose } from "react-icons-all-files/md/MdClose";
import { karla } from "~/styles/fonts/karla";
import { Button } from "~/components/core/Button";
import StatusBadge, { type StatusType } from "~/components/core/StatusBadge";
import { MdAccessTimeFilled } from "react-icons-all-files/md/MdAccessTimeFilled";
import { AiTwotoneFile } from "react-icons-all-files/ai/AiTwotoneFile";
import { FaArrowRight } from "react-icons-all-files/fa/FaArrowRight";
import { HiCheckCircle } from "react-icons-all-files/hi/HiCheckCircle";

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

export interface DrawerProps extends PropsWithChildren {
    data: Reimbursement[];
  isVisible: boolean;
  closeDrawer: () => void;
  title?: string;
}

const ReimbursementsCardView: React.FC<DrawerProps> = ({
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
                                    <div className="flex flex-col">
                                        <div className="grid grid-cols-2 p-3 text-sm">
                                            <span className="text-gray-500">Status</span><span><StatusBadge status={item.status}/></span>
                                        </div>
                                        <div className="grid grid-cols-2 p-3 text-sm">
                                            <span className="text-gray-500">Type</span><span>{item.type}</span>
                                        </div>
                                        <div className="grid grid-cols-2 p-3 text-sm">
                                            <span className="text-gray-500">Expense</span><span>{item.expense}</span>
                                        </div>
                                        {item.status === 'rejected' && (
                                            <div className="grid grid-cols-2 p-3 text-sm">
                                                <span className="text-gray-500">Remarks</span><span>{item.remarks}</span>
                                            </div>
                                        )}
                                        
                                        <div className="grid grid-cols-2 p-3 text-sm">
                                            <span className="text-gray-500">Filed</span><span>{item.filed}</span>
                                        </div>
                                        <div className="grid grid-cols-2 p-3 text-sm">
                                            {item.status === "credited" && (
                                                <span className="text-gray-500">Total</span>
                                            )}
                                            {item.status !== "credited" && (
                                                <span className="text-gray-500">Amount</span>
                                            )}
                                            
                                            <span>{item.total}</span>
                                        </div>
                                        {(item.status === 'processing' || item.status === 'credited') && (
                                            <div className="grid grid-cols-2 p-3 text-sm">
                                                <span className="text-gray-500">Payout</span><span>{item.filed}</span>
                                            </div>
                                        )}
                                        
                                    </div>
                                    
                                    {item.status === 'rejected' && (
                                        <div className="flex flex-col gap-3 p-3">
                                            <h6 className="text-base font-semibold">Notes</h6>
                                            <p className="text-sm text-gray-500">{item.notes}</p>
                                        </div>
                                    )}

                                    <div className="flex flex-col gap-3 p-3">
                                        <h6 className="text-base font-semibold">Approvers</h6>
                                        <div className="flex flex-col gap-2">
                                            {/* Pending */}
                                            {item.status === 'pending' && (
                                                <div className="flex items-center gap-2">
                                                    <MdAccessTimeFilled className="h-4 w-4 text-[#D89B0D]"/>
                                                    <span className="text-gray-700 text-sm">
                                                        {item.approvers}
                                                    </span>
                                                </div>
                                            )}
                                            {/* Reject */}
                                            {item.status === 'rejected' && (
                                                <div className="flex gap-2">
                                                    <MdClose className="h-4 w-4 text-red-600"/>
                                                    <div className="w-full flex flex-col">
                                                        <span className="text-gray-700 text-sm">
                                                            {item.approvers}
                                                        </span>
                                                        <div className="w-full flex justify-between">
                                                            <small className="text-[8px] text-gray-500">
                                                                {item.daterejected}
                                                            </small>
                                                            <small className="text-[8px] text-gray-500">
                                                                09:00 AM
                                                            </small>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                            {/* Approved */}
                                            {(item.status === 'approved' || item.status === 'credited' || item.status === 'processing') && (
                                                <div className="flex gap-2">
                                                    <HiCheckCircle className="h-4 w-4 text-success-default"/>
                                                    <div className="w-full flex flex-col">
                                                        <span className="text-gray-700 text-sm">
                                                            {item.approvers}
                                                        </span>
                                                        <div className="w-full flex justify-between">
                                                            <small className="text-[8px] text-gray-500">
                                                                {item.daterejected}
                                                            </small>
                                                            <small className="text-[8px] text-gray-500">
                                                                09:00 AM
                                                            </small>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-3 p-3">
                                        <h6 className="text-base font-semibold">Attachments</h6>
                                        <div className="flex items-center justify-between w-full border border-solid p-3">
                                            <div className="flex items-center gap-3">
                                                <AiTwotoneFile className="h-4 w-4 text-gray-500"/><span className="text-gray-600 text-sm">{item.attachments}</span>
                                            </div>
                                            <FaArrowRight className="h-3 w-3 text-primary-default"/>
                                        </div>
                                    </div>
                                </>
                            )
                        })}
                      </div>
                    </div>
                    <div className="flex justify-center h-[72px] items-center  border-t border-neutral-subtle px-4 gap-2">
                        <Button className="flex justify-center w-full" buttonType='outlined' variant='neutral'>Back</Button>
                        <Button className="flex justify-center w-full" variant='danger'>Cancel</Button>
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
