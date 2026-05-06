import * as React from "react";
import clsx from "clsx";

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
}

export const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value, max = 100, ...props }, ref) => {
    const percent = Math.min(100, Math.max(0, (value / max) * 100));
    return (
      <div
        ref={ref}
        className={clsx(
          "w-full h-4 bg-slate-200 rounded-full overflow-hidden",
          className
        )}
        {...props}
      >
        <div
          className="h-full bg-blue-600 transition-all"
          style={{ width: `${percent}%` }}
        />
      </div>
    );
  }
);
Progress.displayName = "Progress";
