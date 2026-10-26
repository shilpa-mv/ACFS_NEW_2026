import { Browser, BrowserContext, BrowserType, chromium, firefox, webkit } from "@playwright/test";
import { ENV, PATHS } from "../config/env";

const launchers: Record<string, BrowserType> = { chromium, firefox, webkit };

/** One browser per worker process; every scenario gets its own isolated context. */
export class BrowserManager {
  private static browser?: Browser;

  static async launch(): Promise<Browser> {
  if (!this.browser) {
    const type = launchers[ENV.browser] ?? chromium;
    this.browser = await type.launch({
      headless: ENV.headless,
      slowMo: ENV.slowMo,
      args: !ENV.headless && ENV.browser === "chromium" ? ["--start-maximized"] : [],
    });
  }
  return this.browser;
}

static async newContext(): Promise<BrowserContext> {
  const browser = await this.launch();
  return browser.newContext({
    ignoreHTTPSErrors: true,
    acceptDownloads: true,
    viewport: ENV.headless ? ENV.viewport : null, // visible runs follow the real window
    recordVideo: ENV.video === "off" ? undefined : { dir: PATHS.videos, size: ENV.viewport },
  });
}

  static async close(): Promise<void> {
    await this.browser?.close();
    this.browser = undefined;
  }
}
