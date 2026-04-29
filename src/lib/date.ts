const MS_PER_DAY = 24 * 60 * 60 * 1000;

export function todayIso(now = new Date()) {
  return formatIsoDate(now);
}

export function formatIsoDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function parseIsoDate(value: string) {
  if (!value) return null;
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return null;
  return new Date(year, month - 1, day);
}

export function addDays(date: string, days: number) {
  const parsed = parseIsoDate(date);
  if (!parsed) return null;
  parsed.setDate(parsed.getDate() + days);
  return formatIsoDate(parsed);
}

export function daysBetween(start: string, end: string) {
  const startDate = parseIsoDate(start);
  const endDate = parseIsoDate(end);
  if (!startDate || !endDate) return null;
  return Math.ceil((endDate.getTime() - startDate.getTime()) / MS_PER_DAY);
}

export function daysUntil(date: string, from = todayIso()) {
  return daysBetween(from, date);
}

export function dueDateFromArrival(arrivalDate: string, offset: number | null) {
  if (offset === null) return null;
  return addDays(arrivalDate, offset);
}
