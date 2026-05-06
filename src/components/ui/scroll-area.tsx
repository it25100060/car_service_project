import * as React from "react";
import clsx from "clsx";

export interface ScrollAreaProps extends React.HTMLAttributes<HTMLDivElement> {}
export const ScrollArea = React.forwardRef<HTMLDivElement, ScrollAreaProps>(({ className, ...props }, ref) => (
  <div ref={ref} className={clsx("overflow-y-auto", className)} {...props} />
));
ScrollArea.displayName = "ScrollArea";
