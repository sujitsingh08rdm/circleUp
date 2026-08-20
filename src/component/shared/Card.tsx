import type { FC, ReactElement } from "react";

interface CardInterface {
  title?: string;
  children?: ReactElement;
  footer?: ReactElement;
  divider?: boolean;
}

const Card: FC<CardInterface> = ({ children, title, footer, divider }) => {
  return (
    <div className="bg-white shadow-lg py-6 px-4 rounded-lg border border-gray-100 space-y-2">
      {title && <h1 className="text-lg font-semibold">{title}</h1>}
      {divider && <div className="border-b border-b-gray-200 -mx-4 my-4" />}
      {children && <div className="text-gray-600">{children}</div>}
      {footer && <div className="mt-4">{footer}</div>}
    </div>
  );
};

export default Card;
