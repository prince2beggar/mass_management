import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency = "৳"): string {
  return `${currency} ${amount.toLocaleString("en-BD", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function formatDate(date: string | Date, locale: "en" | "bn" = "en"): string {
  const d = typeof date === "string" ? new Date(date) : date;
  if (locale === "bn") {
    return d.toLocaleDateString("bn-BD", { day: "numeric", month: "long", year: "numeric" });
  }
  return d.toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });
}
