import {
  type CSSObjectWithLabel,
  type ControlProps,
  type GroupBase,
  type OptionProps,
  type Theme,
} from "react-select";
import { type OptionData } from ".";

export const controlConfig = (
  base: CSSObjectWithLabel,
  state: ControlProps<OptionData, boolean, GroupBase<OptionData>>,
  hasError?: boolean,
) => ({
  ...base,
  width: "100%",
  minHeight: "2.6rem",
  height: "auto",
  borderRadius: "0.375rem",
  background: hasError ? "#FEF3F1" : "#FFFFFF",
  cursor: "pointer",
  border: state.isFocused
    ? hasError
      ? "1px solid #C5280C"
      : "1px solid #FF7200"
    : hasError
    ? "1px solid #C5280C"
    : "1px solid #CACED3",
  boxShadow: state.isFocused ? "0.094rem #f97316" : "none",
  "&:hover": {
    boxShadow: "0.094rem solid #f97316",
  },
});

export const inputConfig = (base: CSSObjectWithLabel) => ({
  ...base,
  "input:focus": {
    boxShadow: "none",
    border: "none",
  },
});

export const menuConfig = (base: CSSObjectWithLabel) => ({
  ...base,
  paddingLeft: "5px",
  paddingRight: "5px",
  paddingBottom: "2px",
});

export const optionConfig = (
  base: CSSObjectWithLabel,
  state: OptionProps<OptionData, boolean, GroupBase<OptionData>>,
) => ({
  ...base,
  display: "flex",
  justifyContent: "left",
  backgroundColor: state.isSelected ? "#FF7200" : "transparent",
  color: state.isSelected ? "#FFFFFF" : "#272E35",
  marginTop: "3px",
  borderRadius: "0.25rem",
  "&:hover": {
    cursor: "pointer",
    background: "#FF7200",
    color: "#FFFFFF",
  },
});

export const clearIndicatorConfig = (base: CSSObjectWithLabel) => ({
  ...base,
  color: "#FF7200",
});

export const themeConfig = (theme: Theme) => ({
  ...theme,
  colors: {
    ...theme.colors,
  },
});
