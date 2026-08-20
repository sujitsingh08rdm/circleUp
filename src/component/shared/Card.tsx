import type { FC, ReactElement } from "react";

interface CardInterface {
  children?: string;
  title?: string;
  footer?: ReactElement;
}

const Card: FC<CardInterface> = ({ children, title, footer }) => {
  return (
    <div className="bg-white shadow-lg p-8 rounded-lg border border-gray-100 space-y-2">
      {title && <h1 className="text-lg font-semibold">{title}</h1>}
      {children && <div className="text-gray-600">{children}</div>}{" "}
      {footer && <div className="mt-4">{footer}</div>}
    </div>
  );
};

export default Card;
