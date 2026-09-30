/** "Today" -> today, "Today+5" -> five days from today. */
export function resolveRelativeDate(value: string): Date {
  const match = /^today\s*(?:\+\s*(\d+))?$/i.exec(value.trim());
  if (!match) throw new Error(`Unsupported date value "${value}". Use "Today" or "Today+N".`);
  const date = new Date();
  date.setDate(date.getDate() + Number(match[1] ?? 0));
  return date;
}

/** Label used by the portal's date picker, e.g. "September 29," */
export function toPickerLabel(date: Date): string {
  return `${date.toLocaleDateString("en-US", { month: "long", day: "numeric" })},`;
}
