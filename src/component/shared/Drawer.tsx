import type { FC } from "react";

interface DrawerInterface {
  children?: string;
  title?: string;
  open?: boolean;
  close?: () => void;
  key?: string | number;
}

const Drawer: FC<DrawerInterface> = ({
  children = "You're content goes here..",
  title,
  open = true,
  close,
  key = 0,
}) => {
  return (
    <div
      key={key}
      style={{ right: open ? 0 : "-50%", transition: "0.5s" }}
      className="shadow-2xl w-6/12 top-0 fixed h-full overflow-auto p-8 z-10000 space-y-4"
    >
      <h1 className="text-lg font-medium">{title}</h1>
      <div className="border-b border-slate-200 -mx-8" />
      <div className="text-gray-500">{children}</div>
      <button className="absolute top-4 right-4 cursor-pointer">
        <i onClick={close} className="ri-close-circle-fill"></i>
      </button>
    </div>
  );
};

export default Drawer;
