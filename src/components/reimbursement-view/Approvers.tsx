import React from "react";
import { MdAccessTimeFilled } from "react-icons-all-files/md/MdAccessTimeFilled";
import { HiCheckCircle } from "react-icons-all-files/hi/HiCheckCircle";
import { MdClose } from "react-icons-all-files/md/MdClose";

interface ApproversProps {
    status: string;
    approvers: string;
    daterejected: string;
}

const Approvers: React.FC<ApproversProps> = ({status, approvers, daterejected}) => {
    return (
        <>
            <div className="flex flex-col gap-4 p-3 mt-3">
                <h6 className="text-base font-semibold">Approvers</h6>
                <div className="flex flex-col gap-2">
                    {/* Pending */}
                    {status === 'pending' && (
                    <div className="flex items-center gap-2">
                        <MdAccessTimeFilled className="h-4 w-4 text-[#D89B0D]"/>
                        <span className="text-gray-700 text-sm">
                            {approvers}
                        </span>
                    </div>
                    )}
                    {/* Reject */}
                    {status === 'rejected' && (
                    <div className="flex gap-2">
                        <MdClose className="h-4 w-4 text-red-600"/>
                        <div className="w-full flex flex-col">
                        <span className="text-gray-700 text-sm">
                            {approvers}
                        </span>
                        <div className="w-full flex justify-between">
                            <small className="text-[8px] text-gray-500">
                                {daterejected}
                            </small>
                            <small className="text-[8px] text-gray-500">
                                09:00 AM
                            </small>
                        </div>
                        </div>
                    </div>
                    )}
                    {/* Approved */}
                    {(status === 'approved' || status === 'credited' || status === 'processing') && (
                    <div className="flex gap-2">
                        <HiCheckCircle className="h-4 w-4 text-success-default"/>
                        <div className="w-full flex flex-col">
                            <span className="text-gray-700 text-sm">
                                {approvers}
                            </span>
                            <div className="w-full flex justify-between">
                                <small className="text-[8px] text-gray-500">
                                    {daterejected}
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
        </>
    )
}

export default Approvers;