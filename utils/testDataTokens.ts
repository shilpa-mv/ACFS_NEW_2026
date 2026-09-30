/**
 * Lets feature files use unique values so reruns do not collide, e.g.
 *   | CustomerReferenceNumber | CRN{{digits:6}} |
 * Supported: {{digits:N}}, {{alpha:N}}, {{timestamp}}
 */
export function resolveTokens(value: string): string {
  return value.replace(/\{\{\s*(digits|alpha|timestamp)(?::(\d+))?\s*\}\}/gi, (_m, kind: string, len?: string) => {
    const n = Number(len ?? 6);
    switch (kind.toLowerCase()) {
      case "digits":
        return Array.from({ length: n }, () => Math.floor(Math.random() * 10)).join("");
      case "alpha":
        return Array.from({ length: n }, () => String.fromCharCode(65 + Math.floor(Math.random() * 26))).join("");
      default:
        return String(Date.now());
    }
  });
}
