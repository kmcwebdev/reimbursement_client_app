import React from "react";
import { type Particular } from "~/types/reimbursement.types";
import Accordion from "../core/accordion";

interface ParticularsProps {
  particulars: Particular[];
}

const Particulars: React.FC<ParticularsProps> = ({ particulars }) => {
  return (
    <Accordion
      label="Particulars"
      items={particulars.map((particular) => ({
        id: particular.id,
        label: `${particular.expense_type.name}`,
        description: particular.justification,
        amount: particular.amount,
      }))}
    />
  );
};

export default Particulars;
