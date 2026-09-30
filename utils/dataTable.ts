import { DataTable } from "@cucumber/cucumber";
import { resolveTokens } from "./testDataTokens";

/**
 * Convert a two-column Gherkin table into a typed object, resolve {{tokens}}
 * and fail early with a clear message when a required row is missing.
 */
export function parseTable<K extends string>(table: DataTable, requiredKeys: readonly K[]): Record<K, string> {
  const raw = table.rowsHash();
  const missing = requiredKeys.filter((key) => raw[key] === undefined || raw[key].trim() === "");
  if (missing.length > 0) {
    throw new Error(`Data table is missing required row(s): ${missing.join(", ")}`);
  }
  const resolved: Record<string, string> = {};
  for (const [key, value] of Object.entries(raw)) resolved[key] = resolveTokens(value.trim());
  return resolved as Record<K, string>;
}
