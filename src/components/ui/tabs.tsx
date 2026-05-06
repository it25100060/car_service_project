import * as React from "react";
import clsx from "clsx";

export interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: string;
  onValueChange?: (value: string) => void;
}
export const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(({ className, children, value, onValueChange, ...props }, ref) => (
  <div ref={ref} className={clsx("flex flex-col gap-2", className)} {...props}>
    {children}
  </div>
));
Tabs.displayName = "Tabs";

export interface TabsListProps extends React.HTMLAttributes<HTMLDivElement> {}
export const TabsList = React.forwardRef<HTMLDivElement, TabsListProps>(({ className, ...props }, ref) => (
  <div ref={ref} className={clsx("flex gap-2 border-b", className)} {...props} />
));
TabsList.displayName = "TabsList";

export interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean;
}
export const TabsTrigger = React.forwardRef<HTMLButtonElement, TabsTriggerProps>(({ className, selected, ...props }, ref) => (
  <button
    ref={ref}
    className={clsx(
      "px-4 py-2 text-sm font-medium border-b-2",
      selected ? "border-blue-600 text-blue-600" : "border-transparent text-slate-600 hover:text-blue-600 hover:border-blue-600",
      className
    )}
    aria-selected={selected}
    {...props}
  />
));
TabsTrigger.displayName = "TabsTrigger";

export interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: string;
  selected?: boolean;
}
export const TabsContent = React.forwardRef<HTMLDivElement, TabsContentProps>(({ className, selected, ...props }, ref) => (
  <div
    ref={ref}
    className={clsx(selected ? "block" : "hidden", className)}
    {...props}
  />
));
TabsContent.displayName = "TabsContent";
