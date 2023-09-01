import { classNames } from "~/utils/classNames";

type SkeletonLoadingProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
> & {
  height?: number | string;
  width?: number | string;
  containerClassName?: string;
};

const SkeletonLoading: React.FC<SkeletonLoadingProps> = ({
  className,
  style,
  height,
  width,
  containerClassName,
  ...rest
}) => {
  return (
    <div
      className={classNames(
        "animate-pulse",
        containerClassName && containerClassName,
      )}
    >
      <div
        {...rest}
        className={classNames("bg-slate-200", className && className)}
        style={{ width, height, ...style }}
      ></div>
    </div>
  );
};

export default SkeletonLoading;
