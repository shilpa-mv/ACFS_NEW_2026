import { Page, Request } from "@playwright/test";
import { Logger } from "../utils/logger";

const TRACKED_TYPES = new Set(["xhr", "fetch", "document"]);

/**
 * Tracks in-flight XHR/fetch calls so page objects can wait for the UI to settle
 * instead of using fixed sleeps. Playwright's waitForLoadState('networkidle') does
 * not help on single-page apps once the page has loaded, so this fills the gap.
 */
export class NetworkTracker {
  private readonly inflight = new Set<Request>();
  private lastActivity = Date.now();

  constructor(page: Page) {
    const done = (request: Request): void => {
      if (this.inflight.delete(request)) this.lastActivity = Date.now();
    };
    page.on("request", (request) => {
      if (!TRACKED_TYPES.has(request.resourceType())) return;
      this.inflight.add(request);
      this.lastActivity = Date.now();
    });
    page.on("requestfinished", done);
    page.on("requestfailed", done);
  }

  /** Resolves when nothing has been in flight for `quietMs`, or after `timeoutMs` (never throws). */
  async waitForIdle(quietMs = 500, timeoutMs = 8_000): Promise<void> {
    const started = Date.now();
    while (Date.now() - started < timeoutMs) {
      if (this.inflight.size === 0 && Date.now() - this.lastActivity >= quietMs) return;
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    Logger.debug(`Network still busy after ${timeoutMs} ms (${this.inflight.size} request(s) in flight)`);
  }
}

export const trackers = new WeakMap<Page, NetworkTracker>();
