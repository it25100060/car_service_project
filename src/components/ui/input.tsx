import * as React from "react";
import clsx from "clsx";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={clsx(
      "block w-full rounded-md border border-slate-300 bg-white dark:bg-slate-950/50 px-3 py-2 text-base text-slate-900 dark:text-white shadow-sm placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
      className
    )}
    {...props}
  />
));
Input.displayName = "Input";
