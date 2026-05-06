import * as React from "react";
import clsx from "clsx";
import { useEffect, useRef, useState } from "react";

export interface DropdownMenuProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

export const DropdownMenu = React.forwardRef<HTMLDivElement, DropdownMenuProps>(
  ({ className, children, ...props }, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    const internalRef = useRef<HTMLDivElement>(null);
    const containerRef = ref || internalRef;

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          containerRef &&
          "current" in containerRef &&
          !containerRef.current?.contains(event.target as Node)
        ) {
          setIsOpen(false);
        }
      };

      if (isOpen) {
        document.addEventListener("mousedown", handleClickOutside);
      }

      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [isOpen, containerRef]);

    return (
      <div
        ref={containerRef as React.Ref<HTMLDivElement>}
        className={clsx("relative inline-block", className)}
        {...props}
      >
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            if (child.type === DropdownMenuTrigger) {
              return React.cloneElement(child as React.ReactElement<any>, {
                onClick: () => setIsOpen(!isOpen),
              });
            } else if (child.type === DropdownMenuContent) {
              return React.cloneElement(child as React.ReactElement<any>, {
                isOpen,
                setIsOpen,
              });
            }
          }
          return child;
        })}
      </div>
    );
  }
);
DropdownMenu.displayName = "DropdownMenu";

export interface DropdownMenuTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  render?: React.ReactNode;
}

export const DropdownMenuTrigger = React.forwardRef<
  HTMLButtonElement,
  DropdownMenuTriggerProps
>(({ className, render, children, ...props }, ref) => (
  <button
    ref={ref}
    className={clsx("px-2 py-1", className)}
    type="button"
    {...props}
  >
    {render || children}
  </button>
));
DropdownMenuTrigger.displayName = "DropdownMenuTrigger";

export interface DropdownMenuContentProps
  extends React.HTMLAttributes<HTMLDivElement> {
  isOpen?: boolean;
  setIsOpen?: (open: boolean) => void;
  align?: "start" | "end";
}

export const DropdownMenuContent = React.forwardRef<
  HTMLDivElement,
  DropdownMenuContentProps
>(
  (
    { className, isOpen = false, setIsOpen, align = "end", ...props },
    ref
  ) => {
    if (!isOpen) return null;

    return (
      <div
        ref={ref}
        className={clsx(
          "absolute mt-2 w-56 rounded-md bg-white shadow-lg border border-slate-200 z-50",
          align === "end" ? "right-0" : "left-0",
          className
        )}
        onClick={() => setIsOpen?.(false)}
        {...props}
      />
    );
  }
);
DropdownMenuContent.displayName = "DropdownMenuContent";

export interface DropdownMenuItemProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export const DropdownMenuItem = React.forwardRef<
  HTMLDivElement,
  DropdownMenuItemProps
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={clsx(
      "px-4 py-2 hover:bg-slate-100 cursor-pointer text-sm text-slate-700 flex items-center transition-colors",
      className
    )}
    {...props}
  />
));
DropdownMenuItem.displayName = "DropdownMenuItem";

export interface DropdownMenuSeparatorProps
  extends React.HTMLAttributes<HTMLHRElement> {}

export const DropdownMenuSeparator = React.forwardRef<
  HTMLHRElement,
  DropdownMenuSeparatorProps
>(({ className, ...props }, ref) => (
  <hr
    ref={ref}
    className={clsx("my-1 border-t border-slate-200", className)}
    {...props}
  />
));
DropdownMenuSeparator.displayName = "DropdownMenuSeparator";

export interface DropdownMenuGroupProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export const DropdownMenuGroup = React.forwardRef<
  HTMLDivElement,
  DropdownMenuGroupProps
>(({ className, ...props }, ref) => (
  <div ref={ref} className={clsx("py-1", className)} {...props} />
));
DropdownMenuGroup.displayName = "DropdownMenuGroup";

export interface DropdownMenuLabelProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export const DropdownMenuLabel = React.forwardRef<
  HTMLDivElement,
  DropdownMenuLabelProps
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={clsx("px-4 py-2 text-xs text-slate-500 uppercase tracking-wider", className)}
    {...props}
  />
));
DropdownMenuLabel.displayName = "DropdownMenuLabel";
