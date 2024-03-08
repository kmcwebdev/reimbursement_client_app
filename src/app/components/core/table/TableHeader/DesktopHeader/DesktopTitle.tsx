import React from "react";
import { type IconType } from "react-icons-all-files";
import { AiOutlineSearch } from "react-icons-all-files/ai/AiOutlineSearch";
import CollapseWidthAnimation from "~/app/components/animation/CollapseWidth";
import { useAppDispatch, useAppSelector } from "~/app/hook";
import { setCurrentSelectedFinanceTabValue } from "~/features/state/table-state.slice";
import { type TableHeaderProps } from "../..";
import { Button } from "../../../Button";
import ButtonGroup, {
  type ButtonGroupOption,
} from "../../../form/fields/ButtonGroup";
import Input from "../../../form/fields/Input";

const DesktopTitle: React.FC<
  TableHeaderProps & { isFinanceTable?: boolean }
> = ({
  title,
  searchIsLoading,
  handleSearch,
  buttonIsVisible,
  buttonClickHandler,
  button,
  isFinanceTable = false,
}) => {
  const dispatch = useAppDispatch();

  const { currentSelectedFinanceTabValue } = useAppSelector(
    (state) => state.pageTableState,
  );

  const handleStatusToggleChange = (e: ButtonGroupOption) => {
    dispatch(setCurrentSelectedFinanceTabValue(+e.value));
  };

  return (
    <div className="hidden flex-col md:flex">
      <div className="flex items-center justify-between pb-2 pt-4">
        <h4>{title}</h4>
        <div className="flex items-center gap-4">
          <Input
            name="inputText"
            placeholder="Find anything..."
            loading={searchIsLoading}
            icon={AiOutlineSearch as IconType}
            onChange={handleSearch}
          />

          <CollapseWidthAnimation isVisible={buttonIsVisible}>
            <div className="whitespace-nowrap">
              {button === "create" && (
                <Button aria-label="Add New" onClick={buttonClickHandler}>
                  Reimburse
                </Button>
              )}

              {button === "download" && (
                <Button
                  aria-label="Download Report"
                  variant="success"
                  onClick={buttonClickHandler}
                >
                  Download Report
                </Button>
              )}

              {button === "approve" && (
                <Button aria-label="Approve" onClick={buttonClickHandler}>
                  Approve
                </Button>
              )}

              {button === "credit" && (
                <Button aria-label="Credit" onClick={buttonClickHandler}>
                  Credit
                </Button>
              )}
            </div>
          </CollapseWidthAnimation>
        </div>
      </div>

      {isFinanceTable && (
        <div className="w-64 pb-4">
          <ButtonGroup
            options={[
              { label: "Pending", value: 1 },
              { label: "On-hold", value: 5 },
              { label: "Crediting", value: 3 },
            ]}
            label=""
            name="statusToggle"
            handleChange={handleStatusToggleChange}
            defaultValue={currentSelectedFinanceTabValue}
          />
        </div>
      )}
    </div>
  );
};

export default DesktopTitle;
