import React from "react";
import { type IconType } from "react-icons-all-files";
import { AiOutlineSearch } from "react-icons-all-files/ai/AiOutlineSearch";
import CollapseWidthAnimation from "~/app/components/animation/CollapseWidth";
import { type TableHeaderProps } from "../..";
import { Button } from "../../../Button";
import ButtonGroup from "../../../form/fields/ButtonGroup";
import Input from "../../../form/fields/Input";

const DesktopTitle: React.FC<TableHeaderProps> = ({
  title,
  searchIsLoading,
  handleSearch,
  buttonIsVisible,
  buttonClickHandler,
  handleStatusToggle,
  statusToggleValue,
  button,
}) => {
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
            </div>
          </CollapseWidthAnimation>
        </div>
      </div>

      {handleStatusToggle && statusToggleValue && (
        <div className="w-40 pb-4">
          <ButtonGroup
            options={[
              { label: "Pending", value: 1 },
              { label: "On-hold", value: 5 },
            ]}
            label=""
            name="statusToggle"
            handleChange={handleStatusToggle}
            defaultValue={statusToggleValue}
          />
        </div>
      )}
    </div>
  );
};

export default DesktopTitle;
