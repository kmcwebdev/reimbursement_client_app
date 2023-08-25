import React from "react";

interface NotesProps {
    note: string;
}

const Notes: React.FC<NotesProps> = ({note}) => {
    return (
        <>
        <div className="flex flex-col gap-3 p-3">
            <h6 className="text-base font-semibold">Notess</h6>
            <p className="text-sm text-gray-500">{note}</p>
        </div>
        </>
    )
}

export default Notes;