import React, { type ChangeEvent } from "react";
import { type IconType } from "react-icons-all-files";
import { AiOutlineSearch } from "react-icons-all-files/ai/AiOutlineSearch";
import { HiFolderDownload } from "react-icons-all-files/hi/HiFolderDownload";
import { HiPlusCircle } from "react-icons-all-files/hi/HiPlusCircle";
import { MdCheck } from "react-icons-all-files/md/MdCheck";
import { MdChevronLeft } from "react-icons-all-files/md/MdChevronLeft";
import { useAppDispatch } from "~/app/hook";
import { toggleFormDialog } from "~/features/state/reimbursement-form-slice";
import { setSelectedItems } from "~/features/state/table-state.slice";
import { classNames } from "~/utils/classNames";
import CollapseWidthAnimation from "../../animation/CollapseWidth";
import { Button } from "../Button";
import SkeletonLoading from "../SkeletonLoading";
import Input from "../form/fields/Input";

interface TableHeaderTitleProps {
  title: string;
  isLoading: boolean;

  //Download Report Button Props
  hasDownloadReportButton?: boolean;
  handleDownloadReportButton?: () => void;
  downloadReportButtonIsVisible?: boolean;

  //search bar props
  handleSearch: (e: ChangeEvent<HTMLInputElement>) => void;
  searchIsLoading: boolean;

  // create button props
  hasCreateButton?: boolean;

  //approve button props
  hasApproveButton?: boolean;
  handleApproveButton?: () => void;
  approveButtonIsVisible?: boolean;
}

const TableHeaderTitle: React.FC<TableHeaderTitleProps> = ({
  title,
  handleSearch,
  isLoading,
  hasDownloadReportButton,
  downloadReportButtonIsVisible = false,
  handleDownloadReportButton,
  searchIsLoading,
  hasCreateButton,
  hasApproveButton,
  handleApproveButton,
  approveButtonIsVisible = false,
}) => {
  const dispatch = useAppDispatch();

  return (
    <>
      {/* MOBILE */}
      <div className="flex flex-col justify-between gap-2 pt-4 md:hidden">
        <div className="flex items-center justify-between px-4">
          <h4>{title}</h4>

          <div className="flex gap-4">
            {hasCreateButton && (
              <Button
                buttonType="text"
                onClick={() => dispatch(toggleFormDialog())}
              >
                <HiPlusCircle className="h-6 w-6" />
              </Button>
            )}

            {hasDownloadReportButton && (
              <CollapseWidthAnimation isVisible={downloadReportButtonIsVisible}>
                <Button
                  variant="success"
                  buttonType="text"
                  onClick={handleDownloadReportButton}
                >
                  <HiFolderDownload className="h-6 w-6" />
                </Button>
              </CollapseWidthAnimation>
            )}
          </div>
        </div>

        {isLoading ? (
          <div className="h-12 px-4">
            <SkeletonLoading className="h-10 w-full rounded-sm md:w-64" />
          </div>
        ) : (
          <div className="relative h-12 overflow-hidden">
            <div
              className={classNames(
                !approveButtonIsVisible
                  ? "translate-x-0 opacity-100"
                  : "-translate-x-full opacity-0",
                "absolute top-0 h-full w-full px-4 transition-all duration-500 ease-in-out",
              )}
            >
              <Input
                name="inputText"
                placeholder="Find anything..."
                className="w-full"
                loading={searchIsLoading}
                icon={AiOutlineSearch as IconType}
                onChange={handleSearch}
              />
            </div>

            <div
              className={classNames(
                approveButtonIsVisible
                  ? "translate-x-0 opacity-100"
                  : "translate-x-full opacity-0",
                "absolute left-0 top-0 h-full w-full transition-all duration-500 ease-in-out",
              )}
            >
              <div className="flex h-full items-center justify-between px-2">
                <Button
                  buttonType="text"
                  variant="neutral"
                  onClick={() => dispatch(setSelectedItems([]))}
                >
                  <MdChevronLeft className="h-6 w-6" />
                </Button>
                <Button
                  buttonType="text"
                  variant="primary"
                  onClick={handleApproveButton}
                >
                  <MdCheck className="h-6 w-6" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* DESKTOP */}
      <div className="hidden flex-col justify-between gap-2 md:flex md:flex-row">
        <h4>{title}</h4>

        {isLoading ? (
          <SkeletonLoading className="h-10 w-full rounded-sm md:w-64" />
        ) : (
          <div className="flex flex-col gap-2 md:flex-row md:gap-4">
            <Input
              name="inputText"
              placeholder="Find anything..."
              loading={searchIsLoading}
              icon={AiOutlineSearch as IconType}
              onChange={handleSearch}
            />

            {hasCreateButton && (
              <Button onClick={() => dispatch(toggleFormDialog())}>
                Reimburse
              </Button>
            )}

            {hasApproveButton && (
              <CollapseWidthAnimation isVisible={approveButtonIsVisible}>
                <Button variant="primary" onClick={handleApproveButton}>
                  Approve
                </Button>
              </CollapseWidthAnimation>
            )}

            {hasDownloadReportButton && (
              <CollapseWidthAnimation isVisible={downloadReportButtonIsVisible}>
                <Button
                  variant="success"
                  className="whitespace-nowrap"
                  onClick={handleDownloadReportButton}
                >
                  Download Report
                </Button>
              </CollapseWidthAnimation>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default TableHeaderTitle;
