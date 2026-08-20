import type { FC } from "react";

const ButtonModel = {
  primary:
    "bg-blue-500 hover:bg-blue-300 rounded font-medium text-white px-4 py-2",
  secondary:
    "bg-indigo-500 hover:bg-indigo-300 rounded font-medium text-white px-4 py-2",
  danger:
    "bg-rose-500 hover:bg-rose-300 rounded font-medium text-white px-4 py-2",
  warning:
    "bg-amber-500 hover:bg-amber-300 rounded font-medium text-white px-4 py-2",
  dark: "bg-slate-500 hover:bg-slate-300 rounded font-medium text-white px-4 py-2",
  success:
    "bg-green-500 hover:bg-green-300 rounded font-medium text-white px-4 py-2",
  info: "bg-cyan-500 hover:bg-cyan-300 rounded font-medium text-white px-4 py-2",
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
    | "info";
  onClick?: () => void;
  icon?: string;
}

const Button: FC<ButtonInterface> = ({
  children = "Submit",
  type = "primary",
  onClick,
  icon,
}) => {
  return (
    <button className={ButtonModel[type]} onClick={onClick}>
      {icon && <i className={`ri-${icon} mr-1`}></i>} {children}
    </button>
  );
};

export default Button;
