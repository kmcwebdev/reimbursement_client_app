import React from "react";
import { type IParticularDetails } from "~/types/reimbursement.types";
import Accordion from "../core/accordion";

interface ParticularsProps {
  particulars: IParticularDetails[];
}

const Particulars: React.FC<ParticularsProps> = ({ particulars }) => {
  return (
    <Accordion
      label="Particulars"
      items={particulars.map((particular) => ({
        id: particular.id,
        label: `${particular.expense_type.name}-${particular.name}`,
        description: particular.justification,
        amount: particular.amount,
      }))}
    />
  );
};

export default Particulars;
