import type { FC, ReactElement, ReactNode } from "react";

interface CardInterface {
  title?: ReactNode;
  children?: ReactNode;
  footer?: ReactElement;
  divider?: boolean;
  noPadding?: boolean;
}

const Card: FC<CardInterface> = ({
  noPadding = false,
  children,
  title,
  footer,
  divider,
}) => {
  return (
    <div
      className={`bg-white shadow-lg ${noPadding ? "" : "py-6 px-4"} rounded-lg border border-gray-100 space-y-2`}
    >
      {title && <h1 className="text-lg font-semibold capitalize">{title}</h1>}
      {divider && <div className="border-b border-b-gray-200 -mx-4 my-4" />}
      {children && <div className="text-gray-600">{children}</div>}
      {footer && <div className="mt-4">{footer}</div>}
    </div>
  );
};

export default Card;
