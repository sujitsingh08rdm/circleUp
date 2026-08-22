import type { FC } from "react";

const IconButtonModel = {
  primary:
    "bg-blue-200 text-blue-800 hover:text-blue-900 inline-flex hover:bg-blue-400 rounded font-medium px-2 py-1",
  secondary:
    "bg-indigo-200 text-indigo-800 hover:text-indigo-900 inline-flex hover:bg-indigo-400 rounded font-medium px-2 py-1",
  danger:
    "bg-rose-200 text-rose-800 hover:text-rose-900 inline-flex hover:bg-rose-400 rounded font-medium px-2 py-1",
  warning:
    "bg-amber-200 text-amber-800 hover:text-amber-900 inline-flex hover:bg-amber-400 rounded font-medium px-2 py-1",
  dark: "bg-slate-200 inline-flex hover:bg-slate-400 rounded font-medium px-2 py-1",
  success:
    "bg-green-200 text-green-800 hover:text-green-900 inline-flex hover:bg-green-400 rounded font-medium px-2 py-1",
  info: "bg-cyan-200 inline-flex hover:bg-cyan-400 rounded font-medium px-2 py-1",
};

interface IconButtonInterface {
  type?:
    | "primary"
    | "secondary"
    | "danger"
    | "warning"
    | "dark"
    | "success"
    | "info";
  onClick?: () => void;
  icon: string;
  children?: string;
}

const IconButton: FC<IconButtonInterface> = ({
  type = "primary",
  onClick,
  icon,
  children,
}) => {
  return (
    <button className={IconButtonModel[type]} onClick={onClick}>
      {icon && <i className={`ri-${icon}`}></i>}
      {children && <span className="ml-1">{children}</span>}
    </button>
  );
};

export default IconButton;
