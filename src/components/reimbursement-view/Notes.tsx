import React from "react";

interface NotesProps {
  note: string;
}

const Notes: React.FC<NotesProps> = ({ note }) => {
  return (
    <>
      <div className="flex flex-col gap-3 p-3">
        <h6 className="text-base font-semibold text-neutral-900">Notes</h6>
        <p className="text-sm text-neutral-800">{note}</p>
      </div>
    </>
  );
};

export default Notes;
