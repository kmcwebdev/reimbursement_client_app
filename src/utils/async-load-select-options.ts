import { type OptionData } from "~/components/core/form/fields/Select";

export const asyncLoadOptions = (
  options: OptionData[],
  inputValue: string,
  callback: (params: OptionData[]) => void,
) => {
  setTimeout(() => {
    const filteredOptions = options.filter((optionsData) =>
      optionsData.label.toLowerCase().includes(inputValue?.toLowerCase()),
    );
    callback(filteredOptions);
  }, 100);
};
