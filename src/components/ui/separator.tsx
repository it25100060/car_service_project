import * as React from "react";
import clsx from "clsx";

export interface SeparatorProps extends React.HTMLAttributes<HTMLHRElement> {}

export const Separator = React.forwardRef<HTMLHRElement, SeparatorProps>(({ className, ...props }, ref) => (
  <hr ref={ref} className={clsx("my-2 border-t border-slate-200", className)} {...props} />
));
Separator.displayName = "Separator";
