import React from "react";
import { currencyFormat } from "~/utils/currencyFormat";

interface TotalProps {
  value: number;
}

const Total: React.FC<TotalProps> = ({ value }) => {
  return (
    <div className="pt-2 text-neutral-800">Total: {currencyFormat(value)}</div>
  );
};

export default Total;
