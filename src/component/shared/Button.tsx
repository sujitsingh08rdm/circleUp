import type { FC } from "react";

const ButtonModel = {
  primary:
    "bg-blue-500 inline-flex hover:bg-blue-300 rounded font-medium text-white px-4 py-2",
  secondary:
    "bg-indigo-500 inline-flex hover:bg-indigo-300 rounded font-medium text-white px-4 py-2",
  danger:
    "bg-rose-500 inline-flex hover:bg-rose-300 rounded font-medium text-white px-4 py-2",
  warning:
    "bg-amber-500 inline-flex hover:bg-amber-300 rounded font-medium text-white px-4 py-2",
  dark: "bg-slate-500 inline-flex hover:bg-slate-300 rounded font-medium text-white px-4 py-2",
  success:
    "bg-green-500 inline-flex hover:bg-green-300 rounded font-medium text-white px-4 py-2",
  info: "bg-cyan-500 inline-flex hover:bg-cyan-300 rounded font-medium text-white px-4 py-2",
  smSecondary:
    "px-2 py-1 bg-indigo-500 hover:bg-indigo-300 text-white text-xs flex items-center hover:text-gray-200 rounded-md  inline-flex font-medium",
  smSuccess:
    "px-2 py-1 bg-green-500 hover:bg-green-300 text-white text-xs flex items-center hover:text-gray-200 rounded-md  inline-flex font-medium",
};

interface ButtonInterface {
  children?: string;
  type?:
    | "primary"
    | "secondary"
    | "danger"
    | "warning"
    | "dark"
    | "success"
    | "info"
    | "smSecondary"
    | "smSuccess";
  onClick?: () => void;
  icon?: string;
  key?: string | number;
  loading?: boolean;
}

const Button: FC<ButtonInterface> = ({
  children = "Submit",
  type = "primary",
  onClick,
  icon,
  key = 0,
  loading = false,
}) => {
  if (loading) {
    return (
      <button
        key={key}
        className={ButtonModel[type]}
        onClick={onClick}
        disabled
      >
        <i className="ri-loader-4-line mr-1 animate-spin text-white" />
        Loading..
      </button>
    );
  }

  return (
    <button key={key} className={ButtonModel[type]} onClick={onClick}>
      {icon && <i className={`ri-${icon} mr-1`}></i>} {children}
    </button>
  );
};

export default Button;
