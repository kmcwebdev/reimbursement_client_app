import React from "react";
import StatusBadge, { type StatusType } from "~/components/core/StatusBadge";

interface DeatilsProps {
    statusDetails: StatusType;
    type: string;
    expense: string;
    remarks: string;
    filed: string
    total: number;
}

const Details: React.FC<DeatilsProps> = ({ statusDetails, type, expense, remarks, filed, total }) => {
    return (
        <>
            <div className="flex flex-col">
                <div className="grid grid-cols-2 p-3 text-sm">
                    <span className="text-gray-500">Status</span><span><StatusBadge status={statusDetails}/></span>
                </div>
                <div className="grid grid-cols-2 p-3 text-sm">
                    <span className="text-gray-500">Type</span><span>{type}</span>
                </div>
                <div className="grid grid-cols-2 p-3 text-sm">
                    <span className="text-gray-500">Expense</span><span>{expense}</span>
                </div>
                {statusDetails === 'rejected' && (
                    <div className="grid grid-cols-2 p-3 text-sm">
                        <span className="text-gray-500">Remarks</span><span>{remarks}</span>
                    </div>
                )}
                
                <div className="grid grid-cols-2 p-3 text-sm">
                    <span className="text-gray-500">Filed</span><span>{filed}</span>
                </div>
                <div className="grid grid-cols-2 p-3 text-sm">
                    {statusDetails === "credited" && (
                        <span className="text-gray-500">Total</span>
                    )}
                    {statusDetails !== "credited" && (
                        <span className="text-gray-500">Amount</span>
                    )}
                    
                    <span>{total}</span>
                </div>
                {(statusDetails === 'processing' || statusDetails === 'credited') && (
                    <div className="grid grid-cols-2 p-3 text-sm">
                        <span className="text-gray-500">Payout</span><span>{filed}</span>
                    </div>
                )}
            </div>
        </>
    )
}

export default Details;