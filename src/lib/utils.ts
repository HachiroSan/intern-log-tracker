import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format } from "date-fns";
import { WeekendSystem } from "@/types";
import { DateRange } from "react-day-picker";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const isWeekendDay = (
  date: string,
  weekendSystem: "friday-saturday" | "saturday-sunday"
): boolean => {
  const day = new Date(date).getDay();
  return weekendSystem === "friday-saturday"
    ? day === 5 || day === 6 // Friday or Saturday
    : day === 0 || day === 6; // Sunday or Saturday
};

export const formatDate = (date: string) =>
  format(new Date(date), "dd-MM-yyyy");

export const calculateWorkingDays = (
  weekendSystem: WeekendSystem,
  dateRange: DateRange
) => {
  if (!dateRange.from || !dateRange.to) {
    return 0;
  }

  let workingDays = 0;
  const currentDate = new Date(dateRange.from);
  const endDate = new Date(dateRange.to);

  while (currentDate <= endDate) {
    const day = currentDate.getDay();

    if (weekendSystem === "friday-saturday") {
      if (day !== 5 && day !== 6) {
        // Not Friday or Saturday
        workingDays++;
      }
    } else {
      // saturday-sunday
      if (day !== 0 && day !== 6) {
        // Not Sunday or Saturday
        workingDays++;
      }
    }

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return workingDays;
};
