import * as React from "react";
import clsx from "clsx";
import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

export interface SelectProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: string;
  onValueChange?: (value: string) => void;
  required?: boolean;
}

export const Select = React.forwardRef<HTMLDivElement, SelectProps>(
  ({ className, value, onValueChange, required, children, ...props }, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState(value || "");
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
          setIsOpen(false);
        }
      };

      if (isOpen) {
        document.addEventListener("mousedown", handleClickOutside);
      }
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [isOpen]);

    useEffect(() => {
      setSelectedValue(value || "");
    }, [value]);

    // Extract display value from items
    let displayPlaceholder = "Choose...";
    let displayItem = "";
    
    React.Children.forEach(children, (child) => {
      if (React.isValidElement(child) && child.type === SelectContent) {
        const selectContent = child as React.ReactElement<any>;
        React.Children.forEach(selectContent.props.children, (contentChild) => {
          if (React.isValidElement(contentChild)) {
            const selectItem = contentChild as React.ReactElement<any>;
            if (contentChild.type === SelectItem && selectItem.props.value === selectedValue) {
              displayItem = selectItem.props.children;
            }
          }
        });
      }
      if (React.isValidElement(child) && child.type === SelectTrigger) {
        const selectTrigger = child as React.ReactElement<any>;
        React.Children.forEach(selectTrigger.props.children, (triggerChild) => {
          if (React.isValidElement(triggerChild) && triggerChild.type === SelectValue) {
            const selectValue = triggerChild as React.ReactElement<any>;
            displayPlaceholder = selectValue.props.placeholder || "Choose...";
          }
        });
      }
    });

    return (
      <div
        ref={containerRef}
        className={clsx("relative pointer-events-auto", className)}
        {...props}
      >
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            if (child.type === SelectTrigger) {
              return React.cloneElement(child as React.ReactElement<any>, {
                onClick: () => setIsOpen(!isOpen),
                isOpen,
                selectedValue,
                displayValue: displayItem || displayPlaceholder,
              });
            } else if (child.type === SelectContent) {
              return React.cloneElement(child as React.ReactElement<any>, {
                isOpen,
                onSelect: (val: string) => {
                  setSelectedValue(val);
                  onValueChange?.(val);
                  setIsOpen(false);
                },
                selectedValue,
              });
            }
          }
          return child;
        })}
      </div>
    );
  }
);
Select.displayName = "Select";

export interface SelectTriggerProps extends React.HTMLAttributes<HTMLDivElement> {
  isOpen?: boolean;
  selectedValue?: string;
  displayValue?: string;
}

export const SelectTrigger = React.forwardRef<HTMLDivElement, SelectTriggerProps>(
  ({ className, isOpen, selectedValue, displayValue, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={clsx(
          "flex items-center justify-between cursor-pointer border border-slate-300 px-3 py-2 rounded-md bg-white hover:bg-slate-50 transition-colors w-full pointer-events-auto",
          isOpen && "border-blue-500 ring-2 ring-blue-500 ring-offset-2",
          className
        )}
        {...props}
      >
        <span className="text-sm">{displayValue || "Choose..."}</span>
        <ChevronDown className={clsx("h-4 w-4 transition-transform", isOpen && "rotate-180")} />
      </div>
    );
  }
);
SelectTrigger.displayName = "SelectTrigger";

export interface SelectContentProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onSelect'> {
  isOpen?: boolean;
  onSelect?: (value: string) => void;
  selectedValue?: string;
}

export const SelectContent = React.forwardRef<HTMLDivElement, SelectContentProps>(
  ({ className, isOpen, onSelect, selectedValue, children, ...props }, ref) => {
    if (!isOpen) return null;

    return (
      <div
        ref={ref}
        className={clsx(
          "absolute top-full left-0 right-0 z-[100] mt-1 rounded-md bg-white border border-slate-300 shadow-lg overflow-y-auto max-h-[200px] pointer-events-auto",
          className
        )}
        onClick={(e) => e.stopPropagation()}
        {...props}
      >
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child) && child.type === SelectItem) {
            const selectItem = child as React.ReactElement<any>;
            return React.cloneElement(selectItem, {
              onSelect,
              isSelected: selectItem.props.value === selectedValue,
            });
          }
          return child;
        })}
      </div>
    );
  }
);
SelectContent.displayName = "SelectContent";

export interface SelectItemProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onSelect'> {
  value: string;
  disabled?: boolean;
  onSelect?: (value: string) => void;
  isSelected?: boolean;
}

export const SelectItem = React.forwardRef<HTMLDivElement, SelectItemProps>(
  ({ className, value, disabled, onSelect, isSelected, children, onClick, ...props }, ref) => (
    <div
      ref={ref}
      className={clsx(
        "px-4 py-3 cursor-pointer text-sm transition-colors min-h-[40px] flex items-center",
        disabled ? "opacity-50 cursor-not-allowed bg-slate-50" : "hover:bg-blue-100",
        isSelected && "bg-blue-50 text-blue-700 font-semibold",
        className
      )}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!disabled) {
          onSelect?.(value);
        }
        onClick?.(e);
      }}
      role="option"
      aria-selected={isSelected}
      {...props}
    >
      {children}
    </div>
  )
);
SelectItem.displayName = "SelectItem";

export interface SelectValueProps extends React.HTMLAttributes<HTMLSpanElement> {
  placeholder?: string;
}

export const SelectValue = React.forwardRef<HTMLSpanElement, SelectValueProps>(
  ({ className, placeholder, ...props }, ref) => (
    <span ref={ref} className={clsx("text-slate-600", className)} {...props}>
      {placeholder || "Select..."}
    </span>
  )
);
SelectValue.displayName = "SelectValue";
