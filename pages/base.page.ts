import { Locator, Page } from "@playwright/test";
import { trackers } from "../playwright-utils/networkTracker";

export class BasePage {
  constructor(protected readonly page: Page) {}

  async navigation(url: string): Promise<void> {
    await this.page.goto(url, { waitUntil: "domcontentloaded" });
  }

  /** Wait until the single-page app has finished its XHR/fetch calls (replaces fixed sleeps). */
  protected async waitForUiIdle(quietMs = 500, timeoutMs = 8_000): Promise<void> {
    await trackers.get(this.page)?.waitForIdle(quietMs, timeoutMs);
  }

  /** Click a menu item / button and let the resulting screen settle. */
  protected async clickAndSettle(target: Locator): Promise<void> {
    await target.click();
    await this.waitForUiIdle();
  }

  /** Open a native <select>, or a custom dropdown, and choose an option by its visible name. */
  protected async chooseOption(opener: Locator, optionName: string | RegExp, exact = false): Promise<void> {
    await opener.click();
    await this.page.getByRole("option", { name: optionName, exact }).first().click();
    await this.waitForUiIdle();
  }
}
