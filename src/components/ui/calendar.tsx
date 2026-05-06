import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { cn } from "@/lib/utils";
import "react-day-picker/dist/style.css";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-2", className)}
      classNames={{
        months: "flex flex-col space-y-2",
        month: "space-y-2",
        caption: "flex justify-center pt-1 relative items-center h-7",
        caption_label: "text-xs font-semibold",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          "h-6 w-6 bg-transparent p-0 opacity-50 hover:opacity-100 transition-opacity"
        ),
        nav_button_previous: "absolute left-0",
        nav_button_next: "absolute right-0",
        table: "w-full border-collapse space-y-0.5",
        head_row: "flex",
        head_cell:
          "text-muted-foreground rounded w-7 font-normal text-[0.65rem] h-5 flex items-center justify-center",
        row: "flex w-full mt-0.5",
        cell: "h-5 w-7 text-center text-xs p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l last:[&:has([aria-selected])]:rounded-r focus-within:relative focus-within:z-20",
        day: cn(
          "h-5 w-7 p-0 font-normal text-xs aria-selected:opacity-100 rounded hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-1 focus:ring-ring transition-colors"
        ),
        day_selected:
          "bg-blue-600 text-white hover:bg-blue-700 focus:bg-blue-600 focus:text-white",
        day_today: "bg-slate-100 text-slate-900 font-semibold",
        day_outside:
          "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
        day_disabled: "text-muted-foreground opacity-30 cursor-not-allowed",
        day_range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ ...props }) => (
          <ChevronLeft className="h-3 w-3" {...props} />
        ),
        IconRight: ({ ...props }) => (
          <ChevronRight className="h-3 w-3" {...props} />
        ),
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
