import * as React from "react";
import clsx from "clsx";
import { useState } from "react";

export interface DialogProps extends React.HTMLAttributes<HTMLDivElement> {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: React.ReactNode;
}

export const Dialog: React.FC<DialogProps> = ({ children, open = false, onOpenChange, className, ...props }) => {
  return (
    <>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          if (child.type === DialogContent) {
            return React.cloneElement(child as React.ReactElement<any>, {
              isOpen: open,
              onClose: () => onOpenChange?.(false),
            });
          }
        }
        return child;
      })}
    </>
  );
};

export const DialogHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
  <div className={clsx("mb-4", className)} {...props} />
);

export const DialogTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({ className, ...props }) => (
  <h2 className={clsx("text-lg font-semibold", className)} {...props} />
);

export interface DialogContentProps extends React.HTMLAttributes<HTMLDivElement> {
  isOpen?: boolean;
  onClose?: () => void;
}

export const DialogContent = React.forwardRef<HTMLDivElement, DialogContentProps>(
  ({ className, isOpen = false, onClose, children, ...props }, ref) => {
    if (!isOpen) return null;

    return (
      <>
        <div 
          className="fixed inset-0 z-50 bg-black/40" 
          onClick={onClose}
        />
        <div
          ref={ref}
          className={clsx(
            "fixed left-[50%] top-[50%] z-50 w-full max-w-lg translate-x-[-50%] translate-y-[-50%] rounded-lg border bg-white shadow-lg p-6",
            className
          )}
          {...props}
        >
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-slate-400 hover:text-slate-700"
            aria-label="Close"
          >
            ×
          </button>
          {children}
        </div>
      </>
    );
  }
);
DialogContent.displayName = "DialogContent";

export interface DialogDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}
export const DialogDescription = React.forwardRef<HTMLParagraphElement, DialogDescriptionProps>(({ className, ...props }, ref) => (
  <p ref={ref} className={clsx("text-sm text-slate-500", className)} {...props} />
));
DialogDescription.displayName = "DialogDescription";

export interface DialogFooterProps extends React.HTMLAttributes<HTMLDivElement> {}
export const DialogFooter = React.forwardRef<HTMLDivElement, DialogFooterProps>(({ className, ...props }, ref) => (
  <div ref={ref} className={clsx("flex flex-col-reverse sm:flex-row sm:justify-end gap-2 mt-6", className)} {...props} />
));
DialogFooter.displayName = "DialogFooter";

export interface DialogTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  render?: React.ReactNode;
}

export const DialogTrigger = React.forwardRef<HTMLButtonElement, DialogTriggerProps>(
  ({ className, render, children, ...props }, ref) => (
    <button
      ref={ref}
      className={clsx("px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700", className)}
      type="button"
      {...props}
    >
      {render || children}
    </button>
  )
);
DialogTrigger.displayName = "DialogTrigger";
