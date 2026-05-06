import * as React from "react";
import clsx from "clsx";

export interface PopoverProps extends React.HTMLAttributes<HTMLDivElement> {
  open?: boolean;
}
export const Popover = React.forwardRef<HTMLDivElement, PopoverProps>(({ className, open, ...props }, ref) => (
  <div ref={ref} className={clsx("relative", className)} {...props} />
));
Popover.displayName = "Popover";

export interface PopoverTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}
export const PopoverTrigger = React.forwardRef<HTMLButtonElement, PopoverTriggerProps>(({ className, ...props }, ref) => (
  <button ref={ref} className={clsx("px-2 py-1", className)} {...props} />
));
PopoverTrigger.displayName = "PopoverTrigger";

export interface PopoverContentProps extends React.HTMLAttributes<HTMLDivElement> {}
export const PopoverContent = React.forwardRef<HTMLDivElement, PopoverContentProps>(({ className, ...props }, ref) => (
  <div ref={ref} className={clsx("absolute z-10 mt-2 w-56 rounded-md bg-white shadow-lg", className)} {...props} />
));
PopoverContent.displayName = "PopoverContent";
