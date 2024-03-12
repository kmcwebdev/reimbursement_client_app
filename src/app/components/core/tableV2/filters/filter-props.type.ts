import { type QueryFilter } from "~/types/reimbursement.types";

export type FilterProps = {
  filters: QueryFilter | null;
  setFilters: (e: QueryFilter | null) => void;
};
