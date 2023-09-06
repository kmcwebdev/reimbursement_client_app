import { TbChevronDown } from "react-icons-all-files/tb/TbChevronDown";
import {
  components,
  type DropdownIndicatorProps,
  type GroupBase,
} from "react-select";
import { type OptionData } from ".";

type CustomDropdownIndicatorProps = DropdownIndicatorProps<
  OptionData,
  boolean,
  GroupBase<OptionData>
>;

const CustomDropdownIndicator = ({ ...rest }: CustomDropdownIndicatorProps) => {
  return (
    <components.DropdownIndicator {...rest}>
      <TbChevronDown className="mr-1 h-4 w-4 text-neutral-800" />
    </components.DropdownIndicator>
  );
};

export default CustomDropdownIndicator;
