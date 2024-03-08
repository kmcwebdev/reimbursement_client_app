import { flexRender, type HeaderGroup } from "@tanstack/react-table";
import React from "react";
import { type IconType } from "react-icons-all-files";
import { AiOutlineSearch } from "react-icons-all-files/ai/AiOutlineSearch";
import { HiFolderDownload } from "react-icons-all-files/hi/HiFolderDownload";
import { HiPlusCircle } from "react-icons-all-files/hi/HiPlusCircle";
import { MdCheck } from "react-icons-all-files/md/MdCheck";
import { MdCreditScore } from "react-icons-all-files/md/MdCreditScore";
import CollapseWidthAnimation from "~/app/components/animation/CollapseWidth";
import { useAppDispatch, useAppSelector } from "~/app/hook";
import { setCurrentSelectedFinanceTabValue } from "~/features/state/table-state.slice";
import { type IReimbursementRequest } from "~/types/reimbursement.types";
import { classNames } from "~/utils/classNames";
import { type CustomFilterMeta, type TableHeaderProps } from "..";
import { Button } from "../../Button";
import ButtonGroup, {
  type ButtonGroupOption,
} from "../../form/fields/ButtonGroup";
import Input from "../../form/fields/Input";
import SkeletonLoading from "../../SkeletonLoading";

interface MobileHeaderProps extends TableHeaderProps {
  isFinanceTable?: boolean;
  headerGroups: HeaderGroup<IReimbursementRequest>[];
}

const MobileTableHeader: React.FC<MobileHeaderProps> = ({
  isLoading,
  title,
  button,
  buttonIsVisible,
  buttonClickHandler,
  searchIsLoading,
  handleSearch,
  headerGroups,
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
    <thead className="sticky top-0 z-[5] h-12 rounded-t-sm  bg-white text-xs md:hidden">
      <tr>
        <th className="flex flex-col border-b shadow-sm">
          <div className="flex flex-col gap-2 px-4 pt-4">
            <div className="flex items-center justify-between">
              <h4>{title}</h4>

              {isLoading ? (
                <SkeletonLoading className="h-6 w-6 rounded-sm" />
              ) : (
                <CollapseWidthAnimation isVisible={buttonIsVisible}>
                  {button === "create" && (
                    <Button
                      aria-label="Add New"
                      buttonType="text"
                      onClick={buttonClickHandler}
                    >
                      <HiPlusCircle className="h-6 w-6" />
                    </Button>
                  )}

                  {button === "download" && (
                    <Button
                      aria-label="Download"
                      variant="success"
                      buttonType="text"
                      onClick={buttonClickHandler}
                    >
                      <HiFolderDownload className="h-6 w-6" />
                    </Button>
                  )}

                  {button === "approve" && (
                    <Button
                      aria-label="Approve"
                      buttonType="text"
                      onClick={buttonClickHandler}
                    >
                      <MdCheck className="h-6 w-6" />
                    </Button>
                  )}

                  {button === "credit" && (
                    <Button
                      aria-label="Credit"
                      buttonType="text"
                      onClick={buttonClickHandler}
                    >
                      <MdCreditScore className="h-6 w-6" />
                    </Button>
                  )}
                </CollapseWidthAnimation>
              )}
            </div>

            {isLoading ? (
              <SkeletonLoading className="h-10 rounded-sm md:w-64" />
            ) : (
              <div className="font-normal">
                <Input
                  name="inputText"
                  placeholder="Find anything..."
                  loading={searchIsLoading}
                  icon={AiOutlineSearch as IconType}
                  onChange={handleSearch}
                />
              </div>
            )}

            {isFinanceTable && (
              <div className="w-64">
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

            <div className="h-10">
              {headerGroups.map((headerGroup, i) => (
                <div key={i} className="flex h-full gap-2">
                  {headerGroup.headers
                    .filter(
                      (header) =>
                        header.column.columnDef?.meta &&
                        (header.column.columnDef?.meta as CustomFilterMeta)
                          .filterComponent,
                    )
                    .map((header, index) => {
                      return (
                        <div
                          key={`header-${index}`}
                          className="flex h-full items-center gap-2 text-xs"
                        >
                          <div
                            className={classNames(
                              "flex items-center gap-1 rounded-sm bg-neutral-200 px-1",
                            )}
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                            <div className="mt-1">
                              {header.column.columnDef?.meta &&
                                (
                                  header.column.columnDef
                                    ?.meta as CustomFilterMeta
                                ).filterComponent &&
                                (
                                  header.column.columnDef
                                    ?.meta as CustomFilterMeta
                                ).filterComponent()}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              ))}
            </div>
          </div>
        </th>
      </tr>
    </thead>
  );
};

export default MobileTableHeader;
