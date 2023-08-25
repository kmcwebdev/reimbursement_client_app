import React from "react";
import { AiTwotoneFile } from "react-icons-all-files/ai/AiTwotoneFile";
import { FaArrowRight } from "react-icons-all-files/fa/FaArrowRight";

interface AttachmentsProps {
    attachments: string;
}

const Attachments: React.FC<AttachmentsProps> = ({attachments}) => {
    return (
        <>
            <div className="flex flex-col gap-4 p-3 mt-3">
                <h6 className="text-base font-semibold">Attachments</h6>
                <div className="flex items-center justify-between w-full border border-solid p-3">
                    <div className="flex items-center gap-3">
                        <AiTwotoneFile className="h-4 w-4 text-gray-500"/><span className="text-gray-600 text-sm">{attachments}</span>
                    </div>
                    <FaArrowRight className="h-3 w-3 text-primary-default"/>
                </div>
            </div>
        </>
    )
}

export default Attachments;