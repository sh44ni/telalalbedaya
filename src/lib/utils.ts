import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency: string = "OMR"): string {
  return new Intl.NumberFormat("en-OM", {
    style: "currency",
    currency: currency,
  }).format(amount);
}

export function formatDate(date: Date | string | undefined | null, locale: string = "en"): string {
  if (!date) return "-";
  try {
    const d = typeof date === "string" ? new Date(date) : date;
    if (isNaN(d.getTime())) return "-";
    return new Intl.DateTimeFormat(locale === "ar" ? "ar-AE" : "en-AE", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(d);
  } catch {
    return "-";
  }
}

export function formatNumber(num: number, locale: string = "en"): string {
  return new Intl.NumberFormat(locale === "ar" ? "ar-AE" : "en-AE").format(num);
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + "...";
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    active: "bg-success text-success-foreground",
    pending: "bg-warning text-warning-foreground",
    completed: "bg-primary text-primary-foreground",
    overdue: "bg-destructive text-destructive-foreground",
    cancelled: "bg-muted text-muted-foreground",
  };
  return colors[status.toLowerCase()] || "bg-muted text-muted-foreground";
}
