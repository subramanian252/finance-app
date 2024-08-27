import { type ClassValue, clsx } from "clsx";
import { eachDayOfInterval, format, subDays } from "date-fns";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function convertAmountToMilliUnits(amount: number) {
  return Math.round(amount * 1000);
}

export function convertMilliUnitsToAmount(milliUnits: number) {
  return milliUnits / 1000;
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

export function calculatePercentageChange(current: number, previous: number) {
  if (previous === 0) {
    return previous === current ? 0 : 100;
  }
  return ((current - previous) / previous) * 100;
}

export function fillMissingDays(
  activeDays: { date: Date; income: number; expenses: number }[],
  startDate: Date,
  endDate: Date
) {
  if (activeDays.length === 0) {
    return [];
  }

  const allDays = eachDayOfInterval({ start: startDate, end: endDate });

  const tranactionsByDay = allDays.map((date) => {
    const found = activeDays.find((d) => d.date === date);

    if (found) {
      return found;
    } else {
      return { date, income: 0, expenses: 0 };
    }
  });

  return tranactionsByDay;
}
