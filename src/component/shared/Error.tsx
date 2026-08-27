import type { FC } from "react";

import Card from "./Card";

interface ErrorInterface {
  message: string;
}

const Error: FC<ErrorInterface> = ({ message }) => {
  return (
    <Card noPadding>
      <div className="flex items-center gap-4 rounded-lg bg-linear-to-br from-indigo-50 via-blue-50 to-violet-50 px-6 py-6">
        {/* Error icon */}
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
          <i className="ri-error-warning-line text-3xl" />
        </div>

        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            Something went wrong
          </h2>

          <p className="mt-1 text-sm leading-6 text-slate-500">{message}</p>
        </div>
      </div>
    </Card>
  );
};

export default Error;
